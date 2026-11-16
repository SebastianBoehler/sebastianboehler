# Experiment cards and decision records

Use the owning project's format if it already records these fields. Keep cards proportional to the test.

## Before scoring

- **Question and mechanism:** what changes, why it might help, and which inherited choice it challenges.
- **Scope:** whole alternative, component in a complete system, standalone screen, or engineering benchmark.
- **Inputs:** data/supervision, split units, allowed inference information, source revision and seed/order policy.
- **Controls:** unchanged reference, zero/identity where relevant, matched capacity/budget, and an alternative
  explanation such as generic calibration, added compute or a changed training objective.
- **Prior:** expected numeric direction/range where meaningful; distinguish a conjecture from measured headroom.
- **Refutation and decision:** what invalidates the implementation, weakens the mechanism, or changes the next step.
- **Resources:** authorized hardware, cost/time/memory/concurrency and the minimum credible test.
- **Validation:** data exclusion, no-future/reset behavior if applicable, active gradients/options and provenance.

Set rules before scoring; explain any change after seeing results. Do not present a post-hoc comparison
as independent confirmation. An interval spanning zero may leave a direction undecided. A tiny miss
of a chosen threshold inside uncertainty is not a definitive family closure.

## After a valid result

Record what actually ran, controls that passed, metric/interval, independent sampling units,
selection history, people/domains/seeds that disagree, cost and validation limits.
State the implication at the tested scope. A component gain does not automatically add to other gains;
test interactions and the combined system. A standalone loss does not close a coherent integration.

For a negative surprise, list competing explanations and choose a test that separates them. Examples:

| Explanation | Discriminating test |
|---|---|
| Overconfidence instead of new information | Temperature/neutral-output controls; calibration and margin diagnostics |
| Alignment erases discriminative structure | Class-conditional versus unconditional alignment with matched objectives |
| Adaptation optimizes the wrong behavior | Frozen, update/sign, anchor and source-query-trained controls |
| A closure measured a weak implementation | Reproduce its exact code path, then test a strong matched form |
| New features never reach later stages | Inspect wiring; compare own-feature stages with the explicitly frozen-stage intervention |
| “Faster” means less work or worse fit | Same inputs and numerical quality; paired timing with transfers and stopping criteria |

These examples are hypotheses, not required mechanisms or automatic repairs.

## Interpretation boundaries

Keep separate: import/build success, numerical equivalence, lower training loss, held-out metric,
complete-system effect, external score/rank and runtime. Use uncertainty that resamples the actual
independent units; repeated orders and overlapping ensembles may not be independent replication.
Report source-only selection and held-out evaluation separately. Preserve official metrics.

For runtime, record exact scope, warm/cold conditions, device, threads/affinity, precision, batch size,
memory/copies, solver stopping quality and cost. A language port alone establishes no efficiency gain.
A faster component may have a small end-to-end effect. Lower latency does not establish lower energy use.

For multi-job campaigns, source-lock each snapshot, smoke new entry points and verify dependencies.
Release next phases from saved completed evidence when the scheduler cannot reference old jobs.
Independent questions should not all wait behind one unrelated fragile gate. Do not relax scientific
guards to keep jobs moving; use an explicit independently validated execution route where useful.
