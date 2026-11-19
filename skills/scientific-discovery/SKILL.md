---
name: scientific-discovery
description: Use for open-ended experimental research, bounded autoresearch, reviewing explored methods, or investigating a research plateau.
metadata:
  version: "0.5.1"
---

# Scientific discovery

Turn the objective into testable alternatives and measured decisions. Use the existing research
record and a light approach for bounded studies; ordinary lookups and bug fixes need no campaign.
Adapt to feedback and budget while preserving evidence and the user's actual constraints.

## Understand and explore

Inspect the governing rules, data, evaluator, and verified baseline before choosing a method. Propose
the metric, target or decision rule, resource budget, and stop condition from those sources and the
user's goal. Distinguish binding requirements, agreed choices, and inherited assumptions. Challenge
assumptions with evidence and involve the user when an experiment would change the agreed objective,
budget, or external commitment. Continue valid work within the current scope.

Track meaningful alternatives by mechanism, assumptions changed, actual tests/artifacts, limits, and
next decisive test. Run counts, renamed variants, and extra agents do not establish breadth. Before
claiming broader exploration, show a changed assumption and supporting test or artifact; label proposals
as proposals. Revisit old closures at their tested scope. Use the [coverage audit](references/coverage-audit.md)
when reviewing breadth or challenging a plateau.

Allocate effort between promising validated methods and credible alternatives according to headroom,
uncertainty, cost, and the decision at stake. A weak implementation does not close a family. Preserve
the best validated artifact without making it the search boundary. For sustained branching, consult
[search policy](references/search-policy.md).

## Test and interpret

Ground borrowed ideas in primary papers or official code, checking dates, methods, and assumptions.
Separate published results, author interpretation, and the hypothesis that a mechanism transfers here.
For each consequential experiment, identify the mechanism, scope, controls, expected outcome and
uncertainty where meaningful, resource budget, refutation, and next decision. Use [experiment cards](references/experiment-cards.md)
for complex comparisons and a [reproducibility record](references/reproducibility.md) for consequential results.

Verify the evaluator, active code path, artifact identity, and matched controls. For repeated search,
keep the scoring protocol fixed and reserve an independent check for promotion where available.
Record evaluator changes and establish a fresh baseline before comparing under a new protocol.
Test a whole alternative coherently. A component claim needs the integration that consumes it.
Keep training loss, held-out performance, system gain, runtime, and official scores distinct. Use
uncertainty based on independent units and account for repeated selection.
Investigate surprising outcomes with competing explanations and tests that distinguish them.
For speed claims, use [performance guidance](references/performance.md) to compare matched work and quality.

## Reassess and continue

When evidence stalls, contradicts the current mechanism, or supports a requested reset, reconstruct
the problem from the governing requirements and verified data. Check the evaluator, inputs, and active
path before searching further. Use the [coverage audit](references/coverage-audit.md) to identify the
assumption keeping work in one family and pick a small test of a different mechanism. Move within
the agreed scope when evidence warrants it. Bring changes to the goal or binding constraints to the
person who can decide them.

When a decision depends on a favored explanation, test the strongest plausible competing explanation
against the same evidence. Correct your earlier conclusion when warranted. Say what result would
change the next experiment or decision.

If the incumbent is still anchoring proposals, use a problem-first brief. Use a genuinely fresh
context when available and authorized. Keep canonical evidence, known correctness issues, source
snapshots, and active jobs safe. See [context and model routing](references/context-and-models.md).

Inspect completed experimental evidence as it arrives and release justified follow-ups without waiting
on unrelated work. Validate new entry points and pin source for running jobs. Report what changed in
understanding, what remains uncertain, and the next decisive tests. For a requested work duration,
record actual time and substantive work. Suggest durable improvements from recurring feedback;
when maintenance is authorized, use the [evolution protocol](references/evolution.md).
The [evidence notes](references/evidence.md) record sources and validation limits, not proof of improved research outcomes.

## Sources for these practices

Candidate branching draws on [WecoAI, AIDE](https://arxiv.org/abs/2502.13138). Fixed evaluation and independent reproduction draw on [OpenAI, Parameter Golf](https://github.com/openai/parameter-golf). Caution when promoting noisy gains draws on [Gao et al., TRUST](https://arxiv.org/abs/2611.10787v1).
