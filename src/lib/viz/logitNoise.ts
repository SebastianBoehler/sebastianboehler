import { gaussian, type Rng } from "@/lib/viz/rng"

/** Standard normal CDF, via a high-accuracy complementary error function. */
export function normalCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2)
}

function erfc(x: number): number {
  // Numerical Recipes erfcc, fractional error < 1.2e-7 everywhere.
  const z = Math.abs(x)
  const t = 1 / (1 + 0.5 * z)
  const ans =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))),
    )
  return x >= 0 ? ans : 2 - ans
}

/**
 * Probability that numerical noise reverses a greedy choice.
 *
 * Each of the top two logits receives independent N(0, sigma^2) noise, so their
 * difference is perturbed by N(0, 2 sigma^2). The runner-up wins when that noise
 * exceeds the gap.
 */
export function flipProbability(gap: number, sigma: number): number {
  if (sigma <= 0) return gap > 0 ? 0 : 0.5
  if (gap <= 0) return 0.5
  return normalCdf(-gap / (sigma * Math.SQRT2))
}

/**
 * Chance that a run has already left the noiseless greedy path by each step.
 * Before the first flip a run follows the greedy path, so the hazard at step k
 * is exactly flipProbability(gap_k). cumulative[k] = 1 - prod_{j<=k}(1 - p_j).
 */
export function divergenceCurve(gaps: readonly number[], sigma: number): number[] {
  const out: number[] = []
  let survive = 1
  for (const gap of gaps) {
    survive *= 1 - flipProbability(gap, sigma)
    out.push(1 - survive)
  }
  return out
}

/** Smallest step index at which cumulative divergence reaches `level`, or null. */
export function stepReaching(curve: readonly number[], level: number): number | null {
  const index = curve.findIndex((p) => p >= level)
  return index === -1 ? null : index + 1
}

/** Monte-Carlo run of one decision under noise; returns which candidate won (0 = leader). */
export function noisyChoice(rng: Rng, logits: readonly [number, number], sigma: number, temperature: number): 0 | 1 {
  const [a, b] = logits
  const na = a + sigma * gaussian(rng)
  const nb = b + sigma * gaussian(rng)
  if (temperature <= 1e-6) return na >= nb ? 0 : 1
  const pA = 1 / (1 + Math.exp((nb - na) / temperature))
  return rng() < pA ? 0 : 1
}

/** One simulated execution: fixed random draws, so outcomes change smoothly as sliders move. */
export interface RunDraw {
  noiseLeader: number
  noiseRunnerUp: number
  uniform: number
}

export function makeRunDraws(rng: Rng, count: number): RunDraw[] {
  return Array.from({ length: count }, () => ({
    noiseLeader: gaussian(rng),
    noiseRunnerUp: gaussian(rng),
    uniform: rng(),
  }))
}

/**
 * Which token one execution emits (0 = the noiseless leader, 1 = the runner-up).
 *
 * temperature 0: greedy argmax of the perturbed scores, so only numerical noise can flip it.
 * temperature > 0: the perturbed scores go through softmax and a token is sampled.
 */
export function decide(draw: RunDraw, gap: number, sigma: number, temperature: number): 0 | 1 {
  const margin = gap + sigma * (draw.noiseLeader - draw.noiseRunnerUp)
  if (temperature <= 1e-6) return margin >= 0 ? 0 : 1
  const pLeader = 1 / (1 + Math.exp(-margin / temperature))
  return draw.uniform < pLeader ? 0 : 1
}

/** Probability that a pure sampler (no numerical noise) emits the runner-up among the top two. */
export function samplingRunnerUpProbability(gap: number, temperature: number): number {
  if (temperature <= 1e-6) return gap > 0 ? 0 : 0.5
  return 1 / (1 + Math.exp(gap / temperature))
}
