/**
 * Toy model for the "training is drift plus shake" figure.
 *
 * Linear regression with two parameters w = (w1, w2) on N synthetic examples:
 *
 *   L(w) = (1 / 2N) * sum_i (w . x_i - y_i)^2
 *
 * This is exactly quadratic: L(w) = L_min + 1/2 (w - w_hat)^T H (w - w_hat), with
 * H = X^T X / N. Per-example gradient: g_i = x_i (w . x_i - y_i). The mini-batch
 * gradient is the mean of g_i over a batch drawn WITHOUT replacement each step.
 *
 * Everything is seeded (mulberry32); there is no Math.random and no Date.
 */
import { gaussian, mulberry32, type Rng } from "@/lib/viz/rng"

export const N_EXAMPLES = 256
export const BATCH_SIZES = [1, 4, 16, 64, 256] as const
export const LEARNING_RATES = [
  0.005, 0.007, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6,
] as const
export const N_RUNS = 40
/** Excess loss above this counts as "diverged" (the start is at ~15). */
export const DIVERGENCE_EXCESS = 1e4

export const START: readonly [number, number] = [-2.2, 2.0]
const TARGET_EIGENVALUES = [4.0, 0.4] as const // large first
const TARGET_ANGLE = Math.PI / 6 // 30 degrees: rotation of the valley's long axis
const W_STAR: readonly [number, number] = [1.0, 0.5]
const SIGMA_Y = 0.8
const DATA_SEED = 20240611

export type Vec2 = readonly [number, number]
/** Symmetric 2x2 matrix [a, b; b, c] stored as [a, b, c]. */
export type Sym2 = readonly [number, number, number]

export interface Problem {
  n: number
  /** Row-major N x 2 features. */
  x: Float64Array
  y: Float64Array
  /** H = X^T X / N. */
  hessian: Sym2
  /** Eigenvalues of H, descending, with unit eigenvectors. */
  lambda: readonly [number, number]
  eigenvectors: readonly [Vec2, Vec2]
  /** X^T y / N. */
  xty: Vec2
  /** Exact minimiser H^-1 X^T y / N (not exactly the generating w*). */
  optimum: Vec2
  lossMin: number
  generatingWeights: Vec2
  sigmaY: number
  /** Per-example gradient covariance at the optimum: (1/N) sum g_i g_i^T. */
  gradCov: Sym2
}

function eigenSym2(m: Sym2): { values: [number, number]; vectors: [Vec2, Vec2] } {
  const [a, b, c] = m
  const mean = (a + c) / 2
  const radius = Math.hypot((a - c) / 2, b)
  const theta = 0.5 * Math.atan2(2 * b, a - c)
  const v1: Vec2 = [Math.cos(theta), Math.sin(theta)]
  const v2: Vec2 = [-Math.sin(theta), Math.cos(theta)]
  return { values: [mean + radius, mean - radius], vectors: [v1, v2] }
}

let cachedProblem: Problem | null = null

export function getProblem(): Problem {
  if (!cachedProblem) cachedProblem = buildProblem()
  return cachedProblem
}

export function buildProblem(
  n = N_EXAMPLES,
  seed = DATA_SEED,
  eigenvalues: readonly [number, number] = TARGET_EIGENVALUES,
  angle = TARGET_ANGLE,
  sigmaY = SIGMA_Y,
  wStar: Vec2 = W_STAR,
): Problem {
  const rng = mulberry32(seed)
  const z = new Float64Array(n * 2)
  for (let i = 0; i < z.length; i += 1) z[i] = gaussian(rng)

  // Whiten the raw sample so the second-moment matrix is exactly I, then colour it
  // so that H has exactly the requested eigenvalues and axis rotation.
  let m11 = 0
  let m12 = 0
  let m22 = 0
  for (let i = 0; i < n; i += 1) {
    m11 += z[2 * i] * z[2 * i]
    m12 += z[2 * i] * z[2 * i + 1]
    m22 += z[2 * i + 1] * z[2 * i + 1]
  }
  const raw = eigenSym2([m11 / n, m12 / n, m22 / n])
  const [q1, q2] = raw.vectors
  const inv1 = 1 / Math.sqrt(raw.values[0])
  const inv2 = 1 / Math.sqrt(raw.values[1])
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = new Float64Array(n * 2)
  const y = new Float64Array(n)
  for (let i = 0; i < n; i += 1) {
    const a = z[2 * i]
    const b = z[2 * i + 1]
    // whitened coordinates in the eigenbasis of the raw second moment
    const s1 = (a * q1[0] + b * q1[1]) * inv1
    const s2 = (a * q2[0] + b * q2[1]) * inv2
    // rotate back (symmetric whitening), then scale axes by sqrt(lambda), then rotate by `angle`
    const wa = s1 * q1[0] + s2 * q2[0]
    const wb = s1 * q1[1] + s2 * q2[1]
    const c1 = wa * Math.sqrt(eigenvalues[0])
    const c2 = wb * Math.sqrt(eigenvalues[1])
    // eigenvector of the large eigenvalue points at angle + 90 degrees, the small one at `angle`
    x[2 * i] = c2 * cos - c1 * sin
    x[2 * i + 1] = c2 * sin + c1 * cos
  }
  // Noise is generated after the features so changing sigmaY never moves the features.
  for (let i = 0; i < n; i += 1) {
    y[i] = wStar[0] * x[2 * i] + wStar[1] * x[2 * i + 1] + sigmaY * gaussian(rng)
  }

  let h11 = 0
  let h12 = 0
  let h22 = 0
  let b1 = 0
  let b2 = 0
  for (let i = 0; i < n; i += 1) {
    const u = x[2 * i]
    const v = x[2 * i + 1]
    h11 += u * u
    h12 += u * v
    h22 += v * v
    b1 += u * y[i]
    b2 += v * y[i]
  }
  const hessian: Sym2 = [h11 / n, h12 / n, h22 / n]
  const xty: Vec2 = [b1 / n, b2 / n]
  const det = hessian[0] * hessian[2] - hessian[1] * hessian[1]
  const optimum: Vec2 = [
    (hessian[2] * xty[0] - hessian[1] * xty[1]) / det,
    (-hessian[1] * xty[0] + hessian[0] * xty[1]) / det,
  ]
  const eig = eigenSym2(hessian)

  const problem: Problem = {
    n,
    x,
    y,
    hessian,
    lambda: eig.values,
    eigenvectors: eig.vectors,
    xty,
    optimum,
    lossMin: 0,
    generatingWeights: wStar,
    sigmaY,
    gradCov: [0, 0, 0],
  }
  problem.lossMin = loss(problem, optimum)

  let c11 = 0
  let c12 = 0
  let c22 = 0
  for (let i = 0; i < n; i += 1) {
    const g = exampleGradient(problem, i, optimum)
    c11 += g[0] * g[0]
    c12 += g[0] * g[1]
    c22 += g[1] * g[1]
  }
  problem.gradCov = [c11 / n, c12 / n, c22 / n]
  return problem
}

/** Direct evaluation of L(w) over the data (not through the quadratic form). */
export function loss(p: Problem, w: Vec2): number {
  let sum = 0
  for (let i = 0; i < p.n; i += 1) {
    const r = w[0] * p.x[2 * i] + w[1] * p.x[2 * i + 1] - p.y[i]
    sum += r * r
  }
  return sum / (2 * p.n)
}

/** L(w) - L_min through the exact quadratic form 1/2 u^T H u. */
export function excessLoss(p: Problem, w: Vec2): number {
  const u0 = w[0] - p.optimum[0]
  const u1 = w[1] - p.optimum[1]
  const [a, b, c] = p.hessian
  return 0.5 * (a * u0 * u0 + 2 * b * u0 * u1 + c * u1 * u1)
}

export function exampleGradient(p: Problem, i: number, w: Vec2): Vec2 {
  const r = w[0] * p.x[2 * i] + w[1] * p.x[2 * i + 1] - p.y[i]
  return [p.x[2 * i] * r, p.x[2 * i + 1] * r]
}

/** Full-batch gradient H w - X^T y / N. */
export function fullGradient(p: Problem, w: Vec2): Vec2 {
  const [a, b, c] = p.hessian
  return [a * w[0] + b * w[1] - p.xty[0], b * w[0] + c * w[1] - p.xty[1]]
}

export function batchGradient(p: Problem, w: Vec2, indices: ArrayLike<number>, count = indices.length): Vec2 {
  let g0 = 0
  let g1 = 0
  for (let k = 0; k < count; k += 1) {
    const i = indices[k]
    const x0 = p.x[2 * i]
    const x1 = p.x[2 * i + 1]
    const r = w[0] * x0 + w[1] * x1 - p.y[i]
    g0 += x0 * r
    g1 += x1 * r
  }
  return [g0 / count, g1 / count]
}

export type Schedule = "constant" | "cosine"

/** Learning rate used by update number t (0-based) out of `steps`. Cosine decays to ~0. */
export function etaAt(schedule: Schedule, eta0: number, t: number, steps: number): number {
  if (schedule === "constant") return eta0
  return eta0 * 0.5 * (1 + Math.cos((Math.PI * (t + 0.5)) / steps))
}

/** Largest stable eta for full-batch heavy-ball momentum on this quadratic: 2 (1 + beta) / lambda_max. */
export function stabilityLimit(p: Problem, momentum = 0): number {
  return (2 * (1 + momentum)) / p.lambda[0]
}

export interface RunOptions {
  eta: number
  /** Mini-batch size; >= N (or 'full') means exact full-batch gradient descent. */
  batch: number
  steps: number
  momentum?: number
  schedule?: Schedule
  seed: number
  start?: Vec2
}

export interface RunResult {
  /** (steps + 1) x 2 positions, row-major. After divergence the rest repeats the last finite point. */
  path: Float64Array
  /** excess loss at every position, length steps + 1 (after divergence: Infinity). */
  excess: Float64Array
  final: Vec2
  diverged: boolean
  /** First step index whose position exceeded the divergence threshold (or -1). */
  divergedAt: number
}

/** Seed for run k of an ensemble that belongs to `seed`. */
export function runSeed(seed: number, k: number): number {
  return (Math.imul(seed + 1, 0x9e3779b1) ^ Math.imul(k + 1, 0x85ebca6b)) >>> 0
}

export function runSgd(p: Problem, options: RunOptions): RunResult {
  const { eta, batch, steps, momentum = 0, schedule = "constant", seed, start = START } = options
  const rng = mulberry32(seed)
  const full = batch >= p.n
  const pool = full ? new Uint16Array(0) : Uint16Array.from({ length: p.n }, (_, i) => i)
  const path = new Float64Array((steps + 1) * 2)
  const excess = new Float64Array(steps + 1)
  let w0 = start[0]
  let w1 = start[1]
  let v0 = 0
  let v1 = 0
  path[0] = w0
  path[1] = w1
  excess[0] = excessLoss(p, start)
  let divergedAt = -1

  for (let t = 0; t < steps; t += 1) {
    if (divergedAt >= 0) {
      path[2 * (t + 1)] = path[2 * t]
      path[2 * (t + 1) + 1] = path[2 * t + 1]
      excess[t + 1] = Infinity
      continue
    }
    let g: Vec2
    if (full) {
      g = fullGradient(p, [w0, w1])
    } else {
      sampleBatch(rng, pool, batch)
      g = batchGradient(p, [w0, w1], pool, batch)
    }
    const lr = etaAt(schedule, eta, t, steps)
    v0 = momentum * v0 - lr * g[0]
    v1 = momentum * v1 - lr * g[1]
    w0 += v0
    w1 += v1
    const e = excessLoss(p, [w0, w1])
    if (!Number.isFinite(e) || e > DIVERGENCE_EXCESS) {
      divergedAt = t + 1
      path[2 * (t + 1)] = path[2 * t]
      path[2 * (t + 1) + 1] = path[2 * t + 1]
      excess[t + 1] = Infinity
      continue
    }
    path[2 * (t + 1)] = w0
    path[2 * (t + 1) + 1] = w1
    excess[t + 1] = e
  }

  const last = steps
  return {
    path,
    excess,
    final: [path[2 * last], path[2 * last + 1]],
    diverged: divergedAt >= 0,
    divergedAt,
  }
}

/** Full-batch gradient descent with the same eta, schedule and momentum. */
export function runGd(p: Problem, options: Omit<RunOptions, "batch" | "seed"> & { seed?: number }): RunResult {
  return runSgd(p, { ...options, batch: p.n, seed: options.seed ?? 0 })
}

/** Partial Fisher-Yates on a persistent pool: the first k entries are a uniform sample without replacement. */
function sampleBatch(rng: Rng, pool: Uint16Array, k: number) {
  const n = pool.length
  for (let i = 0; i < k; i += 1) {
    const j = i + Math.floor(rng() * (n - i))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }
}

export interface Ensemble {
  runs: number
  finals: Vec2[]
  /** Run 0, which the figure draws as "the" SGD path. */
  first: RunResult
  /** Mean excess loss over the runs, per step (non-diverged runs only). */
  meanExcess: Float64Array
  divergedCount: number
  /** sqrt(mean |w_end - w_hat|^2) over the finite end points. */
  rmsSpread: number
  /** Mean over runs of the final excess loss. */
  meanFinalExcess: number
}

export function runEnsemble(p: Problem, options: RunOptions, runs = N_RUNS): Ensemble {
  const finals: Vec2[] = []
  const meanExcess = new Float64Array(options.steps + 1)
  let first: RunResult | null = null
  let diverged = 0
  let sumSq = 0
  let sumFinalExcess = 0
  let alive = 0
  for (let k = 0; k < runs; k += 1) {
    const r = runSgd(p, { ...options, seed: runSeed(options.seed, k) })
    if (k === 0) first = r
    finals.push(r.final)
    if (r.diverged) {
      diverged += 1
      continue
    }
    alive += 1
    const dx = r.final[0] - p.optimum[0]
    const dy = r.final[1] - p.optimum[1]
    sumSq += dx * dx + dy * dy
    sumFinalExcess += r.excess[options.steps]
    for (let t = 0; t <= options.steps; t += 1) meanExcess[t] += r.excess[t]
  }
  for (let t = 0; t <= options.steps; t += 1) meanExcess[t] = alive ? meanExcess[t] / alive : Infinity
  return {
    runs,
    finals,
    first: first as RunResult,
    meanExcess,
    divergedCount: diverged,
    rmsSpread: alive ? Math.sqrt(sumSq / alive) : Infinity,
    meanFinalExcess: alive ? sumFinalExcess / alive : Infinity,
  }
}

/* ---------------------------- linear-noise theory ---------------------------- */

/**
 * Covariance of the mini-batch gradient noise at the optimum for batches of size B drawn
 * without replacement from N examples: C * (N - B) / (N - 1) / B. It is exactly zero for B = N.
 */
export function batchNoiseCov(p: Problem, batch: number): Sym2 {
  const b = Math.min(batch, p.n)
  const scale = p.n > 1 ? (p.n - b) / (p.n - 1) / b : 1 / b
  return [p.gradCov[0] * scale, p.gradCov[1] * scale, p.gradCov[2] * scale]
}

function mul(a: Sym2, b: Sym2): [number, number, number, number] {
  // product of two symmetric matrices as a full 2x2 [m00, m01, m10, m11]
  return [
    a[0] * b[0] + a[1] * b[1],
    a[0] * b[1] + a[1] * b[2],
    a[1] * b[0] + a[2] * b[1],
    a[1] * b[1] + a[2] * b[2],
  ]
}

/** Stationary covariance of w - w_hat for constant eta, beta = 0: fixed point of S = A S A + eta^2 C_B, A = I - eta H. */
export function stationaryCovariance(p: Problem, eta: number, batch: number): Sym2 {
  const cb = batchNoiseCov(p, batch)
  const [v1, v2] = p.eigenvectors
  const [l1, l2] = p.lambda
  const rotate = (m: Sym2) => {
    // Q^T M Q with Q = [v1 v2]
    const mv1: Vec2 = [m[0] * v1[0] + m[1] * v1[1], m[1] * v1[0] + m[2] * v1[1]]
    const mv2: Vec2 = [m[0] * v2[0] + m[1] * v2[1], m[1] * v2[0] + m[2] * v2[1]]
    return {
      c11: v1[0] * mv1[0] + v1[1] * mv1[1],
      c12: v1[0] * mv2[0] + v1[1] * mv2[1],
      c22: v2[0] * mv2[0] + v2[1] * mv2[1],
    }
  }
  const c = rotate(cb)
  const a1 = 1 - eta * l1
  const a2 = 1 - eta * l2
  const s11 = (eta * eta * c.c11) / (1 - a1 * a1)
  const s12 = (eta * eta * c.c12) / (1 - a1 * a2)
  const s22 = (eta * eta * c.c22) / (1 - a2 * a2)
  // back to the original coordinates: Q S Q^T
  const q = [
    [v1[0], v2[0]],
    [v1[1], v2[1]],
  ]
  const out = (i: number, j: number) =>
    q[i][0] * s11 * q[j][0] + q[i][0] * s12 * q[j][1] + q[i][1] * s12 * q[j][0] + q[i][1] * s22 * q[j][1]
  return [out(0, 0), out(0, 1), out(1, 1)]
}

export interface Prediction {
  /** Expected |w_T - w_hat| root-mean-square: sqrt(|m_T|^2 + tr S_T). */
  rms: number
  /** Covariance S_T of the noise part and mean offset m_T of the end points. */
  covariance: Sym2
  mean: Vec2
  /** Expected excess loss per step (length steps + 1). */
  excess: Float64Array
}

/**
 * Linear-noise prediction for beta = 0 and any learning-rate schedule:
 *   m_{t+1} = A_t m_t,   S_{t+1} = A_t S_t A_t + eta_t^2 C_B,   A_t = I - eta_t H.
 * It treats the gradient noise as additive with the covariance measured at the optimum, so it
 * neglects noise that grows with distance from the optimum. Valid for small eta; returns null
 * when momentum is used (the theory above does not cover it).
 */
export function predictSpread(p: Problem, options: Omit<RunOptions, "seed">): Prediction | null {
  const { eta, batch, steps, momentum = 0, schedule = "constant", start = START } = options
  if (momentum > 0) return null
  const cb = batchNoiseCov(p, batch)
  const h = p.hessian
  let m0 = start[0] - p.optimum[0]
  let m1 = start[1] - p.optimum[1]
  let s: Sym2 = [0, 0, 0]
  const excess = new Float64Array(steps + 1)
  const record = (t: number) => {
    excess[t] =
      0.5 *
      (h[0] * m0 * m0 + 2 * h[1] * m0 * m1 + h[2] * m1 * m1 + h[0] * s[0] + 2 * h[1] * s[1] + h[2] * s[2])
  }
  record(0)
  for (let t = 0; t < steps; t += 1) {
    const lr = etaAt(schedule, eta, t, steps)
    const a: Sym2 = [1 - lr * h[0], -lr * h[1], 1 - lr * h[2]]
    // A is symmetric, so A S A is a product of three symmetric matrices
    const as = mul(a, s)
    const asa: [number, number, number, number] = [
      as[0] * a[0] + as[1] * a[1],
      as[0] * a[1] + as[1] * a[2],
      as[2] * a[0] + as[3] * a[1],
      as[2] * a[1] + as[3] * a[2],
    ]
    s = [asa[0] + lr * lr * cb[0], (asa[1] + asa[2]) / 2 + lr * lr * cb[1], asa[3] + lr * lr * cb[2]]
    const n0 = a[0] * m0 + a[1] * m1
    const n1 = a[1] * m0 + a[2] * m1
    m0 = n0
    m1 = n1
    record(t + 1)
  }
  return {
    rms: Math.sqrt(m0 * m0 + m1 * m1 + s[0] + s[2]),
    covariance: s,
    mean: [p.optimum[0] + m0, p.optimum[1] + m1],
    excess,
  }
}

/** Eigen-decomposition of a symmetric 2x2 matrix, for drawing covariance ellipses. */
export function covarianceEllipse(c: Sym2) {
  const e = eigenSym2(c)
  return {
    radii: [Math.sqrt(Math.max(0, e.values[0])), Math.sqrt(Math.max(0, e.values[1]))] as [number, number],
    axes: e.vectors,
  }
}

/** Points of the level set 1/2 u^T H u = level, as world coordinates around the optimum. */
export function contourPoints(p: Problem, level: number, count = 96): [number, number][] {
  const [v1, v2] = p.eigenvectors
  const r1 = Math.sqrt((2 * level) / p.lambda[0])
  const r2 = Math.sqrt((2 * level) / p.lambda[1])
  const points: [number, number][] = []
  for (let k = 0; k <= count; k += 1) {
    const phi = (2 * Math.PI * k) / count
    const a = r1 * Math.cos(phi)
    const b = r2 * Math.sin(phi)
    points.push([p.optimum[0] + a * v1[0] + b * v2[0], p.optimum[1] + a * v1[1] + b * v2[1]])
  }
  return points
}

/** Learning rate x batch scaling that the figure labels as "temperature": eta / B. */
export function noiseScale(eta: number, batch: number): number {
  return eta / batch
}
