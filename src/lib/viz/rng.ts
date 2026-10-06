/**
 * Deterministic randomness for teaching figures.
 *
 * Figures must render identically on the server and the client, and a reader
 * who reloads should see the same "runs". So nothing here touches Math.random.
 */
export type Rng = () => number

/** mulberry32: tiny, fast, well-distributed 32-bit PRNG. Returns floats in [0, 1). */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Standard normal sample via Box-Muller. */
export function gaussian(rng: Rng): number {
  let u = 0
  while (u === 0) u = rng()
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** Draw an index from unnormalised non-negative weights. */
export function sampleIndex(rng: Rng, weights: readonly number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0)
  let threshold = rng() * total
  for (let i = 0; i < weights.length; i += 1) {
    threshold -= weights[i]
    if (threshold < 0) return i
  }
  return weights.length - 1
}

/** Fisher-Yates over indices 0..n-1, returning the first k. */
export function sampleWithoutReplacement(rng: Rng, n: number, k: number): number[] {
  const pool = Array.from({ length: n }, (_, i) => i)
  const count = Math.min(k, n)
  for (let i = 0; i < count; i += 1) {
    const j = i + Math.floor(rng() * (n - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
