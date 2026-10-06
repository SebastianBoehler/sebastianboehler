/**
 * Toy 1-D regression playground: linear model, one tree, random forest, gradient boosting.
 *
 * Everything is deterministic (mulberry32) and pure. One tree builder serves all tree models:
 * it uses the XGBoost structure-score form for squared loss, with per-sample gradient g and
 * hessian h = 1:
 *
 *   leaf weight   w    = -G / (n + lambda)
 *   split gain         = 0.5 * [ G_L^2/(n_L+lambda) + G_R^2/(n_R+lambda) - G^2/(n+lambda) ] - gamma
 *
 * With lambda = 0 and gamma = 0, passing g_i = -y_i gives the ordinary CART regression tree
 * (leaf = mean of y, split = largest drop in squared error). Passing g_i = F(x_i) - y_i gives
 * one boosting round (leaf = mean residual). A positive lambda shrinks every leaf toward zero
 * by the factor n / (n + lambda); a positive gamma refuses splits whose gain is too small.
 */
import { gaussian, mulberry32 } from "@/lib/viz/rng"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const TRAIN_RANGE: readonly [number, number] = [0, 10]
export const PLOT_RANGE: readonly [number, number] = [-1.5, 12]
export const GRID_STEP = 0.025
export const N_TRAIN = 70
export const N_VALID = 70
export const MAX_ROUNDS = 200
export const MAX_TREES = 100
export const MIN_SAMPLES_LEAF = 3
export const LAMBDA_MAX = 20

/** Truth: smooth wiggle + a threshold at 6.5 + a linear trend. */
export function trueFunction(x: number): number {
  return 1.2 * Math.sin(x) + (x > 6.5 ? 0.5 : 0) + 0.25 * x - 1.0
}

export interface Dataset {
  /** Sorted ascending. */
  x: number[]
  /** Standard-normal draws, one per point; y = f(x) + sigma * z. Fixed per seed so the noise slider only rescales. */
  z: number[]
}

export function makeDataset(seed: number, n: number): Dataset {
  const rng = mulberry32(seed)
  const points: { x: number; z: number }[] = []
  for (let i = 0; i < n; i += 1) {
    const x = TRAIN_RANGE[0] + (TRAIN_RANGE[1] - TRAIN_RANGE[0]) * rng()
    points.push({ x, z: gaussian(rng) })
  }
  points.sort((a, b) => a.x - b.x)
  return { x: points.map((p) => p.x), z: points.map((p) => p.z) }
}

export function targets(ds: Dataset, sigma: number): number[] {
  return ds.x.map((x, i) => trueFunction(x) + sigma * ds.z[i])
}

/** Evenly spaced evaluation grid over the whole plot domain (includes both ends). */
export function makeGrid(): number[] {
  const count = Math.round((PLOT_RANGE[1] - PLOT_RANGE[0]) / GRID_STEP) + 1
  return Array.from({ length: count }, (_, i) => Number((PLOT_RANGE[0] + i * GRID_STEP).toFixed(6)))
}

export const GRID: readonly number[] = makeGrid()

export function inTrainingRange(x: number): boolean {
  return x >= TRAIN_RANGE[0] && x <= TRAIN_RANGE[1]
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export function rmse(pred: ArrayLike<number>, actual: ArrayLike<number>): number {
  const n = Math.min(pred.length, actual.length)
  if (n === 0) return 0
  let sum = 0
  for (let i = 0; i < n; i += 1) sum += (pred[i] - actual[i]) ** 2
  return Math.sqrt(sum / n)
}

/** RMSE of a prediction against the noiseless truth, split into inside / outside the training range. */
export function rangeRmse(pred: ArrayLike<number>, xs: readonly number[]) {
  let inSum = 0
  let inN = 0
  let outSum = 0
  let outN = 0
  for (let i = 0; i < xs.length; i += 1) {
    const e = (pred[i] - trueFunction(xs[i])) ** 2
    if (inTrainingRange(xs[i])) {
      inSum += e
      inN += 1
    } else {
      outSum += e
      outN += 1
    }
  }
  return {
    inside: inN ? Math.sqrt(inSum / inN) : 0,
    outside: outN ? Math.sqrt(outSum / outN) : 0,
  }
}

/** Index of the smallest value; ties resolve to the earliest index. */
export function argMin(values: ArrayLike<number>): number {
  let best = 0
  for (let i = 1; i < values.length; i += 1) if (values[i] < values[best]) best = i
  return best
}

// ---------------------------------------------------------------------------
// Linear model (ordinary least squares)
// ---------------------------------------------------------------------------

export interface LinearFit {
  slope: number
  intercept: number
}

export function fitOls(x: readonly number[], y: readonly number[]): LinearFit {
  const n = x.length
  let mx = 0
  let my = 0
  for (let i = 0; i < n; i += 1) {
    mx += x[i]
    my += y[i]
  }
  mx /= n
  my /= n
  let sxy = 0
  let sxx = 0
  for (let i = 0; i < n; i += 1) {
    sxy += (x[i] - mx) * (y[i] - my)
    sxx += (x[i] - mx) ** 2
  }
  const slope = sxx > 0 ? sxy / sxx : 0
  return { slope, intercept: my - slope * mx }
}

export function predictOls(fit: LinearFit, x: number): number {
  return fit.intercept + fit.slope * x
}

// ---------------------------------------------------------------------------
// Regression tree (one feature)
// ---------------------------------------------------------------------------

export type TreeNode =
  | { kind: "leaf"; value: number; n: number; gradientSum: number }
  | { kind: "split"; threshold: number; gain: number; left: TreeNode; right: TreeNode }

export interface TreeOptions {
  maxDepth: number
  minSamplesLeaf?: number
  /** L2 penalty on leaf weights (XGBoost lambda). */
  lambda?: number
  /** Minimum gain a split must clear (XGBoost gamma). */
  gamma?: number
}

const GAIN_EPSILON = 1e-12

/**
 * Build a tree from per-sample gradients g (hessian = 1). Leaf value = -sum(g) / (n + lambda).
 * Exact ties in x are never separated.
 */
export function buildTree(x: readonly number[], g: readonly number[], options: TreeOptions): TreeNode {
  const minLeaf = Math.max(1, options.minSamplesLeaf ?? MIN_SAMPLES_LEAF)
  const lambda = options.lambda ?? 0
  const gamma = options.gamma ?? 0
  const n = x.length

  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => x[a] - x[b] || a - b)
  const xs = order.map((i) => x[i])
  const prefix = new Float64Array(n + 1)
  for (let i = 0; i < n; i += 1) prefix[i + 1] = prefix[i] + g[order[i]]

  const leaf = (lo: number, hi: number): TreeNode => {
    const count = hi - lo
    const gradientSum = prefix[hi] - prefix[lo]
    return { kind: "leaf", value: count === 0 ? 0 : -gradientSum / (count + lambda), n: count, gradientSum }
  }

  const grow = (lo: number, hi: number, depth: number): TreeNode => {
    if (depth >= options.maxDepth || hi - lo < 2 * minLeaf) return leaf(lo, hi)
    const total = prefix[hi] - prefix[lo]
    const parentScore = (total * total) / (hi - lo + lambda)
    let bestGain = 0
    let bestK = -1
    for (let k = lo + minLeaf; k <= hi - minLeaf; k += 1) {
      if (!(xs[k - 1] < xs[k])) continue
      const gl = prefix[k] - prefix[lo]
      const gr = prefix[hi] - prefix[k]
      const gain = 0.5 * ((gl * gl) / (k - lo + lambda) + (gr * gr) / (hi - k + lambda) - parentScore) - gamma
      if (gain > bestGain) {
        bestGain = gain
        bestK = k
      }
    }
    if (bestK < 0 || bestGain <= GAIN_EPSILON) return leaf(lo, hi)
    return {
      kind: "split",
      threshold: (xs[bestK - 1] + xs[bestK]) / 2,
      gain: bestGain,
      left: grow(lo, bestK, depth + 1),
      right: grow(bestK, hi, depth + 1),
    }
  }

  return grow(0, n, 0)
}

export function predictTree(tree: TreeNode, x: number): number {
  let node = tree
  while (node.kind === "split") node = x < node.threshold ? node.left : node.right
  return node.value
}

export function leaves(tree: TreeNode): Extract<TreeNode, { kind: "leaf" }>[] {
  return tree.kind === "leaf" ? [tree] : [...leaves(tree.left), ...leaves(tree.right)]
}

export function countLeaves(tree: TreeNode): number {
  return leaves(tree).length
}

/** Ordinary CART regression tree: leaf = mean of y, squared-error splits. */
export function fitRegressionTree(
  x: readonly number[],
  y: readonly number[],
  options: Pick<TreeOptions, "maxDepth" | "minSamplesLeaf">,
): TreeNode {
  return buildTree(
    x,
    y.map((v) => -v),
    { ...options, lambda: 0, gamma: 0 },
  )
}

// ---------------------------------------------------------------------------
// Random forest (bootstrap + averaging; no feature subsampling is possible in 1-D)
// ---------------------------------------------------------------------------

export interface ForestOptions {
  trees: number
  maxDepth: number
  minSamplesLeaf?: number
  seed: number
}

/** Trees are drawn from one sequential stream, so a forest of B trees is a prefix of a forest of B+1. */
export function fitForest(x: readonly number[], y: readonly number[], options: ForestOptions): TreeNode[] {
  const rng = mulberry32(options.seed)
  const n = x.length
  const forest: TreeNode[] = []
  for (let b = 0; b < options.trees; b += 1) {
    const bx: number[] = []
    const by: number[] = []
    for (let i = 0; i < n; i += 1) {
      const j = Math.floor(rng() * n)
      bx.push(x[j])
      by.push(y[j])
    }
    forest.push(fitRegressionTree(bx, by, { maxDepth: options.maxDepth, minSamplesLeaf: options.minSamplesLeaf }))
  }
  return forest
}

/** Average of the first `count` trees (all of them by default). */
export function predictForest(forest: readonly TreeNode[], x: number, count = forest.length): number {
  const used = Math.min(count, forest.length)
  if (used === 0) return 0
  let sum = 0
  for (let b = 0; b < used; b += 1) sum += predictTree(forest[b], x)
  return sum / used
}

// ---------------------------------------------------------------------------
// Gradient boosting (squared loss, XGBoost-style regularised leaf weights)
// ---------------------------------------------------------------------------

export interface BoostingOptions {
  rounds: number
  /** Learning rate eta. */
  eta: number
  maxDepth: number
  lambda?: number
  gamma?: number
  minSamplesLeaf?: number
}

export interface BoostingFit {
  /** F_0: the mean of y. */
  base: number
  eta: number
  trees: TreeNode[]
}

export function fitBoosting(x: readonly number[], y: readonly number[], options: BoostingOptions): BoostingFit {
  const n = x.length
  const base = y.reduce((sum, v) => sum + v, 0) / n
  const current = new Float64Array(n).fill(base)
  const trees: TreeNode[] = []
  for (let m = 0; m < options.rounds; m += 1) {
    // Squared loss: g_i = F(x_i) - y_i, h_i = 1.
    const g = Array.from(current, (f, i) => f - y[i])
    const tree = buildTree(x, g, {
      maxDepth: options.maxDepth,
      minSamplesLeaf: options.minSamplesLeaf,
      lambda: options.lambda ?? 0,
      gamma: options.gamma ?? 0,
    })
    trees.push(tree)
    for (let i = 0; i < n; i += 1) current[i] += options.eta * predictTree(tree, x[i])
  }
  return { base, eta: options.eta, trees }
}

/** F_m(x) for any prefix m of the ensemble. */
export function predictBoosting(fit: BoostingFit, x: number, rounds = fit.trees.length): number {
  let value = fit.base
  const used = Math.min(rounds, fit.trees.length)
  for (let m = 0; m < used; m += 1) value += fit.eta * predictTree(fit.trees[m], x)
  return value
}

/**
 * Predictions of every prefix F_0..F_M on a set of x values, computed in one pass.
 * paths[m][i] = F_m(xs[i]).
 */
export function boostingPaths(fit: BoostingFit, xs: readonly number[]): Float64Array[] {
  const paths: Float64Array[] = [new Float64Array(xs.length).fill(fit.base)]
  for (let m = 0; m < fit.trees.length; m += 1) {
    const next = Float64Array.from(paths[m])
    for (let i = 0; i < xs.length; i += 1) next[i] += fit.eta * predictTree(fit.trees[m], xs[i])
    paths.push(next)
  }
  return paths
}

export interface BoostingRun {
  fit: BoostingFit
  /** [m][i]: F_m on the training x, validation x and the plot grid. */
  train: Float64Array[]
  valid: Float64Array[]
  grid: Float64Array[]
  trainRmse: number[]
  validRmse: number[]
  /** Round (0..M) with the smallest validation RMSE; earliest on ties. */
  bestRound: number
}

export function runBoosting(
  data: { x: readonly number[]; y: readonly number[] },
  valid: { x: readonly number[]; y: readonly number[] },
  options: BoostingOptions,
  gridX: readonly number[] = GRID,
): BoostingRun {
  const fit = fitBoosting(data.x, data.y, options)
  const train = boostingPaths(fit, data.x)
  const validPaths = boostingPaths(fit, valid.x)
  const grid = boostingPaths(fit, gridX)
  const trainRmse = train.map((p) => rmse(p, data.y))
  const validRmse = validPaths.map((p) => rmse(p, valid.y))
  return { fit, train, valid: validPaths, grid, trainRmse, validRmse, bestRound: argMin(validRmse) }
}
