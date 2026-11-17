# Exploration and handoff comparison, 17 November 2026

## Design

The control was the version 0.2.0 skill at Git revision `8269d6e`. The first treatment appended the
[exploration and delegation candidate](basin-comparison-candidate.md) to the same frozen skill.
Four fresh workers, two per arm, independently produced plans for the same three
[synthetic scenarios](basin-comparison-scenarios.md), in the same order within each worker. Each
received the same task wording and could consult its arm's skill references. Workers were told not
to read other arms or scoring criteria. They inherited the available model configuration; exact model
identity, sampling parameters and token budgets were not recorded. Task instructions and requested
scope matched, but inference tokens, time and reference reads were not controlled.

A second comparison used the same control and the first candidate plus a
[reset and performance candidate](reset-performance-candidate.md). One fresh worker per arm planned
two additional [scenarios](reset-performance-scenarios.md). A third, one-worker-per-arm comparison
used the control and an intermediate 0.3.0 snapshot on the [data-first scenario](data-first-scenario.md).
Workers had access to a shared filesystem, so task instructions limited what they should read; this
was not enforced filesystem isolation. Each worker's cases shared that worker's context. No worker
ran a scientific experiment, controlled benchmark, subagent delegation or external service.

Independent reviewers assessed anonymized outputs against fixed criteria without receiving the arm
mapping. The [exploration rubric](basin-comparison-rubric.md) was written before output review. For
the reset rubric, the first reviewer incorrectly treated an inspectable, already feasible optical graph
as required even though the fixture omitted its schema and feasibility measurements. The
[reset rubric](reset-performance-rubric.md) was corrected; the reviewer appended a correction to
the original assessment. The data-first reviewer received the scenario and comparable checks in its
brief. See the full [exploration](basin-comparison-outputs/basin-judge.md),
[reset](basin-comparison-outputs/reset-judge.md), and [data-first](basin-comparison-outputs/data-judge.md)
reviews. No numerical total was used as a proxy for scientific quality.

## Observations

- Both arms generally distinguished actual bounds, invalid prior runs, methodological alternatives,
  controls and untested results. All four first-comparison plans were detailed and sometimes ambitious
  relative to their proposed budgets.
- One control plan described its first proposer as unprimed while its actual brief named the two- and
  three-component framing. It also described a hypothetical exception to an untouched holdout. The
  other control and both treatment plans separated the first proposal from later history review more
  clearly. This small sample does not establish that the candidate caused the difference.
- In the reset and hardware cases, both arms challenged the unsourced lock, preserved the job and
  evidence, and rejected a kernel-only speed claim. Both delegated construction of a graph without
  providing an inspectable topology; the fixture lacked the schema to verify a specific graph.
- In the data-first case, both plans investigated run provenance and profiled before selecting an
  optimization. The intermediate 0.3.0 response explicitly covered numerical tolerance and job
  interference; the control response gave more detailed timing and hardware distinctions. Neither
  comparison proves a causal advantage or a completed scientific or performance improvement.
- A fresh [forward check](basin-comparison-outputs/final-forward.md) of the revised skill on scenario C
  repeated a key failure: its first-pass brief named three-or-more-component mixtures while presenting
  the pass as independent. The coordinator added a direct instruction against this seeding afterward.
  That final wording has not had another behavioral forward test.

The retained edits emphasize data-first diagnosis, broad review of decision locks, actual worker brief
contents, coordinator verification and hardware-aware measurement. They are user-directed workflow
requirements informed by the observed planning gaps, not scientifically validated performance gains.
The tested candidate text and the final skill are not identical. The comparison did not test
verbalized sampling, introspective access to model activations, multi-provider reliability, or a live
multi-agent research campaign. More tasks, replications, controlled resources and real execution are
needed before making causal claims.

## Artifacts

- Exploration: [control A](basin-comparison-outputs/control-a.md),
  [control B](basin-comparison-outputs/control-b.md), [treatment A](basin-comparison-outputs/treatment-a.md),
  [treatment B](basin-comparison-outputs/treatment-b.md). Blind review responses 1–4 map respectively
  to control A, control B, treatment B and treatment A.
- Reset/performance: [control](basin-comparison-outputs/control-reset.md),
  [treatment](basin-comparison-outputs/treatment-reset.md). Blind responses 1 and 2 map to control
  and treatment respectively.
- Data-first: [control](basin-comparison-outputs/data-control.md),
  [intermediate 0.3.0](basin-comparison-outputs/data-final.md). Blind responses 1 and 2 map to
  intermediate 0.3.0 and control respectively.

SHA-256 of the frozen main skill files: control
`ab94847977d9c5737cd5ec32c8a170a305660fc768c787a6fa1cbcc43f31f981`; first treatment
`6421ac3df72f6e8fc42ba724839e735fdc020277b5aefe5928954ae8deb074b7`; reset treatment
`ea4c87d9b4df5ffbdda43e77d2f73b88f35155ad698ff9b5c98294daaa568d59`; intermediate 0.3.0
`3c06f4386a01a67241682a1ba229dcabb7a1e8dbb58a142941c2c34af437f112`. The control references were
copied from the same pinned revision; the final-data snapshot included the then-current references.
