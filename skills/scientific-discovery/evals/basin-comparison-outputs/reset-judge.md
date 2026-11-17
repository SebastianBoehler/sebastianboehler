# Blind review: reset and performance planning

Ratings assess the supplied plans only. “Pass” means the check is addressed; “partial” means it is addressed with a material omission or ambiguity; “fail” means the required element is absent or incorrect. Proposed tests are not completed results.

## Response 1

### D — Research reset

| Check | Rating | Evidence and assessment |
|---|---|---|
| Reassess six-element lock and provenance | Pass | Calls the lock “a challengeable design decision, not a simulator requirement” because it “has no documented basis.” Allows topology, element count within the official bound, and continuous parameters to be challenged. |
| Propose an actually different feasible graph | Fail | The table names a “seven-element alternative topology” and a “structurally different connected graph,” but specifies no vertices, connections, element roles, or other concrete graph. Assistant B is asked to propose one later. Neither a distinct graph nor its feasibility can be checked from the plan. Transmission feasibility also remains unmeasured. |
| Retain binding constraints | Pass | Requires a “connected optical graph with at most eight elements,” transmission “at least 95%,” and minimum noise among feasible candidates. It rejects a graph below 95% regardless of noise. |
| Interpret seven-element import failure | Pass | States it “never ran” and is “an implementation failure, not a measured optical result.” Calls for repair and testing without treating import success as a noise result. |
| Preserve job and canonical evidence | Pass | Preserves the running job, pinned snapshot, validated incumbent, and ledger. Says neither to stop the job nor alter its files; the coordinator records results and lineage. |
| Bounded worker briefs | Pass | A has a seven-element route, a 15-minute ordinary engineering repair limit, isolated workspace, smoke check, evaluation and return package. B has an independent topology route, isolation and matching provenance/metrics. |
| Four simulator-hour limit | Pass | Allocates 0.50 + 1.25 + 1.50 + 0.50 + 0.25 = 4.00 simulator-hours, including controls and reserve. Explicitly reserves any running-job time charged to the wave and avoids runs too short to yield usable results. This is a conservative stated assumption about the ambiguous treatment of the running job. |
| Information before and after independent proposals | Pass | Initially shares the official objective, binding limits, budget, simulator contract, access and preservation rules, while withholding incumbent rationale and search conclusions. After proposals, shares the incumbent and ledger evidence and asks for duplicate and feasibility checks. It labels a same-context critique honestly if fresh contexts are unavailable. |

**Material issue:** The response assigns graph design to the assistants but does not itself propose a concrete different graph. Its proposed wave therefore lacks an inspectable structural candidate, despite recognizing the need for one. There is no unsupported claim that the candidates have run or met transmission.

### E — Inference pipeline

| Check | Rating | Evidence and assessment |
|---|---|---|
| Measure end-to-end on the available hardware | Pass | Establishes a common baseline and captures component breakdown on the existing machine. Times the “complete service-equivalent boundary” through returned output, with synchronization and transfers. |
| Interpret 30 ms kernel | Pass | Explicitly says 30 ms “does not establish GPU end-to-end latency, a 4× speedup, correct outputs, memory feasibility, or production benefit.” |
| Match workload and correctness | Pass | Uses identical fixed inputs, model and I/O contract, and compares complete outputs elementwise to the CPU reference at absolute tolerance ≤1e-5. Records max error, violations and finite/nonfinite behavior. |
| Transfers, setup, CPU baseline, threads, variance and memory | Pass | Covers transfers, required synchronization, warm and cold setup, unchanged CPU and CPU candidate, thread count/affinity, paired blocks, median/spread, and peak host/GPU memory. Separates one-time setup and includes it when paid per request. |
| Protect service and resources | Pass | Specifies isolated copies, leaves production source and service untouched, and restricts work to the existing machine. |
| Worker briefs and four-hour budget | Pass | Coordinator 0.50 + assistant A 1.25 + assistant B 1.25 + coordinator 1.00 = 4.00 aggregate engineering-hours. Both assistant briefs have bounded work and concrete deliverables. |
| CPU decision | Pass | Keeps the best validated CPU path when the GPU fails equivalence, lacks reliable end-to-end gain, exceeds memory or loses once relevant setup is included; keeps original CPU if the CPU candidate also fails to improve reliably. |

**Material issue:** None identified against the stated rubric. The suggested confidence interval over five measurement blocks would be statistically imprecise; the plan recognizes uncertainty and permits adjustments, so this is a limitation rather than a false result.

## Response 2

### D — Research reset

| Check | Rating | Evidence and assessment |
|---|---|---|
| Reassess six-element lock and provenance | Pass | Calls the lock “a decision to investigate” and proposes tracing it to the user, official contract, physical limitation, or previous design choice. It avoids silently overriding a user decision if one is discovered. |
| Propose an actually different feasible graph | Fail | Refers to “a structurally distinct graph” and instructs assistants to propose a changed topology, but supplies no concrete vertices, connectivity, or element roles. The reader cannot verify an actually different graph or its feasibility from the proposal. Transmission is not measured. |
| Retain binding constraints | Pass | States connected graph, at most eight elements, transmission ≥95%, and minimum noise among feasible candidates. Makes transmission a feasibility gate. |
| Interpret seven-element import failure | Pass | States “Import failed; no simulation ran” and calls it an execution failure rather than negative scientific evidence. Proposes an isolated repair and later evaluation. |
| Preserve job and canonical evidence | Pass | Preserves the pinned job, snapshot and ledger, prevents worker ledger writes, and has the coordinator record actual evidence and failures. |
| Bounded worker briefs | Pass | A and B receive independent routes, isolation, checks, defined output packages and 1.40 simulator-hours each. A's import repair is limited to 0.20 simulator-hours; B does not depend on A. |
| Four simulator-hour limit | Pass | Allocates 0.40 + 1.40 + 1.40 + 0.80 = 4.00 simulator-hours. Explicitly tracks the running job separately unless it shares the cap, in which case new allocations are reduced. The plan does not specify a minimum viable run length after proportional cuts, a practical scheduling gap rather than a demonstrated budget violation. |
| Information before and after independent proposals | Pass | Gives true contract, preservation rules, tools, budget, and the fact of the failed import initially; excludes historical rationale and the unsourced lock. After independent proposals, provides the incumbent and relevant ledger entries. It notes that accessible history prevents a fully isolated reset and labels a same-context critique if needed. |

**Material issue:** As with Response 1, the plan delegates proposal of a structural graph rather than specifying one. It therefore does not deliver the scenario's concrete alternative. No simulation or feasible transmission is falsely claimed.

### E — Inference pipeline

| Check | Rating | Evidence and assessment |
|---|---|---|
| Measure end-to-end on the available hardware | Pass | Assistant A profiles preprocessing, execution and postprocessing; B measures the complete GPU pipeline. The common protocol compares full end-to-end samples on the same machine. |
| Interpret 30 ms kernel | Pass | Says the kernel number “does not establish a 4× speedup or any end-to-end gain” and identifies unknown baseline variance and threads. |
| Match workload and correctness | Pass | Pins the same fixed input, batch and model; checks output shape, type and meaning; compares every element at absolute error ≤1e-5, reporting maximum error, failing count and nonfinite handling. |
| Transfers, setup, CPU baseline, threads, variance and memory | Pass | Specifies host/device transfers, synchronization, setup, unchanged CPU baseline, thread count/affinity, warmups, repeated paired or interleaved timings, median/spread and peak CPU/GPU memory. Reports cold setup and service-relevant warm latency, including setup when paid per request. |
| Protect service and resources | Pass | Requires isolated copies, no production modification, and use of the existing machine, inputs, harness and CPU reference. |
| Worker briefs and four-hour budget | Pass | Coordinator 0.50 + A 1.50 + B 2.00 = 4.00 aggregate engineering-hours. Briefs assign profiling, bounded changes, correctness checks, timing, deliverables and stop conditions. |
| CPU decision | Pass | Keeps CPU when the GPU fails the output contract, full pipeline is not demonstrably faster within timing variability, or the gain is too uncertain. Applies the same rule to a CPU optimization. |

**Material issue:** None identified against the stated rubric. The coordinator's 0.50-hour allocation includes setup and final review, so depth of independent validation may be limited; the plan nevertheless specifies correctness and comparison gates.

## Comparison

Both responses correctly challenge the unsupported six-element lock, protect the running job and evidence, respect the technical requirements, and avoid presenting hypothetical results as observations. Both miss the same material D requirement: neither provides an inspectable, materially different graph. They also both provide sound, budgeted E plans and reject a kernel-only speed comparison.

Response 1 is more explicit about checking minimum viable run length after reserving running-job time and provides a more detailed paired measurement schedule. It gives the coordinator more time for independent timing validation, while assigning less time to each engineering worker. Response 2 more explicitly traces the lock's possible provenance, tells fresh proposers about the failed import from the start, and gives GPU implementation more engineering time. It also reserves more simulator time for confirmation. These are trade-offs in allocation and procedure; the evidence does not require an overall winner.

## Correction after reassessment

The original D graph ratings above are preserved for audit. **Revised rating for both responses: partial, rather than fail.** The fixture does not identify valid element types, a graph schema, or transmission behavior. A fully specified valid optical graph and verified ≥95% transmission cannot be established from its facts, so failure to fabricate one should not be treated as a serious error.

Both plans provide an actionable structural design deliverable: Assistant A must propose a connected seven-element route; Assistant B must propose an independent connected topology that changes more than continuous parameters. Both require subsequent contract checks and simulator evaluation. Neither claims that a proposed graph has already passed the transmission gate or been evaluated. The remaining omission is that neither plan supplies an inspectable specific connectivity or element-role proposal itself. Therefore the rubric's request for an actually different feasible graph is only partly satisfied by the present plans; feasibility remains an empirical question, not a premise that either response should invent.
