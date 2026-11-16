---
name: scientific-discovery
description: "Conduct sustained scientific research, novel method design, and experimental optimization without locking into an early incumbent. Use for solution-space reviews, broad experiment campaigns, unexplained failures, or fresh-context and cross-model research."
metadata:
  version: "0.1.0"
---

# Scientific Discovery

Turn an open research objective into distinct, falsifiable approaches and measured decisions.
Judge breadth by what methods actually do, not by run counts, new names, confident prose,
context resets, or the number of agents/providers. Use a light version for a bounded study;
do not turn a factual lookup or ordinary bug fix into a research campaign.

## Establish the actual problem

Read the owning specification, data/protocol, current evidence and relevant project instructions.
Separate hard bounds from inherited choices: representations, parameterizations, splits,
architectures, objectives, stages, solvers and dependency choices are not automatically bounds.
Record the user's outcome, decision deadline, resource budget and success measure. Continue
authorized work with explicit reasonable assumptions; ask only for consequential missing input.

Describe the measurement and data-generating process from first principles. Identify artifacts,
confounds, independent sampling units, evaluation-time information, uncertainty and runtime limits.
Keep the strongest validated candidate reproducible, without making its design the search boundary.

## Map methods before expanding the run list

Use the project's existing research record rather than introducing competing state documents.
Maintain a compact coverage table with:

| Family / mechanism | Inherited choices kept or challenged | Actual test and context | Evidence / uncertainty | Untested form / next test |
|---|---|---|---|---|

Include relevant axes beyond architecture: data and supervision, preprocessing, representation
or parameterization, learning objective, transfer, inference/adaptation, optimization and systems.
Classify by functional method before judging scores. Distinguish an implementation port,
hyperparameter refinement, different learning mechanism and independent representation/system.
Several mechanisms may share one representation; disclose that dependence.

Mark coverage as proposed, implementation-checked, partially evaluated, complete in a stated
context, or disfavored in that form. A literature mention is not a tested method. No finite map
establishes exhaustive coverage. Inspect old code paths and controls before treating a closure as fact.

**Before claiming that search broadened, show an assumption that changed, an alternative that
changed it, and an artifact/test supporting the claim.** If only proposals exist, say so.
A fresh context that silently retains the original restriction does not establish broader exploration.
Use the [coverage audit](references/coverage-audit.md) at a plateau, major review or apparent breakthrough.

## Run a portfolio with meaningful alternatives

State the next wave's allocation between improving validated methods and exploring alternatives.
Choose it from the user's goal, measured headroom, uncertainty and cost; do not impose a universal ratio.
When breadth is the objective, give materially different approaches enough budget for a credible test.
Do not spend every lane on the incumbent, or declare a family closed after one weak implementation.

For a sustained campaign, keep candidate lineage: parent artifact, operation, method family,
controls, validity, result and cost. Distinguish new drafts, debugging and scientific improvements.
Allow new roots beyond the incumbent and bound repair effort; a large tree inside one family is
still narrow. Use [search policy](references/search-policy.md) when choosing branches or revising the research loop.

Research primary papers and official code; verify publication/revision dates, task, assumptions,
baselines and access to artifacts. Connect each borrowed mechanism to an observed bottleneck.
Separate a paper's empirical result, its interpretation and our transfer hypothesis. Interdisciplinary
ideas are useful when their assumptions fit; recency, prestige or a larger model is not evidence of fit.

Before scoring a new experiment, state mechanism, matched controls, expected numeric outcome
with uncertainty where meaningful, refutation and the decision the result will change.
Reuse a trustworthy evaluator; verify its scope and add a narrow identity/provenance check when needed.
Use [experiment cards](references/experiment-cards.md) for confounded, expensive or multi-stage studies.

Evaluate a whole alternative as a whole alternative. Evaluate a component in the relevant complete
system with downstream stages that genuinely use it. Posterior-only or frozen-stage interventions
have narrower meaning. An inferior weak decoder does not close its entire architectural family.

## Refresh reasoning without erasing evidence

At an agreed interval, a plateau, repeated near-identical proposals or a phase boundary, reassess
the map and inherited choices. For a requested wall-clock research block, record real start/end
and substantive work; idle time and unrelated implementation do not satisfy the duration.

Use genuinely fresh contexts for independent proposals when delegation is available and authorized.
Provide the actual problem, essential facts and non-negotiable constraints; avoid copying the entire
debate and its conclusions. Preserve required project instructions. A two-pass review can propose
from the problem first, then inspect the incumbent and historical evidence before execution.
Keep canonical evidence, failures and audit records with the coordinator; never delete them to imitate
forgetting. Preserve active jobs and source ownership when rotating workers.

Report what information was retained/withheld and whether a reset actually occurred. Compaction,
a new role label, or a handover containing every old conclusion is not a demonstrated reset.
Read [context and model routing](references/context-and-models.md) when using this mode.

## Interpret outcomes and continue

Check active code paths, no-op options, cache keys, model classes, data leakage and baseline parity.
An expected gain that becomes negative calls for competing explanations and discriminating tests:
information lost, calibration, target mismatch, optimization, broken implementation or interactions.
Try a sign reversal only when the mechanism makes sense; verify it against static and neutral controls.

Separate numerical correctness, training objective, held-out accuracy, full-system gain, throughput
and external/leaderboard results. Report intervals using appropriate independent units. Account for
repeated selection and dependent seeds/orders; small uncertain gains remain uncertain, not closed.
For speed, compare matched work and quality, warm paired runs, hardware/threads, memory and transfers.

Read complete valid experimental blocks as they land and queue justified follow-ups without waiting
for unrelated work. Keep independent lanes from depending on one shared fragile smoke. Source-lock
running jobs, validate new entry points early, and distinguish queued, running, completed and validated.
End a review with what changed in understanding, unresolved alternatives, and the next decisive tests.

## Improve this skill from use

The owner intends this to evolve. Apply the [evolution protocol](references/evolution.md) after
an explicit correction, reproducible failure, or useful cross-project observation. Prefer a narrow,
reversible rule change plus a behavioral case over accumulating universal restrictions.
Record evidence and counterexamples, validate the changed skill, and keep private project facts out
of public resources. This skill adds no permission for new spending, external disclosure or publication.
The [evidence notes](references/evidence.md) distinguish sources, user reports and design choices.
