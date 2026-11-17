---
name: scientific-discovery
description: Use for open-ended experimental research, reviewing explored methods, or investigating a research plateau. Scale the process to the study.
metadata:
  version: "0.4.0"
---

# Scientific discovery

Turn the objective into testable alternatives and measured decisions. Use the existing research
record and a light approach for bounded studies; ordinary lookups and bug fixes need no campaign.
Adapt to feedback and budget while preserving evidence and the user's actual constraints.

## Understand and explore

Inspect the specification, data generation and measurement, available information, evaluation, and
current results before choosing a method. Check relevant units, labels, artifacts, confounds, leakage,
splits, and uncertainty. If access is limited, state what is unknown and seek the smallest useful check.
Distinguish hard requirements from inherited representation, architecture, objective, or solver choices.

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

Verify the evaluator, active code path, artifact identity, and matched controls as relevant. Test a whole
alternative coherently; a component claim needs the integration that actually consumes it. Keep build
success, numerical correctness, training loss, held-out performance, system gain, runtime, and official
scores distinct. Use uncertainty based on independent units and account for repeated selection.
Investigate surprising outcomes with competing explanations and tests that distinguish them.
For speed claims, use [performance guidance](references/performance.md) to compare matched work and quality.

## Reassess and continue

At a plateau, phase boundary, or requested reset, reconstruct the problem from current facts and
challenge inherited choices. Trace purported locks to their authority; preserve binding requirements
and explicit user decisions. Fresh proposals need an actually fresh context when available and
authorized. Keep canonical evidence, known correctness issues, source snapshots, and active jobs safe;
report what context changed. See [context and model routing](references/context-and-models.md) when using
workers, fresh contexts, or multiple models. Extra providers do not by themselves establish independence.

Inspect completed experimental evidence as it arrives and release justified follow-ups without waiting
on unrelated work. Validate new entry points and pin source for running jobs. Report what changed in
understanding, what remains uncertain, and the next decisive tests. For a requested work duration,
record actual time and substantive work. Suggest durable improvements from recurring feedback;
when maintenance is authorized, use the [evolution protocol](references/evolution.md).
The [evidence notes](references/evidence.md) record sources and validation limits, not proof of improved research outcomes.
