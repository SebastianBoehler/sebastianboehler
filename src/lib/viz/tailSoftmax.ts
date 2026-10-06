/**
 * Exact-enough softmax over a whole vocabulary from a compact table:
 * the top-K logits kept explicitly, plus a histogram of every other logit.
 * (151,936 logits per prompt would be ~1.5 MB; this is ~15 KB and reproduces the
 * measured probabilities to 4 decimals at T = 1.)
 */
export interface LogitTable {
  vocabSize: number
  top: readonly { token: string; logit: number }[]
  tail: { binStart: number; binWidth: number; counts: readonly number[] }
}

function tailLogits(table: LogitTable) {
  const { binStart, binWidth, counts } = table.tail
  return counts.map((count, i) => ({ count, logit: binStart + (i + 0.5) * binWidth }))
}

/** Largest logit in the whole table (always in `top`, which is sorted descending). */
function maxLogit(table: LogitTable) {
  return table.top[0].logit
}

/** log-sum-exp style partition function at temperature T, scaled by the max logit for stability. */
function partition(table: LogitTable, temperature: number) {
  const max = maxLogit(table)
  let z = 0
  for (const t of table.top) z += Math.exp((t.logit - max) / temperature)
  for (const b of tailLogits(table)) if (b.count > 0) z += b.count * Math.exp((b.logit - max) / temperature)
  return { z, max }
}

/** Probability of each explicitly kept token at temperature T (T <= 0 means greedy). */
export function topProbabilities(table: LogitTable, temperature: number): number[] {
  if (temperature <= 1e-6) return table.top.map((_, i) => (i === 0 ? 1 : 0))
  const { z, max } = partition(table, temperature)
  return table.top.map((t) => Math.exp((t.logit - max) / temperature) / z)
}

/** Probability of an arbitrary token given its logit (e.g. a candidate outside the kept top-K). */
export function probabilityOfLogit(table: LogitTable, logit: number, temperature: number): number {
  if (temperature <= 1e-6) return logit >= maxLogit(table) ? 1 : 0
  const { z, max } = partition(table, temperature)
  return Math.exp((logit - max) / temperature) / z
}

/** Shannon entropy of the full-vocabulary distribution, in bits. */
export function fullEntropyBits(table: LogitTable, temperature: number): number {
  if (temperature <= 1e-6) return 0
  const { z, max } = partition(table, temperature)
  const term = (logit: number, count: number) => {
    const p = Math.exp((logit - max) / temperature) / z
    return p > 0 ? -count * p * Math.log2(p) : 0
  }
  let h = 0
  for (const t of table.top) h += term(t.logit, 1)
  for (const b of tailLogits(table)) if (b.count > 0) h += term(b.logit, b.count)
  return h
}

/** Number of equally likely choices that would give the same entropy (2^H). */
export function effectiveChoices(table: LogitTable, temperature: number): number {
  return 2 ** fullEntropyBits(table, temperature)
}
