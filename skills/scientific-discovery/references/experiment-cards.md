# Experiment and decision record

Use the project's format and include only fields needed to interpret the comparison.

**Before scoring:** state the question/mechanism, assumption challenged, scope (component or whole
system), data/splits and allowed inference information, source/configuration, matched controls,
expected outcome and uncertainty where meaningful, refutation, next decision, and resource budget.
Check relevant exclusion rules, reset behavior, active options/gradients, and evaluator provenance.

Set comparison rules before seeing scores and explain later changes. Choose controls that distinguish
the mechanism from added compute, capacity, calibration, or a changed objective. A whole replacement
may require coordinated changes; a component claim needs the system wiring that uses it.

**After the result:** record what ran, passed controls, metric/uncertainty, independent sampling units,
selection history, cost, artifact pointers, and limits. Preserve official scores. Distinguish numerical
correctness, training loss, held-out performance, complete-system gain, runtime, and external rank.
Dependent seeds/orders and overlapping ensembles may not be independent replication.

Investigate surprises with competing explanations and a discriminating check. For example: inspect
wiring when new features have no effect; compare calibrated controls for apparent information gains;
match workload and numerical quality when an implementation appears faster. These are hypotheses,
not required mechanisms. Test combined effects rather than adding isolated gains.

Keep source snapshots fixed for running jobs and smoke new entry points. Use saved completed evidence
to release justified follow-ups; unrelated questions should not all depend on one fragile gate.
A scheduling workaround must preserve scientific validity. State unresolved comparisons rather than
closing a family from a weak form or a small uncertain difference.
