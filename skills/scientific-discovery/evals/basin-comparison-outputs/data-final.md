# Climate experiment: three-hour investigation plan

The reported scores and runtimes currently justify **only a report of an observed difference in chat**. They do not establish that the new configuration caused either the lower score or the longer runtime. The runs used different data snapshots, code revisions, and preprocessing settings, and the underlying logs have not been checked. We cannot identify the bottleneck or select a remedy yet.

**Working assumption:** three engineering-hours means 180 combined person-minutes for the coordinator and the one assistant, including investigation, setup, review, and active monitoring. Concurrent work counts for both people. This is a planning allocation, not a claim that the work or experiments have happened. The machine, GPU, 64 GB RAM, accessible data and code, unchanged evaluation split, same held-out metric, and prohibition on extra paid resources are fixture facts. The actual workload, run duration, metric direction, dataset properties, and available logs are unknown.

## Allocation and stopping rules

| Work | Coordinator | Assistant | Decision or artifact |
|---|---:|---:|---|
| Establish run provenance and inspect actual data | 25 min | 35 min | Run manifest, data and evaluation facts, missing evidence |
| Inspect active code and measure a representative path | 35 min | 25 min | Stage boundaries, resource traces, active-path and correctness risks |
| Run the most discriminating matched comparison that fits | 35 min | 10 min | Paired evidence or a documented reason comparison was infeasible |
| Check returned evidence and recommend next test | 15 min | 0 min | Conclusion with limitations and remaining uncertainty |
| **Total** | **110 min** | **70 min** | **180 combined engineering-minutes** |

These are caps, not guaranteed elapsed times. Run the two inspection lanes concurrently if practical, but serialize GPU-intensive tests so they do not interfere. Stop a phase early if the relevant evidence is unavailable, the test cannot finish within the remaining budget, or memory approaches the machine limit. Use any saved minutes for the highest-value missing check and record the change. Do not start a full training run merely to fill the budget. If a run needs longer, record the proposed runtime and return a next-step recommendation rather than claim a result.

## 1. Establish what was actually compared

Find the old and new run artifacts, complete logs, exact commands, timestamps, checkpoint and output identities, code revisions and uncommitted changes, dependency versions, configurations, seeds and ordering, hardware and thread settings. Identify precisely what each reported runtime includes and how each score was calculated. Confirm whether both scores use the same held-out metric and the required existing split. Check timestamps and artifact identities before assigning logs or results to a run. Use file hashes where immutable identities are missing; hashes establish identity, not correctness. Preserve the old run and all inputs.

Inspect the dataset and its provenance before selecting any model or systems change. Record schema, dimensions, units, targets, missingness, preprocessing, sample and independent evaluation units, temporal and spatial coverage where applicable, and available information at inference. Check representative samples, duplicates or overlap, and any plausible leakage across the existing split. Determine how the old and new snapshots and preprocessing differ, and whether either difference changes the amount or meaning of work or the metric. Do not infer a defect from a mere difference.

If logs or provenance are absent, identify the exact missing artifact and what cannot be compared. If safe and feasible, produce a new isolated baseline with a complete manifest instead of reconstructing facts from chat. If no trustworthy baseline can be produced in budget, make the outcome a diagnosis plan, not a causal finding.

## 2. Locate the limiting work and check correctness

Inspect the actual entry point and active code paths, including cache behavior, data loading, preprocessing, training, transfers, and evaluation. Profile the smallest representative workload from the existing split and configuration, with enough repeated work to expose steady-state behavior; document any setup or cold-start cost separately. Do not assume a small sample represents a full run without checking its size and composition against the real workload.

Measure wall-clock time at meaningful stage boundaries and end to end, including preprocessing, data transfers and synchronization, training, and evaluation where the reported runtime includes them. Record workload size, sample and batch counts, hardware, software, device and thread settings, precision, warmup, peak host and GPU memory, and CPU/GPU utilization where observable. Synchronize around asynchronous GPU timing boundaries so timings capture completed work. Repeat paired warm measurements if time permits, and retain their spread rather than treating one timing as definitive. If coarse stage measurements do not explain end-to-end time, inspect unaccounted setup, waiting, I/O and inter-stage gaps before picking a remedy.

Before accepting a timing or score difference, check that the paths process the same intended inputs and amount of work, use the same split and evaluator, and produce outputs with matching shapes, units, and appropriate numerical tolerance. Establish that tolerance from the task or reference; if none exists, report that correctness remains unverified. Record runtime separately from the held-out metric and peak memory. A faster component is not evidence of a faster complete experiment.

## 3. Choose one comparison based on the evidence

Pre-register the comparison in the existing project record: question, mechanism, exact snapshots, code, preprocessing, command, controls, expected direction as a hypothesis, invalidation condition, resource cap, and decision. No numeric improvement is assumed without measured headroom.

- **If provenance supports controlled reproduction:** keep the data, split, evaluator, seed/order policy, and all other settings fixed while changing one suspect factor at a time. Compare the old and new configuration on matched work. If code, data, or preprocessing cannot be swapped independently, label the comparison confounded and identify the smallest additional control needed. Do not infer a cause from the original old/new pair.
- **If a measured stage dominates:** choose one intervention appropriate to that stage, such as investigating repeated loading if the trace shows repeated loading, or redundant preprocessing if the trace shows that work. Compare it with an unchanged reference on the same input and output quality. Include all overhead and peak memory. Reject or investigate a claimed speedup if it changes the workload, fails correctness, or degrades the target metric; if variance overlaps the effect, report uncertainty.
- **If score discrepancies remain after provenance checks:** inspect a matched prediction or output comparison and metric computation first. Depending on the observed difference, isolate data, preprocessing, or code as the next factor. A short training screen may guide the next test, but it does not prove full-training held-out performance. Keep the evaluation split fixed and disclose repeated selection on the held-out metric.
- **If there is no representative, safe, or affordable comparison:** return the missing evidence, a bounded instrumentation or reproduction command to prepare, and the next decision it would enable. Do not declare a bottleneck or recommend a GPU optimization on speculation.

Use available independent units, such as genuinely independent sequences or spatial/temporal blocks if appropriate to the dataset, to characterize score uncertainty. Seeds and repeated timings do not automatically supply independent data units. A gain needs both the desired held-out metric and complete runtime measured at the stated scope; no result from this planning exercise establishes either.

## Assistant brief

**Assignment:** In a separate isolated working directory, spend at most 70 engineering-minutes inspecting the actual data, run artifacts, evaluation path, and active code. Coordinate access with the coordinator; do not start competing GPU-intensive work. The purpose is to establish comparability and identify what must be measured, not to propose a GPU fix in advance.

**Given:** The user wants the same held-out metric improved on the existing evaluation split. Old and new runs differ in data snapshot, revision, and preprocessing; chat reports an unfavorable score and runtime for the new configuration, but logs have not been verified. The machine has a GPU and 64 GB RAM. No new paid resources, external data sharing, input overwrites, or deletion of the old run are allowed.

**Scope and actions:** Spend up to 35 minutes on data, logs, configurations and evaluator provenance; then up to 25 minutes mapping the execution path and identifying meaningful timing and correctness boundaries; reserve up to 10 minutes to support the coordinator's matched check and deliver the record. Read source and local artifacts. Use a separate directory for any scratch outputs and non-destructive instrumentation; never edit or overwrite the original inputs, run outputs, or running jobs. Do not launch a long job or change the evaluation split. Report an unsafe, missing, or ambiguous artifact rather than guessing.

**Return:** A concise manifest with exact source and artifact paths or immutable identities, commands and settings found, dataset schema and relevant units, metric and split evidence, changes across runs, active stages and possible hidden work, correctness and leakage risks, and explicit unknowns. Distinguish observed facts from hypotheses. Propose one feasible, controlled measurement with its time and memory constraints, predicted direction as a hypothesis, and a result that would refute it. Include any commands or code changes used and their output locations so the coordinator can inspect them.

**Acceptance:** The coordinator checks the actual source and active path, input and evaluator identities, comparison controls, timing boundaries, correctness evidence, and memory before accepting the assistant's conclusion. An unexecuted proposal remains a proposal; unavailable logs, incomplete runs, or unverified outputs stay explicitly unresolved.
