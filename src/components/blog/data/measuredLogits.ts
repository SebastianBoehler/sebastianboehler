import raw from "@/components/blog/data/measuredLogits.json"
import type { LogitTable } from "@/lib/viz/tailSoftmax"

/**
 * Real numbers, produced by experiments/llm-nondeterminism/measure_logits.py
 * (Qwen2.5-0.5B-Instruct, fp32 on CPU, raw-text prompts for the next-token examples).
 */
interface RawPrompt {
  prompt: string
  vocab_size: number
  top64: { token: string; logit: number }[]
  tail: { bin_start: number; bin_width: number; counts: number[] }
  candidates: { word: string; first_token: string; n_tokens: number; logit: number; prob: number }[]
}

export const measuredModel = raw.model

export const measuredPrompts = {
  drive: toTable(raw.next_token.drive as RawPrompt),
  ride: toTable(raw.next_token.ride as RawPrompt),
}

export const measuredGeneration = {
  prompt: raw.generation.prompt,
  gaps: raw.generation.top2_gap as number[],
  nearTies: raw.generation.near_ties as {
    step: number
    gap: number
    leader: string
    runner_up: string
    context: string
  }[],
  preview: raw.generation.text_preview,
}

export const measuredNoise = {
  logitStd: raw.perturbation.bf16_vs_fp32_top8_logit_std,
  logitP99: raw.perturbation.bf16_vs_fp32_top8_logit_p99_abs,
  gapStd: raw.perturbation.bf16_vs_fp32_top2_gap_std,
  batchIdentical: raw.perturbation.bf16_batch1_vs_batch7_identical,
}

function toTable(p: RawPrompt) {
  const table: LogitTable = {
    vocabSize: p.vocab_size,
    top: p.top64,
    tail: { binStart: p.tail.bin_start, binWidth: p.tail.bin_width, counts: p.tail.counts },
  }
  return { prompt: p.prompt, table, candidates: p.candidates }
}

/** Show whitespace tokens legibly: " car" -> "car", " " -> "␣". */
export function showToken(token: string) {
  return token.trim() === "" ? "␣" : token.trim()
}
