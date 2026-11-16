# Audit whether the search actually broadened

Use for campaign starts, plateaus, retrospective reviews and claims of broad exploration.
The output is evidence of coverage and gaps, not reassurance that all useful ideas were considered.

## Audit the inherited design

List choices that became implicit constraints. For each, name its source:

- Contract, physical limitation, user's actual requirement, resource estimate, or design choice?
- Is the original justification still supported by present data and tools?
- What outcome could another representation or parameterization make reachable?
- Was a previously rejected family actually evaluated on the same task and system?

Inspect the process that creates the data, its measurement artifacts and the desired prediction/action.
Ask whether the current objective, training examples or intermediate representation discard information.
Check whether evaluation choices reward the desired behavior and whether those choices are required.

## Classify exploration by changes in mechanism

| Example | What it establishes |
|---|---|
| More seeds, weights, regularization or temperatures on one pipeline | Refinement and robustness within that design |
| Porting the same equations from Python to C++ | An implementation/efficiency comparison; numerical changes need separate interpretation |
| New head on fixed features | A learning mechanism change within a shared representation |
| New data/representation with its own coherent inference | A substantially different system, if actually implemented and evaluated |
| More models/providers proposing the same design | Additional proposals, not demonstrated method diversity |
| Fresh context retaining the original parameterization as a requirement | A context change without evidence that the restriction was challenged |

These are qualitative distinctions, not a universal clustering theorem. A different optimizer can
change scientific behavior; a different architecture can still implement essentially the same method.
Describe what the code does and its available information before attaching a family label.

## Read the evidence at the right scope

For every claimed result, identify exact source revision, model class, settings and data scope.
State whether it ran alone, in a partial system, as a component, or as a coherent alternative.
Check that downstream stages consume the new representation when that is part of the hypothesis.
Record weak controls, missing forms, untested integrations and null/no-op implementations.

A negative result may refute an exact form while leaving a large family open. Conversely,
a gain against a weak baseline may be scientifically informative without improving the incumbent.
Prefer several forms when a family has measured large headroom and low-cost discriminating tests.
Do not keep every family alive indefinitely: explain what remaining uncertainty justifies more work.

## Evidence required for a review

Produce a compact record containing:

1. Hard bounds versus chosen restrictions.
2. Actual explored families, with code/test pointers and validation limits.
3. Untested families and missing axes, including ones excluded by the incumbent's structure.
4. One or more concrete alternatives that change consequential assumptions.
5. Resources already spent and the next wave's allocation by method family, not only job count.
6. Conditions that would change this prioritization.

Use examples and counterexamples to challenge the map. Do not invent an alternative merely to fill
a diversity quota, select a complicated model for novelty alone, or claim an exhaustive solution space.
If a review finds no tested departure, say: exploration is still concentrated in this design.

## Confidence and communication

Do not infer coverage from the agent sounding confident, reading many papers or producing many artifacts.
Statements such as “we reset,” “we stepped back,” or “we covered the space” need the records above.
Keep promising proposals distinct from executed exploration. A user should be able to inspect why
the next experiment explores a different possibility and what an unfavorable result would mean.
