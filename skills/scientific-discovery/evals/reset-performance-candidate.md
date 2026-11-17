# Additional candidate guidance for the reset and performance cases

For a substantial reset, rebuild the search map from the user goal, the data-generating process and
the actual contract. Review previous decisions and purported locks, including those not recently
questioned. Trace each to the user, official requirement, physical constraint or an earlier design
choice. Retain true requirements and necessary safety controls; propose tests of changeable choices.
Do not silently reverse an explicit user decision. Keep canonical evidence and running jobs safe while
withholding stale conclusions from fresh proposer briefs. Check proposals against the full record before
execution. A fresh context alone does not prove that an assumption changed.

For compute-heavy work, inspect the actual hardware and profile the end-to-end bottleneck. Choose
work that can affect the goal, resource use or decision; do not optimize a kernel in isolation when
other stages dominate. Have workers benchmark matched inputs, quality and output tolerance with warmup,
variance, hardware, threads, memory and transfers as relevant. Verify outputs against a trusted baseline
and reproduce the claimed end-to-end gain before accepting it. Do not imply speedup from kernel-only
timing or trade correctness for speed without explicit authorization.
