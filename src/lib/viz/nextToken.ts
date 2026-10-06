/** Softmax with temperature. T -> 0 collapses to the argmax; large T approaches uniform. */
export function softmax(logits: readonly number[], temperature = 1): number[] {
  if (logits.length === 0) return []
  if (temperature <= 1e-6) {
    const best = argmax(logits)
    return logits.map((_, i) => (i === best ? 1 : 0))
  }
  const scaled = logits.map((z) => z / temperature)
  const max = Math.max(...scaled)
  const exps = scaled.map((z) => Math.exp(z - max))
  const total = exps.reduce((sum, v) => sum + v, 0)
  return exps.map((v) => v / total)
}

export function argmax(values: readonly number[]): number {
  let best = 0
  for (let i = 1; i < values.length; i += 1) if (values[i] > values[best]) best = i
  return best
}

/** Shannon entropy in bits. */
export function entropyBits(probs: readonly number[]): number {
  return probs.reduce((sum, p) => (p > 0 ? sum - p * Math.log2(p) : sum), 0)
}

/** Gap between the largest and second-largest value. */
export function topTwoGap(values: readonly number[]): number {
  if (values.length < 2) return Infinity
  const sorted = [...values].sort((a, b) => b - a)
  return sorted[0] - sorted[1]
}
