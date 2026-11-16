# Initial behavioral check, 17 November 2026

One fresh-context worker, requested as `gpt-6.1-sol`, applied the prepublication core skill to
scenarios A and C. It received the skill and raw fixtures, without the rubric or intended answers.
It read relevant references and wrote planning artifacts. The two cases shared that worker's context;
this was not a separate independent model run per case or a cross-provider experiment.

Observed behavior, reviewed by the coordinator:

- A distinguished the official graph interface from the chosen six-element topology and parameter
  encoding. It described 250 optimizer runs as refinement, and a failed import as an untested family.
- Its three experiment cards allocated exactly six compute-hours, included whole-graph alternatives,
  controls and refutation, and distinguished proposals from executed coverage.
- C identified the absent second provider and offered an available one-provider fresh-context plan.
  It preserved active jobs and the ledger, disclosed mandatory history exposure, and did not claim
  that this coordinator had actually reset or that provider calls had run.
- Both named missing information and uncertainty rather than inventing simulator behavior or results.

The relevant planning checks in `rubric.md` passed on these two artifacts. No scientific experiment,
paid call or repository mutation was executed by the worker. There was no no-skill control, no test
of scenarios B/D and no evidence of improved scientific outcomes. The AIDE search-policy extension
was added after this core test and received source review and structural checks, not a forward-test.
The live source file was not pinned for that initial worker; future checks should pin the input revision.

Raw answer artifact SHA-256 values are recorded below for audit; the fixtures are in `scenarios.md`.

- Case A: `81e15b22c608374cfa434ff92b05a41345f3d20013b0c611fb5f7e433614d428`

- Case C: `0eac68e3d659599b92ab79837f159c67ffccf7cf2deac40ade13ac4ef89fa918`
