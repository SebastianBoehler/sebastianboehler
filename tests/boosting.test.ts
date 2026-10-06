import { expect, test } from "bun:test"
import {
  GRID,
  N_TRAIN,
  N_VALID,
  PLOT_RANGE,
  argMin,
  boostingPaths,
  buildTree,
  countLeaves,
  fitBoosting,
  fitForest,
  fitOls,
  fitRegressionTree,
  leaves,
  makeDataset,
  predictBoosting,
  predictForest,
  predictOls,
  predictTree,
  rangeRmse,
  rmse,
  runBoosting,
  targets,
  trueFunction,
} from "@/lib/viz/boosting"

const sum = (values: readonly number[]) => values.reduce((s, v) => s + v, 0)

function standardData(seed = 11, sigma = 0.35) {
  const train = makeDataset(seed, N_TRAIN)
  const valid = makeDataset(seed + 1000, N_VALID)
  return { train, valid, x: train.x, y: targets(train, sigma), vx: valid.x, vy: targets(valid, sigma) }
}

test("the true function has the stated smooth part, threshold and trend", () => {
  expect(trueFunction(0)).toBeCloseTo(-1, 12)
  // jump of exactly 0.5 at x = 6.5 on top of a continuous part
  const below = trueFunction(6.5)
  const above = trueFunction(6.5 + 1e-9)
  expect(above - below).toBeCloseTo(0.5, 6)
  expect(trueFunction(Math.PI / 2)).toBeCloseTo(1.2 + 0.25 * (Math.PI / 2) - 1, 12)
})

test("data are seeded, sorted, in range, and the noise slider only rescales the same draws", () => {
  const a = makeDataset(5, 70)
  const b = makeDataset(5, 70)
  expect(a).toEqual(b)
  expect(makeDataset(6, 70).x).not.toEqual(a.x)
  expect(a.x.every((v, i) => v >= 0 && v <= 10 && (i === 0 || v >= a.x[i - 1]))).toBe(true)
  expect(targets(a, 0)).toEqual(a.x.map(trueFunction))
  const low = targets(a, 0.2)
  const high = targets(a, 0.4)
  low.forEach((v, i) => expect(high[i] - trueFunction(a.x[i])).toBeCloseTo(2 * (v - trueFunction(a.x[i])), 12))
  // grid covers the whole plot domain
  expect(GRID[0]).toBeCloseTo(PLOT_RANGE[0], 9)
  expect(GRID[GRID.length - 1]).toBeCloseTo(PLOT_RANGE[1], 9)
})

test("OLS recovers an exact line from noiseless linear data and extrapolates it", () => {
  const x = [0.3, 1.1, 2.9, 4.0, 6.2, 9.5]
  const y = x.map((v) => 0.7 * v - 2)
  const fit = fitOls(x, y)
  expect(fit.slope).toBeCloseTo(0.7, 12)
  expect(fit.intercept).toBeCloseTo(-2, 12)
  expect(predictOls(fit, 12)).toBeCloseTo(0.7 * 12 - 2, 10)
  expect(predictOls(fit, -1.5)).toBeCloseTo(0.7 * -1.5 - 2, 10)
})

test("a depth-1 tree on a noiseless step puts the split inside the data gap with ~0 error", () => {
  const x = Array.from({ length: 40 }, (_, i) => 0.25 * i + 0.1)
  const stepAt = 5.0
  const y = x.map((v) => (v > stepAt ? 2 : -1))
  const lastLow = Math.max(...x.filter((v) => v <= stepAt))
  const firstHigh = Math.min(...x.filter((v) => v > stepAt))
  const tree = fitRegressionTree(x, y, { maxDepth: 1 })
  expect(tree.kind).toBe("split")
  if (tree.kind === "split") {
    expect(tree.threshold).toBeGreaterThan(lastLow)
    expect(tree.threshold).toBeLessThan(firstHigh)
  }
  expect(rmse(x.map((v) => predictTree(tree, v)), y)).toBeLessThan(1e-12)
})

test("tree predictions outside the training range equal the nearest leaf value (flat extrapolation)", () => {
  const { x, y } = standardData()
  const tree = fitRegressionTree(x, y, { maxDepth: 4 })
  const lo = predictTree(tree, x[0])
  const hi = predictTree(tree, x[x.length - 1])
  for (const v of [-1.5, -0.01, -100]) expect(predictTree(tree, v)).toBe(lo)
  for (const v of [10.01, 12, 1e6]) expect(predictTree(tree, v)).toBe(hi)
  // and the same holds for forests and boosting
  const forest = fitForest(x, y, { trees: 10, maxDepth: 4, seed: 1 })
  expect(predictForest(forest, 12)).toBe(predictForest(forest, 1e6))
  const boost = fitBoosting(x, y, { rounds: 20, eta: 0.3, maxDepth: 2 })
  expect(predictBoosting(boost, -1.5)).toBe(predictBoosting(boost, -50))
})

test("the mean-leaf tree is plain CART: leaf = mean of y, depth and min-leaf limits respected", () => {
  const { x, y } = standardData()
  const tree = fitRegressionTree(x, y, { maxDepth: 3, minSamplesLeaf: 3 })
  expect(countLeaves(tree)).toBeLessThanOrEqual(8)
  expect(sum(leaves(tree).map((l) => l.n))).toBe(x.length)
  for (const l of leaves(tree)) {
    expect(l.n).toBeGreaterThanOrEqual(3)
    const members = x.map((v, i) => i).filter((i) => predictTree(tree, x[i]) === l.value)
    expect(l.value).toBeCloseTo(sum(members.map((i) => y[i])) / members.length, 10)
  }
  // deeper trees fit the training data at least as well
  const errs = [1, 2, 3, 4, 5, 6].map((d) => {
    const t = fitRegressionTree(x, y, { maxDepth: d })
    return rmse(x.map((v) => predictTree(t, v)), y)
  })
  for (let i = 1; i < errs.length; i += 1) expect(errs[i]).toBeLessThanOrEqual(errs[i - 1] + 1e-12)
})

test("boosting training RMSE never increases with rounds (eta <= 1), for lambda = 0 and lambda > 0", () => {
  const { x, y, vx, vy } = standardData()
  for (const eta of [0.05, 0.3, 1]) {
    for (const lambda of [0, 5]) {
      for (const maxDepth of [1, 3]) {
        const run = runBoosting({ x, y }, { x: vx, y: vy }, { rounds: 60, eta, maxDepth, lambda })
        for (let m = 1; m < run.trainRmse.length; m += 1) {
          expect(run.trainRmse[m]).toBeLessThanOrEqual(run.trainRmse[m - 1] + 1e-12)
        }
      }
    }
  }
})

test("with lambda = 0 the first boosting round (eta = 1) is exactly the plain residual-fitting tree", () => {
  const { x, y } = standardData()
  const boost = fitBoosting(x, y, { rounds: 1, eta: 1, maxDepth: 3 })
  const plain = fitRegressionTree(x, y, { maxDepth: 3 })
  for (const v of [-1, 0.2, 3.3, 6.5, 9.9, 11]) {
    expect(predictBoosting(boost, v)).toBeCloseTo(predictTree(plain, v), 10)
  }
})

test("lambda shrinks first-round leaf weights toward zero: w = -sum(g) / (n + lambda)", () => {
  const { x, y } = standardData()
  const mean = sum(y) / y.length
  const g = y.map((v) => mean - v) // round 1 gradients
  const unreg = buildTree(x, g, { maxDepth: 3, lambda: 0 })
  const reg = buildTree(x, g, { maxDepth: 3, lambda: 8 })
  for (const l of leaves(unreg)) expect(l.value).toBeCloseTo(-l.gradientSum / l.n, 12)
  for (const l of leaves(reg)) {
    expect(l.value).toBeCloseTo(-l.gradientSum / (l.n + 8), 12)
    expect(Math.abs(l.value)).toBeLessThanOrEqual(Math.abs(l.gradientSum) / l.n + 1e-12)
  }
  const mag = (tree: ReturnType<typeof buildTree>) => sum(leaves(tree).map((l) => Math.abs(l.value) * l.n)) / x.length
  expect(mag(reg)).toBeLessThan(mag(unreg))

  // root-only tree: weight is exactly -sum(g)/(n+lambda), strictly smaller in magnitude than with lambda = 0
  const gMean = sum(g)
  const stump0 = buildTree(x, g.map((v) => v + 0.3), { maxDepth: 0, lambda: 0 })
  const stump = buildTree(x, g.map((v) => v + 0.3), { maxDepth: 0, lambda: 8 })
  const total = gMean + 0.3 * x.length
  expect(stump0.kind === "leaf" && stump0.value).toBeCloseTo(-total / x.length, 12)
  expect(stump.kind === "leaf" && stump.value).toBeCloseTo(-total / (x.length + 8), 12)
  expect(Math.abs((stump as { value: number }).value)).toBeLessThan(Math.abs((stump0 as { value: number }).value))
})

test("a large enough gamma forbids every split; the tree is one leaf", () => {
  const { x, y } = standardData()
  const g = y.map((v) => -v)
  const free = buildTree(x, g, { maxDepth: 4, gamma: 0 })
  expect(countLeaves(free)).toBeGreaterThan(1)
  const pruned = buildTree(x, g, { maxDepth: 4, gamma: 1e6 })
  expect(pruned.kind).toBe("leaf")
  // an intermediate gamma gives a tree no bigger than the free one
  const mid = buildTree(x, g, { maxDepth: 4, gamma: 2 })
  expect(countLeaves(mid)).toBeLessThanOrEqual(countLeaves(free))
  // constant gradients: nothing to gain, so no split even with gamma = 0
  expect(buildTree(x, x.map(() => 1), { maxDepth: 4 }).kind).toBe("leaf")
})

test("every split's reported gain follows the structure-score formula", () => {
  const x = [1, 2, 3, 4, 5, 6, 7, 8]
  const g = [-1, -1, -1, -1, 1, 1, 1, 1]
  const lambda = 2
  const gamma = 0.1
  const tree = buildTree(x, g, { maxDepth: 1, minSamplesLeaf: 1, lambda, gamma })
  expect(tree.kind).toBe("split")
  if (tree.kind === "split") {
    expect(tree.threshold).toBeCloseTo(4.5, 12)
    const expected = 0.5 * (16 / (4 + lambda) + 16 / (4 + lambda) - 0 / (8 + lambda)) - gamma
    expect(tree.gain).toBeCloseTo(expected, 12)
  }
})

test("a forest of B bootstrap trees beats a single full-depth tree on validation data, averaged over seeds", () => {
  let single = 0
  let forest = 0
  const seeds = [1, 2, 3, 4, 5, 6]
  for (const seed of seeds) {
    const { x, y, vx, vy } = standardData(seed)
    const tree = fitRegressionTree(x, y, { maxDepth: 6 })
    single += rmse(vx.map((v) => predictTree(tree, v)), vy)
    const f = fitForest(x, y, { trees: 50, maxDepth: 6, seed: 100 + seed })
    forest += rmse(vx.map((v) => predictForest(f, v)), vy)
  }
  expect(forest / seeds.length).toBeLessThan(single / seeds.length)
})

test("a forest of B trees is a prefix of a larger forest, and averaging is exact", () => {
  const { x, y } = standardData()
  const small = fitForest(x, y, { trees: 3, maxDepth: 4, seed: 9 })
  const large = fitForest(x, y, { trees: 7, maxDepth: 4, seed: 9 })
  for (const v of [-1, 2.2, 8.8, 11]) {
    expect(predictForest(large, v, 3)).toBeCloseTo(predictForest(small, v), 12)
    const manual = sum(large.slice(0, 5).map((t) => predictTree(t, v))) / 5
    expect(predictForest(large, v, 5)).toBeCloseTo(manual, 12)
  }
})

test("boosting prefixes: paths[m] equals predicting with the first m trees; round 0 is the mean", () => {
  const { x, y } = standardData()
  const fit = fitBoosting(x, y, { rounds: 15, eta: 0.2, maxDepth: 2, lambda: 3 })
  const paths = boostingPaths(fit, GRID)
  expect(paths.length).toBe(16)
  expect(paths[0][0]).toBeCloseTo(sum(y) / y.length, 12)
  for (const m of [0, 1, 7, 15]) {
    for (const i of [0, 100, 300, 540]) expect(paths[m][i]).toBeCloseTo(predictBoosting(fit, GRID[i], m), 10)
  }
})

test("early stopping: argmin of the validation curve is found (earliest on ties) and agrees with the run", () => {
  expect(argMin([3, 2, 1, 1, 4])).toBe(2)
  expect(argMin([0.5])).toBe(0)
  const { x, y, vx, vy } = standardData(3, 0.8)
  const run = runBoosting({ x, y }, { x: vx, y: vy }, { rounds: 200, eta: 0.5, maxDepth: 3 })
  const min = Math.min(...run.validRmse)
  expect(run.validRmse[run.bestRound]).toBe(min)
  expect(run.validRmse.indexOf(min)).toBe(run.bestRound)
  // noisy data + a big step size: the validation curve turns up while training keeps falling
  expect(run.bestRound).toBeLessThan(200)
  expect(run.validRmse[200]).toBeGreaterThan(min)
  expect(run.trainRmse[200]).toBeLessThan(run.trainRmse[run.bestRound])
})

test("a smaller learning rate needs more rounds to reach the same training error", () => {
  const { x, y, vx, vy } = standardData()
  const slow = runBoosting({ x, y }, { x: vx, y: vy }, { rounds: 30, eta: 0.05, maxDepth: 2 })
  const fast = runBoosting({ x, y }, { x: vx, y: vy }, { rounds: 30, eta: 0.5, maxDepth: 2 })
  expect(fast.trainRmse[30]).toBeLessThan(slow.trainRmse[30])
})

test("range RMSE separates inside from outside; trees go flat while OLS continues the trend", () => {
  const { x, y } = standardData(11, 0.2)
  const ols = fitOls(x, y)
  const tree = fitRegressionTree(x, y, { maxDepth: 5 })
  const olsPred = GRID.map((v) => predictOls(ols, v))
  const treePred = GRID.map((v) => predictTree(tree, v))
  // perfect prediction has zero error in both zones
  const perfect = rangeRmse(GRID.map(trueFunction), GRID)
  expect(perfect.inside).toBe(0)
  expect(perfect.outside).toBe(0)
  // a tree is much better than OLS inside the range ...
  expect(rangeRmse(treePred, GRID).inside).toBeLessThan(rangeRmse(olsPred, GRID).inside)
  // ... and its error outside the range is flat-extrapolation error: constant beyond each edge
  const iRight = GRID.findIndex((v) => v > 10)
  expect(new Set(treePred.slice(iRight)).size).toBe(1)
  const iLeft = GRID.findIndex((v) => v >= 0)
  expect(new Set(treePred.slice(0, iLeft)).size).toBe(1)
})

test("everything is deterministic for a given seed", () => {
  const run = () => {
    const { x, y, vx, vy } = standardData(21)
    const boost = runBoosting({ x, y }, { x: vx, y: vy }, { rounds: 25, eta: 0.3, maxDepth: 3, lambda: 2 })
    const forest = fitForest(x, y, { trees: 5, maxDepth: 4, seed: 3 })
    return { b: Array.from(boost.grid[25]), v: boost.validRmse, f: GRID.map((v) => predictForest(forest, v)) }
  }
  expect(run()).toEqual(run())
})
