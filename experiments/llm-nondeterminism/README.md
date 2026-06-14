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

## Read the result

At `temperature 0`, multiple unique outputs suggest serving-level variation,
model routing changes, or another non-sampling source. Thinking Machines Lab's
useful framing is batch invariance: if the same request is computed in a
different dynamic batch, non-invariant kernels can produce tiny logit
differences. At higher temperatures, variation is expected because the sampler
intentionally chooses among plausible tokens.

Keep the model name, prompt, temperature, top-p, and provider fixed when
comparing runs. Otherwise the experiment mixes too many causes.
