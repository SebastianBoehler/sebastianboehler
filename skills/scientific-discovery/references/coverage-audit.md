# Audit research breadth

Use at campaign starts, plateaus, major reviews, or claims of broader exploration. Reuse the ledger;
the audit should expose decisions and gaps rather than promise exhaustive coverage.

Trace inherited choices to their source: binding requirement, physical limit, resource estimate, or
design decision. Recheck the justification against current data and tools. Include data generation,
measurement, supervision, representation, objective, inference, optimization, and systems where relevant.

Classify methods by what changes in behavior and available information:

| Example | Evidence at this scope |
|---|---|
| More seeds or settings in one pipeline | Refinement and robustness within that design |
| Porting the same equations | Implementation/efficiency comparison; check numerical changes |
| New head with fixed features | A learning change within a shared representation |
| New representation and coherent inference | A different system if actually implemented and tested |
| More agents with the same proposal | Additional proposals, not tested method diversity |
| Fresh chat retaining the original restriction | Context changed; the restriction may remain |

These are qualitative distinctions. A new architecture can implement the same mechanism, while a
new optimizer can change behavior. Inspect code and controls before accepting a method label or closure.

For each result, identify source revision, data, settings, comparison, and whether it measures a
component, partial system, or coherent alternative. Check that downstream stages consume the change.
A weak implementation or failed import does not refute an entire family; a weak-baseline gain does
not establish an improvement over the validated system.

Return chosen restrictions versus hard bounds; tested families and artifacts; missing forms/axes;
concrete alternatives that challenge important choices; spent/remaining budget; and the next allocation
with conditions that would change it. Mark proposals, partial tests, and validated results distinctly.
If no tested departure exists, report concentrated exploration. Keep a family open only when a credible
remaining uncertainty justifies more work; avoid diversity quotas and novelty for its own sake.
