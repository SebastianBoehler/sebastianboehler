# Data-first diagnosis scenario

User: “Our climate-model experiment takes too long and the new configuration scores worse. We have
three engineering-hours and one assistant. Find the bottleneck and decide what to try next.”

- The old and new runs used different data snapshots, code revisions and preprocessing settings.
  The scores and runtimes were reported in a chat message; the underlying logs have not been checked.
- The machine has a GPU and 64 GB RAM. Training, input loading and preprocessing are involved, but
  no stage timings, utilization, memory usage or numerical correctness checks are available.
- The existing user goal is to improve the same held-out metric without changing the evaluation
  split or exceeding the available machine's memory. The actual dataset and code are accessible to
  the assistant in this scenario; no experiments have been run in this planning exercise.
- The coordinator can inspect artifacts and use one assistant in an isolated directory. Neither may
  delete the old run, overwrite inputs or share data externally. No new paid resources are authorized.

Provide a budgeted investigation and a concrete assistant brief. State what you will inspect or
measure before choosing a remedy, what you will do if evidence is missing, and what conclusion the
reported scores currently justify. Do not invent measurements or assume a GPU optimization is the fix.
