"""Toy experiment for prompt duplication as a latent-state intervention.

This does not inspect a real LLM's hidden states. It builds a small deterministic
transformer-like readout where repeated prompt tokens have the same lexical
identity, different positions, and causal attention over the earlier copy. The
artifact is useful for reasoning about the geometry before measuring real model
outputs with collect-runs.mjs.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import re
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np

from prompt_duplication_plot import render_figure

DEFAULT_PROMPT = (
    "Classify the answer as safe or unsafe. "
    "Question: a user asks for help bypassing an account lock. "
    "Reply with SAFE or UNSAFE."
)

TOKEN_RE = re.compile(r"[a-z0-9_<>]+|[^\w\s]", re.IGNORECASE)
TASK_WORDS = {"classify", "reply", "answer", "choose", "safe", "unsafe", "exactly"}
RISK_WORDS = {"unsafe", "bypass", "bypassing", "lock", "account", "password", "harm"}
FORMAT_WORDS = {"safe", "unsafe", "letter", "format", "reply", "exactly"}
QUESTION_WORDS = {"question", "user", "asks", "help", "which", "what"}
CANDIDATES = {
    "UNSAFE": "classify unsafe bypass account lock reply",
    "SAFE": "classify safe allowed normal reply",
    "EXPLAIN": "explain context reason answer",
    "ASK": "question clarify ask more",
}


@dataclass(frozen=True)
class ExperimentConfig:
    prompt: str
    dim: int
    seed: int
    recency_bias: float
    out: str


@dataclass
class ConditionResult:
    label: str
    tokens: list[str]
    states: np.ndarray
    attention: list[np.ndarray]
    probabilities: dict[str, float]
    entropy: float


def main() -> None:
    config = parse_args()
    out_dir = Path(config.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    base_tokens = tokenize(config.prompt)
    conditions = run_conditions(base_tokens, config)
    summary = summarize(conditions, base_tokens, config)

    render_figure(
        conditions,
        base_tokens,
        list(CANDIDATES),
        out_dir / "prompt-duplication-latent.png",
        out_dir / "prompt-duplication-latent.svg",
    )
    write_metrics(conditions, out_dir / "metrics.csv")
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")

    print(json.dumps(summary, indent=2))
    print(f"wrote {out_dir / 'prompt-duplication-latent.png'}")
    print(f"wrote {out_dir / 'prompt-duplication-latent.svg'}")
    print(f"wrote {out_dir / 'metrics.csv'}")
    print(f"wrote {out_dir / 'summary.json'}")


def parse_args() -> ExperimentConfig:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prompt", default=DEFAULT_PROMPT)
    parser.add_argument("--dim", type=int, default=48)
    parser.add_argument("--seed", type=int, default=17)
    parser.add_argument("--recency-bias", type=float, default=0.45)
    parser.add_argument("--out", default="experiments/llm-nondeterminism/runs/prompt-duplication-effect")
    args = parser.parse_args()

    if args.dim < 12:
        parser.error("--dim must be at least 12")
    if args.recency_bias < 0:
        parser.error("--recency-bias must be non-negative")

    return ExperimentConfig(
        prompt=args.prompt,
        dim=args.dim,
        seed=args.seed,
        recency_bias=args.recency_bias,
        out=args.out,
    )


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text)]


def run_conditions(base_tokens: list[str], config: ExperimentConfig) -> dict[str, ConditionResult]:
    return {
        "single": run_sequence(base_tokens + ["<answer>"], config),
        "duplicated": run_sequence(base_tokens + base_tokens + ["<answer>"], config),
        "padding": run_sequence(base_tokens + ["<pad>"] * len(base_tokens) + ["<answer>"], config),
    }


def run_sequence(tokens: list[str], config: ExperimentConfig) -> ConditionResult:
    states, attention = transformer_pass(tokens, config)
    probabilities = candidate_probabilities(states[-1], config)
    entropy = -sum(prob * math.log2(max(prob, 1e-12)) for prob in probabilities.values())
    return ConditionResult(
        label="",
        tokens=tokens,
        states=states,
        attention=attention,
        probabilities=probabilities,
        entropy=float(entropy),
    )


def transformer_pass(tokens: list[str], config: ExperimentConfig) -> tuple[np.ndarray, list[np.ndarray]]:
    rng = np.random.default_rng(config.seed)
    dim = config.dim
    wq = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))
    wk = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))
    wv = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))
    wo = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))
    ff1 = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))
    ff2 = rng.normal(0, 1 / math.sqrt(dim), size=(dim, dim))

    inputs = np.vstack([token_vector(token, config) + 0.28 * positional_encoding(index, dim) for index, token in enumerate(tokens)])
    states = np.empty_like(inputs)
    attention: list[np.ndarray] = []

    for index in range(len(tokens)):
        prefix = inputs[: index + 1]
        query = inputs[index] @ wq
        keys = prefix @ wk
        values = prefix @ wv
        distance = index - np.arange(index + 1)
        scores = keys @ query / math.sqrt(dim)
        scores -= config.recency_bias * distance / max(1, len(tokens))
        weights = softmax(scores)
        hidden = layer_norm(inputs[index] + (weights @ values) @ wo)
        hidden = layer_norm(hidden + 0.35 * (np.tanh(hidden @ ff1) @ ff2))
        states[index] = hidden
        attention.append(weights)

    return states, attention


def token_vector(token: str, config: ExperimentConfig) -> np.ndarray:
    digest = hashlib.blake2b(f"{config.seed}:{token}".encode("utf-8"), digest_size=16).digest()
    seed = int.from_bytes(digest[:8], "little")
    rng = np.random.default_rng(seed)
    vector = rng.normal(0, 0.24, size=config.dim)

    if token in TASK_WORDS:
        vector[0] += 1.8
    if token in RISK_WORDS:
        vector[1] += 1.8
    if token in FORMAT_WORDS:
        vector[2] += 1.45
    if token in QUESTION_WORDS:
        vector[3] += 1.2
    if token == "<answer>":
        vector[:4] += np.array([0.9, 0.4, 0.9, 0.2])
    if token == "<pad>":
        vector *= 0.08

    return vector


def positional_encoding(index: int, dim: int) -> np.ndarray:
    encoding = np.zeros(dim)
    positions = np.arange(0, dim, 2)
    div_term = np.exp(-math.log(10000.0) * positions / dim)
    encoding[0::2] = np.sin(index * div_term)
    encoding[1::2] = np.cos(index * div_term[: len(encoding[1::2])])
    return encoding


def candidate_probabilities(endpoint: np.ndarray, config: ExperimentConfig) -> dict[str, float]:
    logits = {}
    for label, phrase in CANDIDATES.items():
        direction = np.mean([token_vector(token, config) for token in tokenize(phrase)], axis=0)
        logits[label] = float(endpoint @ direction / math.sqrt(config.dim))
    probs = softmax(np.array(list(logits.values())) * 2.2)
    return {label: float(prob) for label, prob in zip(logits, probs)}


def summarize(conditions: dict[str, ConditionResult], base_tokens: list[str], config: ExperimentConfig) -> dict[str, object]:
    single = conditions["single"]
    duplicated = conditions["duplicated"]
    padding = conditions["padding"]
    duplicate_attention = duplicated.attention[-1]
    copy_alignment = [
        cosine(duplicated.states[index], duplicated.states[index + len(base_tokens)])
        for index in range(len(base_tokens))
    ]

    return {
        **asdict(config),
        "base_token_count": len(base_tokens),
        "conditions": {
            label: {
                "token_count": len(result.tokens),
                "top_output": max(result.probabilities, key=result.probabilities.get),
                "entropy_bits": result.entropy,
                "probabilities": result.probabilities,
            }
            for label, result in conditions.items()
        },
        "endpoint_cosine_single_vs_duplicated": cosine(single.states[-1], duplicated.states[-1]),
        "endpoint_l2_single_vs_duplicated": float(np.linalg.norm(single.states[-1] - duplicated.states[-1])),
        "endpoint_l2_single_vs_padding": float(np.linalg.norm(single.states[-1] - padding.states[-1])),
        "duplicate_final_attention_mass": {
            "first_copy": float(duplicate_attention[: len(base_tokens)].sum()),
            "second_copy": float(duplicate_attention[len(base_tokens) : 2 * len(base_tokens)].sum()),
            "answer_slot": float(duplicate_attention[-1]),
        },
        "mean_same_token_copy_alignment": float(np.mean(copy_alignment)),
        "interpretation": (
            "Duplicating a prompt creates a second contextualized pass, not a linear doubling. "
            "The second copy has different positions and can attend to the first copy, shifting "
            "the final readout differently from same-length padding."
        ),
    }


def write_metrics(conditions: dict[str, ConditionResult], path: Path) -> None:
    with path.open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["condition", "token_count", "entropy_bits", *CANDIDATES])
        for label, result in conditions.items():
            writer.writerow([label, len(result.tokens), f"{result.entropy:.6f}", *[f"{result.probabilities[name]:.6f}" for name in CANDIDATES]])


def softmax(values: np.ndarray) -> np.ndarray:
    shifted = values - values.max()
    exp = np.exp(shifted)
    return exp / exp.sum()


def layer_norm(values: np.ndarray) -> np.ndarray:
    return (values - values.mean()) / (values.std() + 1e-6)


def cosine(left: np.ndarray, right: np.ndarray) -> float:
    denom = np.linalg.norm(left) * np.linalg.norm(right)
    if denom == 0:
        return 0.0
    return float(left @ right / denom)


if __name__ == "__main__":
    main()
