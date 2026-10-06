/**
 * Physics-informed fitting, reduced to its linear core.
 *
 * System: damped harmonic oscillator  u'' + c u' + k u = 0,  u(0)=1, u'(0)=0.
 * Surrogate: u(t) = sum_j w_j phi_j(t) with Gaussian radial basis functions.
 *
 *   Loss(w) = 1/n  sum_i (u(t_i) - y_i)^2                      data mismatch
 *           + lambda * 1/M sum_m (u''+c u'+k u)(tau_m)^2       law violation
 *           + eps ||w||^2                                      tiny ridge
 *
 * u is linear in w, so every residual is linear in w and the loss is an exact
 * quadratic. The minimiser solves (A^T A) w = A^T b, solved here in closed form.
 * That isolates the effect of the loss term: no optimiser, no local minima.
 */
import { gaussian, mulberry32 } from "@/lib/viz/rng"

export interface Law {
  /** damping coefficient c in u'' + c u' + k u = 0 */
  c: number
  /** stiffness k */
  k: number
}

export const TRUE_LAW: Law = { c: 0.4, k: 4.0 }
export const SLIGHTLY_WRONG_LAW: Law = { c: 0.4, k: 6.0 }
export const WRONG_DAMPING_LAW: Law = { c: 1.2, k: 4.0 }

export const T_MIN = 0
export const T_MAX = 10
/** Sensors exist only in [0, OBS_END]. */
export const OBS_END = 3.5
export const N_BASIS = 36
export const BASIS_LO = -0.5
export const BASIS_HI = 10.5
export const BASIS_WIDTH = 0.55
export const N_COLLOCATION = 120
export const RIDGE = 1e-6
export const MAX_SENSORS = 24

/** Exact solution of the true oscillator (underdamped), for any (c, k) with k > c^2/4. */
export function trueSolution(t: number, law: Law = TRUE_LAW): number {
  const omega = Math.sqrt(law.k - (law.c * law.c) / 4)
  return Math.exp((-law.c * t) / 2) * (Math.cos(omega * t) + (law.c / (2 * omega)) * Math.sin(omega * t))
}

/** Analytic u'(t) and u''(t) of the exact solution (used for tests and residual checks). */
export function trueDerivatives(t: number, law: Law = TRUE_LAW): { du: number; ddu: number } {
  const omega = Math.sqrt(law.k - (law.c * law.c) / 4)
  const a = -law.c / 2
  const e = Math.exp(a * t)
  const B = law.c / (2 * omega)
  const f = Math.cos(omega * t) + B * Math.sin(omega * t)
  const fp = -omega * Math.sin(omega * t) + B * omega * Math.cos(omega * t)
  const fpp = -omega * omega * f
  return { du: e * (a * f + fp), ddu: e * (a * a * f + 2 * a * fp + fpp) }
}

export const BASIS_CENTRES: readonly number[] = Array.from(
  { length: N_BASIS },
  (_, j) => BASIS_LO + (j * (BASIS_HI - BASIS_LO)) / (N_BASIS - 1),
)

/** phi_j(t), phi_j'(t), phi_j''(t) for a Gaussian RBF of width s centred at c. */
export function rbf(t: number, centre: number, s = BASIS_WIDTH): { phi: number; d1: number; d2: number } {
  const x = t - centre
  const s2 = s * s
  const phi = Math.exp((-x * x) / (2 * s2))
  return { phi, d1: (-x / s2) * phi, d2: ((x * x) / (s2 * s2) - 1 / s2) * phi }
}

export interface BasisRow {
  phi: number[]
  d1: number[]
  d2: number[]
}

export function basisRow(t: number): BasisRow {
  const phi = new Array<number>(N_BASIS)
  const d1 = new Array<number>(N_BASIS)
  const d2 = new Array<number>(N_BASIS)
  for (let j = 0; j < N_BASIS; j += 1) {
    const r = rbf(t, BASIS_CENTRES[j])
    phi[j] = r.phi
    d1[j] = r.d1
    d2[j] = r.d2
  }
  return { phi, d1, d2 }
}

export const COLLOCATION_POINTS: readonly number[] = Array.from(
  { length: N_COLLOCATION },
  (_, m) => T_MIN + (m * (T_MAX - T_MIN)) / (N_COLLOCATION - 1),
)

export const EVAL_STEP = 0.05
export const EVAL_GRID: readonly number[] = Array.from(
  { length: Math.round((T_MAX - T_MIN) / EVAL_STEP) + 1 },
  (_, i) => Number((T_MIN + i * EVAL_STEP).toFixed(10)),
)

// ---- linear algebra (plain, dependency-free) -----------------------------

/** Cholesky solve of a symmetric positive definite system. Returns null if not SPD. */
export function solveCholesky(a: readonly (readonly number[])[], b: readonly number[]): number[] | null {
  const n = b.length
  const L: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0))
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let sum = a[i][j]
      for (let k = 0; k < j; k += 1) sum -= L[i][k] * L[j][k]
      if (i === j) {
        if (!(sum > 0)) return null
        L[i][j] = Math.sqrt(sum)
      } else {
        L[i][j] = sum / L[j][j]
      }
    }
  }
  const y = new Array<number>(n)
  for (let i = 0; i < n; i += 1) {
    let sum = b[i]
    for (let k = 0; k < i; k += 1) sum -= L[i][k] * y[k]
    y[i] = sum / L[i][i]
  }
  const x = new Array<number>(n)
  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = y[i]
    for (let k = i + 1; k < n; k += 1) sum -= L[k][i] * x[k]
    x[i] = sum / L[i][i]
  }
  return x
}

/** Gaussian elimination with partial pivoting (general square system). */
export function solveGaussian(a: readonly (readonly number[])[], b: readonly number[]): number[] {
  const n = b.length
  const m = a.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col += 1) {
    let pivot = col
    for (let r = col + 1; r < n; r += 1) if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r
    ;[m[col], m[pivot]] = [m[pivot], m[col]]
    const d = m[col][col] || 1e-300
    for (let r = col + 1; r < n; r += 1) {
      const f = m[r][col] / d
      if (f === 0) continue
      for (let c = col; c <= n; c += 1) m[r][c] -= f * m[col][c]
    }
  }
  const x = new Array<number>(n)
  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = m[i][n]
    for (let c = i + 1; c < n; c += 1) sum -= m[i][c] * x[c]
    x[i] = sum / (m[i][i] || 1e-300)
  }
  return x
}

// ---- data -----------------------------------------------------------------

export interface Sensors {
  t: number[]
  y: number[]
}

/**
 * Noisy sensor readings of the true solution at random times in [0, OBS_END].
 * Times and unit-noise are drawn for MAX_SENSORS slots first, then the first n are
 * kept and noise is scaled by sigma, so changing n or sigma does not reshuffle the others.
 */
export function makeSensors(seed: number, n: number, sigma: number): Sensors {
  const rng = mulberry32(seed)
  const times: number[] = []
  const noise: number[] = []
  for (let i = 0; i < MAX_SENSORS; i += 1) times.push(rng() * OBS_END)
  for (let i = 0; i < MAX_SENSORS; i += 1) noise.push(gaussian(rng))
  const count = Math.max(1, Math.min(MAX_SENSORS, Math.round(n)))
  const idx = Array.from({ length: count }, (_, i) => i).sort((p, q) => times[p] - times[q])
  return {
    t: idx.map((i) => times[i]),
    y: idx.map((i) => trueSolution(times[i]) + sigma * noise[i]),
  }
}

// ---- fitting ----------------------------------------------------------------

interface CollocationMatrices {
  phi: number[][]
  d1: number[][]
  d2: number[][]
}

let collocationCache: CollocationMatrices | null = null
function collocation(): CollocationMatrices {
  if (!collocationCache) {
    const rows = COLLOCATION_POINTS.map(basisRow)
    collocationCache = { phi: rows.map((r) => r.phi), d1: rows.map((r) => r.d1), d2: rows.map((r) => r.d2) }
  }
  return collocationCache
}

/** Gram matrix P^T P of the law residual rows (u'' + c u' + k u) at the collocation points. */
function lawGram(law: Law): number[][] {
  const { phi, d1, d2 } = collocation()
  const g: number[][] = Array.from({ length: N_BASIS }, () => new Array<number>(N_BASIS).fill(0))
  for (let m = 0; m < N_COLLOCATION; m += 1) {
    const row = new Array<number>(N_BASIS)
    for (let j = 0; j < N_BASIS; j += 1) row[j] = d2[m][j] + law.c * d1[m][j] + law.k * phi[m][j]
    for (let i = 0; i < N_BASIS; i += 1) {
      const ri = row[i]
      for (let j = i; j < N_BASIS; j += 1) g[i][j] += ri * row[j]
    }
  }
  for (let i = 0; i < N_BASIS; i += 1) for (let j = i; j < N_BASIS; j += 1) g[j][i] = g[i][j]
  return g
}

const gramCache = new Map<string, number[][]>()
function cachedLawGram(law: Law) {
  const key = `${law.c}|${law.k}`
  let g = gramCache.get(key)
  if (!g) {
    g = lawGram(law)
    gramCache.set(key, g)
  }
  return g
}

/** Precomputed data-side normal equations, reusable across many lambda / law choices. */
export interface DataSystem {
  /** (1/n) Phi^T Phi */
  gram: number[][]
  /** (1/n) Phi^T y */
  rhs: number[]
}

export function dataSystem(sensors: Sensors): DataSystem {
  const n = sensors.t.length
  const gram: number[][] = Array.from({ length: N_BASIS }, () => new Array<number>(N_BASIS).fill(0))
  const rhs = new Array<number>(N_BASIS).fill(0)
  for (let s = 0; s < n; s += 1) {
    const { phi } = basisRow(sensors.t[s])
    for (let i = 0; i < N_BASIS; i += 1) {
      rhs[i] += (phi[i] * sensors.y[s]) / n
      for (let j = i; j < N_BASIS; j += 1) gram[i][j] += (phi[i] * phi[j]) / n
    }
  }
  for (let i = 0; i < N_BASIS; i += 1) for (let j = i; j < N_BASIS; j += 1) gram[j][i] = gram[i][j]
  return { gram, rhs }
}

/**
 * Minimiser of Loss(w). lambda = 0 is the data-only fit (the law term vanishes).
 * Normal equations: (D + lambda/M * G_law + eps I) w = r, with D, r from the data.
 */
export function solveFit(system: DataSystem, lambda: number, law: Law): number[] {
  const g = lambda > 0 ? cachedLawGram(law) : null
  const scale = lambda / N_COLLOCATION
  const a = system.gram.map((row, i) =>
    row.map((v, j) => v + (g ? scale * g[i][j] : 0) + (i === j ? RIDGE : 0)),
  )
  return solveCholesky(a, system.rhs) ?? solveGaussian(a, system.rhs)
}

export function fitModel(sensors: Sensors, lambda: number, law: Law): number[] {
  return solveFit(dataSystem(sensors), lambda, law)
}

export interface Curve {
  u: number[]
  du: number[]
  ddu: number[]
}

/** Evaluate u, u', u'' of a fitted model on a grid. */
export function evaluate(w: readonly number[], ts: readonly number[]): Curve {
  const u: number[] = []
  const du: number[] = []
  const ddu: number[] = []
  for (const t of ts) {
    const { phi, d1, d2 } = basisRow(t)
    let a = 0
    let b = 0
    let c = 0
    for (let j = 0; j < N_BASIS; j += 1) {
      a += w[j] * phi[j]
      b += w[j] * d1[j]
      c += w[j] * d2[j]
    }
    u.push(a)
    du.push(b)
    ddu.push(c)
  }
  return { u, du, ddu }
}

/** The loss that the fit minimises, evaluated for any w (data term, physics term, total). */
export function lossTerms(
  w: readonly number[],
  sensors: Sensors,
  lambda: number,
  law: Law,
): { data: number; physics: number; total: number } {
  const dataCurve = evaluate(w, sensors.t)
  let data = 0
  for (let i = 0; i < sensors.t.length; i += 1) data += (dataCurve.u[i] - sensors.y[i]) ** 2
  data /= sensors.t.length
  const col = evaluate(w, COLLOCATION_POINTS)
  let physics = 0
  for (let m = 0; m < N_COLLOCATION; m += 1) {
    physics += (col.ddu[m] + law.c * col.du[m] + law.k * col.u[m]) ** 2
  }
  physics /= N_COLLOCATION
  let ridge = 0
  for (const v of w) ridge += v * v
  return { data, physics, total: data + lambda * physics + RIDGE * ridge }
}

// ---- metrics ----------------------------------------------------------------

export interface FitMetrics {
  rmseInside: number
  rmseOutside: number
  /** RMS of u'' + c u' + k u under the TRUE law, over the dense grid. */
  lawResidual: number
}

function rms(values: readonly number[]) {
  if (values.length === 0) return 0
  let s = 0
  for (const v of values) s += v * v
  return Math.sqrt(s / values.length)
}

export function metricsFor(w: readonly number[]): FitMetrics {
  const curve = evaluate(w, EVAL_GRID)
  const inside: number[] = []
  const outside: number[] = []
  const residual: number[] = []
  EVAL_GRID.forEach((t, i) => {
    const err = curve.u[i] - trueSolution(t)
    if (t <= OBS_END + 1e-9) inside.push(err)
    else outside.push(err)
    residual.push(curve.ddu[i] + TRUE_LAW.c * curve.du[i] + TRUE_LAW.k * curve.u[i])
  })
  return { rmseInside: rms(inside), rmseOutside: rms(outside), lawResidual: rms(residual) }
}

// ---- lambda grid ------------------------------------------------------------

/** Slider index 0 means lambda = 0 (data only); index 1..25 spans 1e-5 .. 1e3 in thirds of a decade. */
export const LAMBDA_INDEX_MAX = 25
export function lambdaFromIndex(index: number): number {
  if (index <= 0) return 0
  return Number((10 ** (-5 + (index - 1) / 3)).toPrecision(6))
}

export interface SweepPoint {
  lambda: number
  correct: number
  slightlyWrong: number
  wrongDamping: number
}

/** Outside-window RMSE as a function of lambda, for each law, on the same data. lambda > 0 only (log grid). */
export function sweepOutsideRmse(sensors: Sensors): SweepPoint[] {
  const system = dataSystem(sensors)
  const out: SweepPoint[] = []
  for (let i = 1; i <= LAMBDA_INDEX_MAX; i += 1) {
    const lambda = lambdaFromIndex(i)
    out.push({
      lambda,
      correct: metricsFor(solveFit(system, lambda, TRUE_LAW)).rmseOutside,
      slightlyWrong: metricsFor(solveFit(system, lambda, SLIGHTLY_WRONG_LAW)).rmseOutside,
      wrongDamping: metricsFor(solveFit(system, lambda, WRONG_DAMPING_LAW)).rmseOutside,
    })
  }
  return out
}
