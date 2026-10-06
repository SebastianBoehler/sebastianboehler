#!/usr/bin/env python3
"""Measure the real quantities behind the latent-space article's figures.

Everything the interactive figures show as "measured" comes from this script:

1. Next-token scores (logits) for two minimally different prompts.
2. The gap between the top-2 logits at every step of a greedy generation.
3. How large the logit perturbation from reduced-precision arithmetic actually is
   (bf16 vs fp32 on the same tokens, and batch-1 vs batch-N in bf16).

Run:
    python3 experiments/llm-nondeterminism/measure_logits.py

Output: src/components/blog/data/measuredLogits.json (checked in so the site
does not need a model at build time).

Caveat: perturbation numbers are measured on whatever device this runs on
(CPU by default). GPU serving kernels differ, so treat them as an order of
magnitude, not a property of any particular provider.
"""

from __future__ import annotations

import json
import math
import os
import sys
from pathlib import Path

# Only PyTorch is needed; importing TensorFlow/Flax through transformers is slow and can hang.
os.environ.setdefault("USE_TF", "0")
os.environ.setdefault("USE_FLAX", "0")

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"
OUT = Path(__file__).resolve().parents[2] / "src/components/blog/data/measuredLogits.json"

PROMPTS = {
    "drive": "I drove to work in my",
    "ride": "I rode to work on my",
}
CANDIDATE_WORDS = [" car", " truck", " vehicle", " motorbike", " bicycle", " bike", " horse", " scooter"]
GEN_PROMPT = "Explain latent space to a beginner."
GEN_TOKENS = 240
TOP_K = 8
KEEP = 64  # explicit logits kept per prompt; the rest of the vocabulary is stored as a histogram
BIN = 0.1


def main() -> int:
    torch.manual_seed(0)
    tok = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.float32)
    model.eval()

    result: dict = {
        "model": MODEL_ID,
        "device": "cpu",
        "torch": torch.__version__,
        "note": "Raw text prompts (no chat template) for the next-token examples; chat template for the generation.",
    }

    # 1. next-token logits for the two prompts -------------------------------
    next_token = {}
    for key, text in PROMPTS.items():
        ids = tok(text, return_tensors="pt").input_ids
        with torch.no_grad():
            logits = model(ids).logits[0, -1].float()
        probs = torch.softmax(logits, dim=-1)
        top = torch.topk(logits, TOP_K)
        candidates = []
        for word in CANDIDATE_WORDS:
            first = tok(word, add_special_tokens=False).input_ids[0]
            candidates.append(
                {
                    "word": word.strip(),
                    "first_token": tok.decode([first]),
                    "n_tokens": len(tok(word, add_special_tokens=False).input_ids),
                    "logit": round(float(logits[first]), 3),
                    "prob": round(float(probs[first]), 5),
                }
            )
        # Everything outside the top KEEP tokens goes into a histogram of logit values (bin width BIN),
        # so the site can recompute exact-enough softmax(logits / T) over the WHOLE vocabulary for any T.
        keep = torch.topk(logits, KEEP)
        mask = torch.ones_like(logits, dtype=torch.bool)
        mask[keep.indices] = False
        rest = logits[mask]
        lo = math.floor(float(rest.min()) / BIN) * BIN
        nbins = int((float(rest.max()) - lo) / BIN) + 1
        counts = torch.histc(rest, bins=nbins, min=lo, max=lo + nbins * BIN).to(torch.int64)
        next_token[key] = {
            "vocab_size": int(logits.numel()),
            "top64": [
                {"token": tok.decode([int(i)]), "logit": round(float(v), 3)}
                for v, i in zip(keep.values, keep.indices)
            ],
            "tail": {"bin_start": round(lo, 3), "bin_width": BIN, "counts": [int(c) for c in counts]},
            "prompt": text,
            "top": [
                {
                    "token": tok.decode([int(i)]),
                    "logit": round(float(v), 3),
                    "prob": round(float(probs[int(i)]), 5),
                }
                for v, i in zip(top.values, top.indices)
            ],
            "candidates": candidates,
        }
    result["next_token"] = next_token

    # 2. greedy generation, record top-2 gap every step ----------------------
    messages = [{"role": "user", "content": GEN_PROMPT}]
    chat = tok.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt")
    ids = chat if isinstance(chat, torch.Tensor) else chat["input_ids"]
    prompt_len = ids.shape[1]
    gaps: list[float] = []
    top1: list[float] = []
    generated: list[int] = []
    pairs: list[tuple[int, int]] = []
    with torch.no_grad():
        out = model(ids, use_cache=True)
        past = out.past_key_values
        logits = out.logits[0, -1]
        for _ in range(GEN_TOKENS):
            vals, idx = torch.topk(logits, 2)
            gaps.append(float(vals[0] - vals[1]))
            top1.append(float(vals[0]))
            pairs.append((int(idx[0]), int(idx[1])))
            nxt = idx[0:1].view(1, 1)
            generated.append(int(nxt))
            if int(nxt) == tok.eos_token_id or int(nxt) == tok.convert_tokens_to_ids("<|im_end|>"):
                break
            out = model(nxt, past_key_values=past, use_cache=True)
            past = out.past_key_values
            logits = out.logits[0, -1]
    result["generation"] = {
        "prompt": GEN_PROMPT,
        "decoding": "greedy (argmax) in fp32",
        "n_tokens": len(generated),
        "text_preview": tok.decode(generated)[:240],
        "top2_gap": [round(g, 4) for g in gaps],
        "near_ties": [
            {
                "step": i + 1,
                "gap": round(gaps[i], 4),
                "leader": tok.decode([pairs[i][0]]),
                "runner_up": tok.decode([pairs[i][1]]),
                "context": tok.decode(generated[max(0, i - 6) : i]),
            }
            for i in range(len(gaps))
            if gaps[i] < 0.25 and i < len(generated)
        ],
    }

    # 3. numerical perturbation size ----------------------------------------
    full = torch.cat([ids, torch.tensor([generated], dtype=ids.dtype)], dim=1)
    with torch.no_grad():
        ref = model(full).logits[0, prompt_len - 1 : -1].float()  # logits predicting each generated token
    model_bf16 = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.bfloat16)
    model_bf16.eval()
    with torch.no_grad():
        b1 = model_bf16(full).logits[0, prompt_len - 1 : -1].float()
        batch = full.repeat(7, 1)
        b7 = model_bf16(batch).logits[:, prompt_len - 1 : -1].float()

    def gap_of(l: torch.Tensor) -> torch.Tensor:
        v = torch.topk(l, 2, dim=-1).values
        return v[..., 0] - v[..., 1]

    # Only the competitive candidates matter for a decision, so measure noise on the top-8 tokens per step.
    idx = ref.topk(8, dim=-1).indices
    d_prec = (b1 - ref).gather(-1, idx)
    gap_err = gap_of(b1) - gap_of(ref)
    d_batch = (b7[0] - b1).gather(-1, idx)
    result["perturbation"] = {
        "bf16_vs_fp32_top8_logit_std": round(float(d_prec.std()), 4),
        "bf16_vs_fp32_top8_logit_p99_abs": round(float(d_prec.abs().flatten().quantile(0.99)), 4),
        "bf16_vs_fp32_top2_gap_std": round(float(gap_err.std()), 4),
        "bf16_batch1_vs_batch7_max_abs": round(float(d_batch.abs().max()), 6),
        "bf16_batch1_vs_batch7_identical": bool(torch.equal(b7[0], b1)),
        "mean_logit_magnitude": round(float(ref.abs().mean()), 3),
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({k: v for k, v in result.items() if k != "generation"}, indent=2))
    g = result["generation"]
    print("generation tokens:", g["n_tokens"], "| text:", g["text_preview"][:120].replace("\n", " "))
    small = sum(1 for x in gaps if x < 0.1)
    print(f"steps with top-2 gap < 0.1: {small}/{len(gaps)}  (min gap {min(gaps):.4f}, median {sorted(gaps)[len(gaps)//2]:.3f})")
    print("wrote", OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
