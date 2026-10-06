import { expect, test } from "bun:test"
import {
  DIVERGENCE_EXCESS,
  START,
  batchNoiseCov,
  buildProblem,
  contourPoints,
  etaAt,
  excessLoss,
  exampleGradient,
  fullGradient,
  getProblem,
  loss,
  predictSpread,
  runEnsemble,
  runGd,
  runSeed,
  runSgd,
  stabilityLimit,
  stationaryCovariance,
} from "@/lib/viz/sgdDynamics"

const p = getProblem()

test("data: H has the requested spectrum and the valley is rotated 30 degrees", () => {
  expect(p.n).toBe(256)
  expect(p.lambda[0]).toBeCloseTo(4.0, 9)
  expect(p.lambda[1]).toBeCloseTo(0.4, 9)
  // slow (small-lambda) eigenvector points along 30 degrees from the w1 axis
  const [, slow] = p.eigenvectors
  const angle = (Math.atan2(slow[1], slow[0]) * 180) / Math.PI
  expect(Math.abs((((angle % 180) + 180) % 180) - 30)).toBeLessThan(1e-6)
  // per-example gradients have real variance at the optimum (noise sigma_y = 0.8)
  expect(p.gradCov[0] + p.gradCov[2]).toBeGreaterThan(1)
  // the optimum is near the generating weights (1, 0.5)
  expect(Math.hypot(p.optimum[0] - 1, p.optimum[1] - 0.5)).toBeLessThan(0.2)
})

test("L at the analytic optimum is the minimum; full-batch gradient vanishes there", () => {
  expect(loss(p, p.optimum)).toBeCloseTo(p.lossMin, 12)
  const g = fullGradient(p, p.optimum)
  expect(Math.abs(g[0])).toBeLessThan(1e-12)
  expect(Math.abs(g[1])).toBeLessThan(1e-12)
  for (const d of [
    [0.1, 0],
    [0, -0.1],
    [0.05, 0.07],
  ]) {
    expect(loss(p, [p.optimum[0] + d[0], p.optimum[1] + d[1]])).toBeGreaterThan(p.lossMin)
  }
})

test("loss is exactly the quadratic form L_min + 1/2 u^T H u (contours are exact ellipses)", () => {
  for (const w of [START, [0, 0], [3, -2], [1.3, 0.2]] as const) {
    expect(loss(p, w) - p.lossMin).toBeCloseTo(excessLoss(p, w), 10)
  }
  for (const level of [0.05, 0.5, 4]) {
    for (const pt of contourPoints(p, level, 24)) expect(excessLoss(p, pt as [number, number])).toBeCloseTo(level, 10)
  }
})

test("the average of the per-example gradients is exactly the full-batch gradient", () => {
  for (const w of [START, [0, 0], [1.2, -0.7]] as const) {
    let g0 = 0
    let g1 = 0
    for (let i = 0; i < p.n; i += 1) {
      const g = exampleGradient(p, i, w)
      g0 += g[0]
      g1 += g[1]
    }
    const full = fullGradient(p, w)
    expect(g0 / p.n).toBeCloseTo(full[0], 10)
    expect(g1 / p.n).toBeCloseTo(full[1], 10)
  }
})

test("full-batch GD below 2/lambda_max decreases the loss monotonically and converges to w_hat", () => {
  const limit = stabilityLimit(p)
  expect(limit).toBeCloseTo(0.5, 9)
  for (const eta of [0.05, 0.2, 0.45]) {
    const r = runGd(p, { eta, steps: 3000 })
    expect(r.diverged).toBe(false)
    for (let t = 0; t < 3000; t += 1) expect(r.excess[t + 1]).toBeLessThanOrEqual(r.excess[t] + 1e-15)
    expect(Math.hypot(r.final[0] - p.optimum[0], r.final[1] - p.optimum[1])).toBeLessThan(1e-3)
  }
})

test("runs are deterministic for a fixed seed and differ across seeds", () => {
  const opts = { eta: 0.1, batch: 4, steps: 120, seed: 5 }
  const a = runSgd(p, opts)
  const b = runSgd(p, opts)
  expect(Array.from(a.path)).toEqual(Array.from(b.path))
  const c = runSgd(p, { ...opts, seed: 6 })
  expect(Array.from(c.path)).not.toEqual(Array.from(a.path))
  expect(runSeed(1, 0)).not.toBe(runSeed(2, 0))
  const e1 = runEnsemble(p, opts, 8)
  const e2 = runEnsemble(p, opts, 8)
  expect(e1.finals).toEqual(e2.finals)
})

test("with B = N, SGD is exactly full-batch GD, with or without momentum and decay", () => {
  for (const extra of [{}, { momentum: 0.8 }, { schedule: "cosine" as const }]) {
    const s = runSgd(p, { eta: 0.1, batch: p.n, steps: 80, seed: 3, ...extra })
    const g = runGd(p, { eta: 0.1, steps: 80, ...extra })
    expect(Array.from(s.path)).toEqual(Array.from(g.path))
  }
  // and the mini-batch noise has exactly zero covariance there
  for (const v of batchNoiseCov(p, p.n)) expect(Math.abs(v)).toBe(0)
})

test("mini-batch gradient noise: batches are samples without replacement and shrink like 1/B", () => {
  const c1 = batchNoiseCov(p, 1)
  const c4 = batchNoiseCov(p, 4)
  // (N - B) / (N - 1) / B: B = 1 -> 1, B = 4 -> 252 / 255 / 4
  expect(c4[0] / c1[0]).toBeCloseTo(252 / 255 / 4, 12)
  const trace = (c: readonly number[]) => c[0] + c[2]
  expect(trace(batchNoiseCov(p, 64))).toBeLessThan(trace(batchNoiseCov(p, 16)))
})

/** Stationary-regime spread: long runs so the slow mode (rate eta * 0.4) has relaxed, many runs to average. */
function measuredSpread(eta: number, batch: number, runs = 300, steps = 2400, schedule: "constant" | "cosine" = "constant") {
  return runEnsemble(p, { eta, batch, steps, seed: 11, schedule }, runs).rmsSpread
}

test("endpoint spread scales like sqrt(eta / B): eta/4 halves it, 4B halves it", () => {
  const base = measuredSpread(0.04, 2)
  expect(measuredSpread(0.01, 2) / base).toBeGreaterThan(0.42)
  expect(measuredSpread(0.01, 2) / base).toBeLessThan(0.58)
  expect(measuredSpread(0.04, 8) / base).toBeGreaterThan(0.42)
  expect(measuredSpread(0.04, 8) / base).toBeLessThan(0.58)
})

test("measured stationary spread matches the small-step theory within 25%", () => {
  for (const [eta, batch] of [
    [0.02, 4],
    [0.03, 8],
    [0.01, 1],
  ] as const) {
    const measured = measuredSpread(eta, batch)
    const predicted = predictSpread(p, { eta, batch, steps: 2400 })
    expect(predicted).not.toBeNull()
    expect(Math.abs(measured / (predicted?.rms ?? 1) - 1)).toBeLessThan(0.25)
  }
})

test("stationary covariance solves the discrete Lyapunov equation and the small-eta H S + S H = eta C / B", () => {
  const eta = 0.01
  const batch = 4
  const s = stationaryCovariance(p, eta, batch)
  const cb = batchNoiseCov(p, batch)
  const [a, b, c] = p.hessian
  // H S + S H, componentwise, for symmetric 2x2 matrices
  const lyap = [2 * (a * s[0] + b * s[1]), a * s[1] + b * s[2] + b * s[0] + c * s[1], 2 * (b * s[1] + c * s[2])]
  for (let i = 0; i < 3; i += 1) expect(lyap[i] / (eta * cb[i])).toBeCloseTo(1, 1)
  // exact fixed point: S = A S A + eta^2 C_B
  const A = [1 - eta * a, -eta * b, 1 - eta * c] as const
  const as = [A[0] * s[0] + A[1] * s[1], A[0] * s[1] + A[1] * s[2], A[1] * s[0] + A[2] * s[1], A[1] * s[1] + A[2] * s[2]]
  const asa00 = as[0] * A[0] + as[1] * A[1]
  const asa11 = as[2] * A[1] + as[3] * A[2]
  expect(asa00 + eta * eta * cb[0]).toBeCloseTo(s[0], 12)
  expect(asa11 + eta * eta * cb[2]).toBeCloseTo(s[2], 12)
})

test("SGD noise is shaped by the data: the stationary cloud is far rounder than a thermal ball would be", () => {
  const s = stationaryCovariance(p, 0.02, 4)
  const mean = (s[0] + s[2]) / 2
  const radius = Math.hypot((s[0] - s[2]) / 2, s[1])
  const sgdAspect = Math.sqrt((mean + radius) / (mean - radius))
  // isotropic thermal noise would give S proportional to H^-1: aspect sqrt(lambda_max / lambda_min) = 3.16
  const thermalAspect = Math.sqrt(p.lambda[0] / p.lambda[1])
  expect(thermalAspect).toBeCloseTo(3.162, 2)
  expect(sgdAspect).toBeLessThan(1.6)
})

test("cosine decay drives the learning rate to ~0 and shrinks the final spread", () => {
  const steps = 300
  expect(etaAt("cosine", 0.1, 0, steps)).toBeGreaterThan(0.099)
  expect(etaAt("cosine", 0.1, steps - 1, steps)).toBeLessThan(1e-4)
  expect(etaAt("constant", 0.1, steps - 1, steps)).toBe(0.1)
  for (let t = 1; t < steps; t += 1) expect(etaAt("cosine", 0.1, t, steps)).toBeLessThan(etaAt("cosine", 0.1, t - 1, steps))
  const constant = runEnsemble(p, { eta: 0.1, batch: 4, steps, seed: 2 }, 80).rmsSpread
  const cosine = runEnsemble(p, { eta: 0.1, batch: 4, steps, seed: 2, schedule: "cosine" }, 80).rmsSpread
  expect(cosine).toBeLessThan(constant * 0.5)
  // the same linear-noise theory covers the annealed run
  const predicted = predictSpread(p, { eta: 0.1, batch: 4, steps, schedule: "cosine" })
  expect(Math.abs(cosine / (predicted?.rms ?? 1) - 1)).toBeLessThan(0.3)
})

test("divergence is detected above the stability limit and never yields NaN", () => {
  for (const factor of [1.5, 2, 4]) {
    const eta = factor * stabilityLimit(p)
    const r = runGd(p, { eta, steps: 300 })
    expect(r.diverged).toBe(true)
    expect(r.divergedAt).toBeGreaterThan(0)
    expect(Array.from(r.path).every(Number.isFinite)).toBe(true)
    expect(Number.isFinite(r.final[0])).toBe(true)
    const sgd = runSgd(p, { eta, batch: 16, steps: 300, seed: 1 })
    expect(sgd.diverged).toBe(true)
  }
  const ok = runGd(p, { eta: 0.4, steps: 300 })
  expect(ok.diverged).toBe(false)
  expect(ok.excess[300]).toBeLessThan(DIVERGENCE_EXCESS)
  // momentum widens the stable range to 2(1 + beta) / lambda_max
  expect(stabilityLimit(p, 0.5)).toBeCloseTo(0.75, 9)
  expect(runGd(p, { eta: 0.6, steps: 400, momentum: 0.5 }).diverged).toBe(false)
  expect(runGd(p, { eta: 0.6, steps: 400, momentum: 0 }).diverged).toBe(true)
})

test("noise lowers the SGD stability limit below the full-batch limit for tiny batches", () => {
  const eta = 0.3
  expect(runGd(p, { eta, steps: 300 }).diverged).toBe(false)
  expect(runEnsemble(p, { eta, batch: 1, steps: 300, seed: 1 }, 20).divergedCount).toBeGreaterThan(0)
  expect(runEnsemble(p, { eta, batch: 64, steps: 300, seed: 1 }, 20).divergedCount).toBe(0)
})

test("a different dataset seed or noise level changes the optimum but not the spectrum", () => {
  const other = buildProblem(256, 7)
  expect(other.lambda[0]).toBeCloseTo(4, 9)
  expect(other.lambda[1]).toBeCloseTo(0.4, 9)
  expect(other.optimum).not.toEqual(p.optimum)
})
