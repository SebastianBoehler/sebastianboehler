import { expect, test } from "bun:test"
import {
  BASIS_CENTRES,
  EVAL_GRID,
  LAMBDA_INDEX_MAX,
  N_BASIS,
  OBS_END,
  SLIGHTLY_WRONG_LAW,
  TRUE_LAW,
  WRONG_DAMPING_LAW,
  dataSystem,
  evaluate,
  fitModel,
  lambdaFromIndex,
  lossTerms,
  makeSensors,
  metricsFor,
  rbf,
  solveCholesky,
  solveFit,
  solveGaussian,
  sweepOutsideRmse,
  trueDerivatives,
  trueSolution,
} from "@/lib/viz/physicsInformed"

const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8]

test("RBF first and second derivatives match finite differences", () => {
  const h = 1e-5
  for (const centre of [BASIS_CENTRES[0], BASIS_CENTRES[10], BASIS_CENTRES[35]]) {
    for (const t of [centre - 0.9, centre - 0.2, centre, centre + 0.4, centre + 1.1]) {
      const r = rbf(t, centre)
      const plus = rbf(t + h, centre)
      const minus = rbf(t - h, centre)
      expect(r.d1).toBeCloseTo((plus.phi - minus.phi) / (2 * h), 6)
      expect(r.d2).toBeCloseTo((plus.d1 - minus.d1) / (2 * h), 6)
    }
  }
  // peak value is 1 and curvature at the centre is -1/s^2
  expect(rbf(2, 2).phi).toBe(1)
  expect(rbf(2, 2).d2).toBeCloseTo(-1 / 0.55 ** 2, 12)
})

test("the true solution satisfies the ODE and the initial conditions", () => {
  expect(trueSolution(0)).toBeCloseTo(1, 12)
  expect(trueDerivatives(0).du).toBeCloseTo(0, 12)
  for (const law of [TRUE_LAW, SLIGHTLY_WRONG_LAW, WRONG_DAMPING_LAW]) {
    expect(trueSolution(0, law)).toBeCloseTo(1, 12)
    expect(trueDerivatives(0, law).du).toBeCloseTo(0, 12)
    for (const t of [0.3, 1.7, 4.2, 9.9]) {
      const { du, ddu } = trueDerivatives(t, law)
      expect(ddu + law.c * du + law.k * trueSolution(t, law)).toBeCloseTo(0, 10)
    }
  }
  // analytic derivative agrees with a finite difference
  const h = 1e-6
  expect(trueDerivatives(2.5).du).toBeCloseTo((trueSolution(2.5 + h) - trueSolution(2.5 - h)) / (2 * h), 6)
})

test("Cholesky and Gaussian solvers solve a known system", () => {
  const a = [
    [4, 1, 0],
    [1, 3, 1],
    [0, 1, 2],
  ]
  const x = [1, -2, 3]
  const b = a.map((row) => row.reduce((s, v, j) => s + v * x[j], 0))
  const c = solveCholesky(a, b)
  expect(c).not.toBeNull()
  c?.forEach((v, i) => expect(v).toBeCloseTo(x[i], 12))
  solveGaussian(a, b).forEach((v, i) => expect(v).toBeCloseTo(x[i], 12))
  // non-SPD input is rejected by Cholesky, but Gaussian still solves it
  expect(solveCholesky([[0, 1], [1, 0]], [1, 2])).toBeNull()
  solveGaussian([[0, 1], [1, 0]], [1, 2]).forEach((v, i) => expect(v).toBeCloseTo([2, 1][i], 12))
})

test("the solver returns the minimiser of the stated loss", () => {
  const sensors = makeSensors(3, 8, 0.1)
  const w = fitModel(sensors, 30, TRUE_LAW)
  const best = lossTerms(w, sensors, 30, TRUE_LAW).total
  for (let j = 0; j < N_BASIS; j += 7) {
    for (const eps of [-1e-3, 1e-3]) {
      const w2 = [...w]
      w2[j] += eps
      expect(lossTerms(w2, sensors, 30, TRUE_LAW).total).toBeGreaterThan(best)
    }
  }
})

test("sensors live in the observed window, are deterministic, and nest as n grows", () => {
  const a = makeSensors(5, 12, 0.1)
  expect(a).toEqual(makeSensors(5, 12, 0.1))
  expect(a.t.every((t) => t >= 0 && t <= OBS_END)).toBe(true)
  expect(a.t.length).toBe(12)
  expect(makeSensors(6, 12, 0.1)).not.toEqual(a)
  const noiseless = makeSensors(5, 12, 0)
  noiseless.t.forEach((t, i) => expect(noiseless.y[i]).toBeCloseTo(trueSolution(t), 12))
  // changing sigma scales the same noise draw
  const quiet = makeSensors(5, 12, 0.05)
  a.y.forEach((y, i) => expect(y - trueSolution(a.t[i])).toBeCloseTo(2 * (quiet.y[i] - trueSolution(quiet.t[i])), 12))
})

test("lambda = 0 with many noiseless sensors across the whole domain recovers the truth", () => {
  const t = Array.from({ length: 60 }, (_, i) => (i * 10) / 59)
  const sensors = { t, y: t.map((x) => trueSolution(x)) }
  const m = metricsFor(fitModel(sensors, 0, TRUE_LAW))
  expect(m.rmseInside).toBeLessThan(0.01)
  expect(m.rmseOutside).toBeLessThan(0.01)
})

test("lambda = 0 data-only fit matches sensors but is unreliable outside the window", () => {
  for (const seed of SEEDS) {
    const sensors = makeSensors(seed, 8, 0.08)
    const w = fitModel(sensors, 0, TRUE_LAW)
    const { data } = lossTerms(w, sensors, 0, TRUE_LAW)
    expect(Math.sqrt(data)).toBeLessThan(0.08) // matches the readings to within the noise level
    expect(metricsFor(w).rmseOutside).toBeGreaterThan(0.15) // but is poor where there are no sensors
  }
})

test("a correct law pins down the extrapolation by a large factor, across seeds", () => {
  for (const seed of SEEDS) {
    for (const n of [6, 8, 16]) {
      const sensors = makeSensors(seed, n, 0.08)
      const dataOnly = metricsFor(fitModel(sensors, 0, TRUE_LAW))
      const physics = metricsFor(fitModel(sensors, 30, TRUE_LAW))
      expect(physics.rmseOutside).toBeLessThan(dataOnly.rmseOutside / 3)
      expect(physics.rmseOutside).toBeLessThan(0.1)
    }
  }
})

test("a wrong law is worse than the correct law, and its error does not shrink with more data", () => {
  for (const seed of SEEDS) {
    const sensors = makeSensors(seed, 8, 0.08)
    const good = metricsFor(fitModel(sensors, 300, TRUE_LAW))
    const bad = metricsFor(fitModel(sensors, 300, SLIGHTLY_WRONG_LAW))
    expect(bad.rmseOutside).toBeGreaterThan(5 * good.rmseOutside)
    expect(bad.rmseInside).toBeGreaterThan(good.rmseInside)
    // plenty of clean data cannot rescue a wrong law with a heavy weight
    const clean = metricsFor(fitModel(makeSensors(seed, 24, 0), 300, SLIGHTLY_WRONG_LAW))
    expect(clean.rmseOutside).toBeGreaterThan(0.2)
    // while the correct law with the same clean data is nearly exact
    expect(metricsFor(fitModel(makeSensors(seed, 24, 0), 300, TRUE_LAW)).rmseOutside).toBeLessThan(0.02)
    // and a wrong law at large weight can be worse than no physics at all on clean data
    expect(clean.rmseOutside).toBeGreaterThan(metricsFor(fitModel(makeSensors(seed, 24, 0), 0, TRUE_LAW)).rmseOutside)
  }
})

test("under the true law, the physics-informed fit has a lower residual than the data-only fit", () => {
  for (const seed of SEEDS) {
    const sensors = makeSensors(seed, 8, 0.08)
    const dataOnly = metricsFor(fitModel(sensors, 0, TRUE_LAW))
    const physics = metricsFor(fitModel(sensors, 30, TRUE_LAW))
    expect(physics.lawResidual).toBeLessThan(dataOnly.lawResidual / 10)
  }
})

test("the law term does little at tiny lambda and its effect grows monotonically-ish with lambda", () => {
  const sensors = makeSensors(1, 8, 0.08)
  const system = dataSystem(sensors)
  const out = (lambda: number) => metricsFor(solveFit(system, lambda, TRUE_LAW)).rmseOutside
  const dataOnly = out(0)
  expect(Math.abs(out(1e-7) - dataOnly)).toBeLessThan(0.05 * dataOnly)
  expect(out(1e-2)).toBeLessThan(out(1e-5))
  expect(out(10)).toBeLessThan(out(1e-3))
  // the law residual (true law) falls as lambda rises
  const resid = (lambda: number) => metricsFor(solveFit(system, lambda, TRUE_LAW)).lawResidual
  expect(resid(1)).toBeLessThan(resid(1e-3))
  expect(resid(1e3)).toBeLessThan(resid(1))
})

test("lambda grid and sweep are consistent with direct fits", () => {
  expect(lambdaFromIndex(0)).toBe(0)
  expect(lambdaFromIndex(1)).toBeCloseTo(1e-5, 12)
  expect(lambdaFromIndex(LAMBDA_INDEX_MAX)).toBeCloseTo(1e3, 9)
  const sensors = makeSensors(2, 10, 0.05)
  const sweep = sweepOutsideRmse(sensors)
  expect(sweep.length).toBe(LAMBDA_INDEX_MAX)
  const i = 14
  expect(sweep[i - 1].lambda).toBe(lambdaFromIndex(i))
  expect(sweep[i - 1].slightlyWrong).toBeCloseTo(
    metricsFor(fitModel(sensors, lambdaFromIndex(i), SLIGHTLY_WRONG_LAW)).rmseOutside,
    12,
  )
})

test("fits and metrics are deterministic and finite on the dense grid", () => {
  const a = fitModel(makeSensors(9, 8, 0.08), 30, TRUE_LAW)
  const b = fitModel(makeSensors(9, 8, 0.08), 30, TRUE_LAW)
  expect(a).toEqual(b)
  const curve = evaluate(a, EVAL_GRID)
  expect(curve.u.every(Number.isFinite)).toBe(true)
  expect(EVAL_GRID.length).toBe(201)
})
