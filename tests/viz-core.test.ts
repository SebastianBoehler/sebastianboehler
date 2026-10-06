import { expect, test } from "bun:test"
import { divergenceCurve, flipProbability, noisyChoice, normalCdf, stepReaching } from "@/lib/viz/logitNoise"
import { entropyBits, softmax, topTwoGap } from "@/lib/viz/nextToken"
import { gaussian, mulberry32, sampleIndex, sampleWithoutReplacement } from "@/lib/viz/rng"
import { areaPath, extent, formatNumber, linear, linePath, niceTicks, stepPath } from "@/lib/viz/scale"

test("rng is deterministic and roughly uniform / normal", () => {
  const a = mulberry32(42)
  const b = mulberry32(42)
  expect(Array.from({ length: 5 }, a)).toEqual(Array.from({ length: 5 }, b))

  const rng = mulberry32(7)
  const draws = Array.from({ length: 20000 }, () => gaussian(rng))
  const mean = draws.reduce((s, v) => s + v, 0) / draws.length
  const variance = draws.reduce((s, v) => s + (v - mean) ** 2, 0) / draws.length
  expect(Math.abs(mean)).toBeLessThan(0.03)
  expect(Math.abs(variance - 1)).toBeLessThan(0.05)
})

test("sampling helpers respect weights and uniqueness", () => {
  const rng = mulberry32(1)
  const counts = [0, 0, 0]
  for (let i = 0; i < 6000; i += 1) counts[sampleIndex(rng, [1, 2, 3])] += 1
  expect(counts[2] / 6000).toBeGreaterThan(0.47)
  expect(counts[2] / 6000).toBeLessThan(0.53)

  const picked = sampleWithoutReplacement(mulberry32(3), 10, 10)
  expect([...picked].sort((x, y) => x - y)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
})

test("softmax normalises, orders, and obeys temperature limits", () => {
  const z = [3, 1, 0]
  const p = softmax(z)
  expect(p.reduce((s, v) => s + v, 0)).toBeCloseTo(1, 10)
  expect(p[0]).toBeGreaterThan(p[1])
  expect(softmax(z, 0)).toEqual([1, 0, 0])
  const hot = softmax(z, 1e4)
  expect(Math.max(...hot) - Math.min(...hot)).toBeLessThan(1e-3)
  // Boltzmann form: ratio of probabilities is exp(delta logit / T)
  const T = 2
  const q = softmax(z, T)
  expect(q[0] / q[1]).toBeCloseTo(Math.exp((z[0] - z[1]) / T), 10)
  expect(entropyBits(softmax(z, 0))).toBe(0)
  expect(entropyBits([0.5, 0.5])).toBeCloseTo(1, 10)
  expect(topTwoGap([1, 5, 3])).toBe(2)
})

test("normal CDF matches known values", () => {
  expect(normalCdf(0)).toBeCloseTo(0.5, 6)
  expect(normalCdf(1.96)).toBeCloseTo(0.975, 3)
  expect(normalCdf(-1)).toBeCloseTo(0.158655, 5)
})

test("flip probability decays with gap and grows with noise; analytic matches Monte Carlo", () => {
  expect(flipProbability(0, 0.1)).toBe(0.5)
  expect(flipProbability(1, 0.1)).toBeLessThan(flipProbability(0.1, 0.1))
  expect(flipProbability(0.2, 0.05)).toBeLessThan(flipProbability(0.2, 0.2))
  expect(flipProbability(0.5, 0)).toBe(0)

  const rng = mulberry32(99)
  const gap = 0.15
  const sigma = 0.1
  let flips = 0
  const n = 40000
  for (let i = 0; i < n; i += 1) if (noisyChoice(rng, [gap, 0], sigma, 0) === 1) flips += 1
  expect(Math.abs(flips / n - flipProbability(gap, sigma))).toBeLessThan(0.01)
})

test("divergence curve is a monotone survival complement", () => {
  const gaps = [3, 2, 0.05, 1, 4, 0.2]
  const curve = divergenceCurve(gaps, 0.05)
  for (let i = 1; i < curve.length; i += 1) expect(curve[i]).toBeGreaterThanOrEqual(curve[i - 1])
  expect(curve[curve.length - 1]).toBeLessThanOrEqual(1)
  expect(curve[1]).toBeLessThan(1e-6) // nothing diverges before the near-tie at step 3
  expect(curve[2]).toBeGreaterThan(0.1)
  expect(stepReaching(curve, 0.1)).toBe(3)
  expect(stepReaching(divergenceCurve([5, 5], 0.01), 0.5)).toBeNull()
})

test("scales and paths", () => {
  const s = linear([0, 10], [0, 100])
  expect(s(5)).toBe(50)
  expect(s.invert(50)).toBe(5)
  const flipped = linear([0, 1], [200, 0])
  expect(flipped(0.25)).toBe(150)
  expect(niceTicks(0, 1, 5)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1])
  expect(niceTicks(0, 97, 5)[niceTicks(0, 97, 5).length - 1]).toBeLessThanOrEqual(97)
  expect(extent([3, 1, 2], 0.5)).toEqual([0, 4])
  expect(linePath([[0, 0], [1, 2]])).toBe("M0,0L1,2")
  expect(areaPath([[0, 0], [1, 2]], 5)).toBe("M0,0L1,2L1,5L0,5Z")
  expect(stepPath([[0, 1], [2, 3]])).toBe("M0,1L2,1L2,3")
  expect(formatNumber(1.5)).toBe("1.5")
  expect(formatNumber(2)).toBe("2")
  expect(formatNumber(0.1 + 0.2, 3)).toBe("0.3")
})

import { effectiveChoices, fullEntropyBits, probabilityOfLogit, topProbabilities, type LogitTable } from "@/lib/viz/tailSoftmax"
import { measuredPrompts } from "@/components/blog/data/measuredLogits"

test("tail-histogram softmax is a proper distribution and reproduces the measured probabilities", () => {
  const { table, candidates } = measuredPrompts.drive
  const car = candidates.find((c) => c.word === "car")!
  const pCar = topProbabilities(table, 1)[0]
  expect(pCar).toBeCloseTo(car.prob, 3)
  expect(probabilityOfLogit(table, car.logit, 1)).toBeCloseTo(car.prob, 3)

  // total mass over explicit tokens + tail histogram is 1 at every temperature
  for (const T of [0.3, 1, 2]) {
    const top = topProbabilities(table, T).reduce((s, v) => s + v, 0)
    const tailMass = table.tail.counts.reduce(
      (s, count, i) => s + count * probabilityOfLogit(table, table.tail.binStart + (i + 0.5) * table.tail.binWidth, T),
      0,
    )
    expect(top + tailMass).toBeCloseTo(1, 6)
  }
})

test("temperature sharpens and flattens the real distribution", () => {
  const { table } = measuredPrompts.drive
  expect(topProbabilities(table, 0)[0]).toBe(1)
  const cold = topProbabilities(table, 0.3)[0]
  const warm = topProbabilities(table, 1)[0]
  const hot = topProbabilities(table, 2)[0]
  expect(cold).toBeGreaterThan(warm)
  expect(warm).toBeGreaterThan(hot)
  expect(fullEntropyBits(table, 0.3)).toBeLessThan(fullEntropyBits(table, 1))
  expect(fullEntropyBits(table, 1)).toBeLessThan(fullEntropyBits(table, 2))
  expect(effectiveChoices(table, 0)).toBe(1)
})

test("a tiny hand-built table behaves like ordinary softmax", () => {
  const table: LogitTable = {
    vocabSize: 3,
    top: [
      { token: "a", logit: 2 },
      { token: "b", logit: 1 },
    ],
    tail: { binStart: 0, binWidth: 1, counts: [1] }, // one token at logit 0.5
  }
  const p = topProbabilities(table, 1)
  const z = Math.exp(2) + Math.exp(1) + Math.exp(0.5)
  expect(p[0]).toBeCloseTo(Math.exp(2) / z, 10)
  expect(p[1]).toBeCloseTo(Math.exp(1) / z, 10)
})

import { decide, makeRunDraws, samplingRunnerUpProbability } from "@/lib/viz/logitNoise"

test("common-random-number runs move monotonically with gap and noise", () => {
  const draws = makeRunDraws(mulberry32(5), 400)
  const flips = (gap: number, sigma: number, T = 0) => draws.filter((d) => decide(d, gap, sigma, T) === 1).length
  // more noise => at least as many flips; bigger gap => at most as many
  let previous = -1
  for (const sigma of [0, 0.02, 0.05, 0.1, 0.2, 0.4]) {
    const f = flips(0.15, sigma)
    expect(f).toBeGreaterThanOrEqual(previous)
    previous = f
  }
  previous = Infinity
  for (const gap of [0, 0.05, 0.1, 0.2, 0.5, 1]) {
    const f = flips(gap, 0.1)
    expect(f).toBeLessThanOrEqual(previous)
    previous = f
  }
  expect(flips(1, 0)).toBe(0)
  // observed fraction tracks the analytic probability
  const observed = flips(0.1, 0.1) / draws.length
  expect(Math.abs(observed - flipProbability(0.1, 0.1))).toBeLessThan(0.06)
})

test("sampling at temperature > 0 matches the two-way softmax", () => {
  const draws = makeRunDraws(mulberry32(8), 20000)
  const T = 0.7
  const gap = 0.5
  const observed = draws.filter((d) => decide(d, gap, 0, T) === 1).length / draws.length
  expect(Math.abs(observed - samplingRunnerUpProbability(gap, T))).toBeLessThan(0.015)
  expect(samplingRunnerUpProbability(0, 1)).toBeCloseTo(0.5, 10)
})
