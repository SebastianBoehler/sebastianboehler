# LLM nondeterminism experiment

This folder contains a small artifact for the latent-space blog post. It sends
the same prompt to the same model multiple times, stores every completion, and
reports where repeated runs first diverge.

It is meant to measure visible output variation, not to prove the exact GPU
kernel or serving-batch cause. Use it to answer practical questions:

- Does this model/API return identical text for the same prompt at temperature
  zero?
- If runs differ, where is the first divergence?
- Does raising temperature widen the run cloud?
- Does a more constrained prompt make the cloud tighter?

## Run

First run the local boundary-effect simulation. It does not call an API. It
backs the article's claim with a controlled toy model: tiny perturbations only
change the first token when they cross a decision boundary.

```bash
python3 experiments/llm-nondeterminism/boundary_effect.py
```

It writes `boundary-effect.png`, `boundary-effect.svg`, and `summary.json` to
`experiments/llm-nondeterminism/runs/boundary-effect/`.

Then run the API collector when you want to measure real provider behavior:

```bash
OPENROUTER_API_KEY=... \
node experiments/llm-nondeterminism/collect-runs.mjs \
  --model openai/gpt-4.1-mini \
  --prompt "Explain latent space in one paragraph." \
  --runs 20 \
  --temperature 0
```

Results are written to `experiments/llm-nondeterminism/runs/`, which is ignored
by git. The summary prints the unique-output count and the first word position
where the observed runs diverge.

## Prompt duplication

Run the controlled duplication artifact when you want to reason about "sending
the same prompt twice" as a latent-state intervention:

```bash
python3 experiments/llm-nondeterminism/prompt_duplication_effect.py
```

It writes `prompt-duplication-latent.png`, `prompt-duplication-latent.svg`,
`metrics.csv`, and `summary.json` to
`experiments/llm-nondeterminism/runs/prompt-duplication-effect/`.

The toy model appends the same answer sentinel to each condition, then compares:

- `single`: the prompt once
- `duplicated`: the same prompt twice
- `padding`: the prompt once plus same-length neutral padding

The important distinction is that duplicated text is not a scalar multiplier on
one prompt vector. The second copy has different positions, attends to earlier
tokens, and changes the final readout state through the transformer's nonlinear
layers. The same-length padding control separates semantic repetition from pure
length and position effects; either can move the readout, but they are not the
same intervention.

For real model output, use the collector's `--repeat-prompt` flag and compare
matched settings:

```bash
PROMPT="Explain latent space in one sentence without metaphors."

OPENROUTER_API_KEY=... \
node experiments/llm-nondeterminism/collect-runs.mjs \
  --model openai/gpt-4.1-mini \
  --prompt "$PROMPT" \
  --repeat-prompt 1 \
  --runs 8 \
  --temperature 0

OPENROUTER_API_KEY=... \
node experiments/llm-nondeterminism/collect-runs.mjs \
  --model openai/gpt-4.1-mini \
  --prompt "$PROMPT" \
  --repeat-prompt 2 \
  --runs 8 \
  --temperature 0
```

Keep model, provider, temperature, top-p, and prompt text fixed. Only change
`--repeat-prompt`; otherwise the comparison mixes repetition with unrelated
sources of variation.

## Read the result

At `temperature 0`, multiple unique outputs suggest serving-level variation,
model routing changes, or another non-sampling source. Thinking Machines Lab's
useful framing is batch invariance: if the same request is computed in a
different dynamic batch, non-invariant kernels can produce tiny logit
differences. At higher temperatures, variation is expected because the sampler
intentionally chooses among plausible tokens.

Keep the model name, prompt, temperature, top-p, and provider fixed when
comparing runs. Otherwise the experiment mixes too many causes.
