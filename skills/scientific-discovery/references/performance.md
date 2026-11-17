# Measure and optimize compute-heavy work

Start from the actual objective, workload, available hardware, resource budget and acceptable output
or numerical tolerance. Inspect input data, execution boundaries and existing baseline before choosing
an optimization. If the bottleneck is unknown, profile or instrument the smallest representative path.
Record what was measured and what remains uncertain. A plausible theory or a kernel timing is not an
end-to-end result.

Use measurements to rank work by expected impact and cost. Check algorithmic work, unnecessary data
movement, memory access, parallelism, numerical precision and hardware utilization when relevant.
Optimize the limiting path for the specific hardware and task; do not assume a GPU, larger batch or
more threads is faster. Keep the approach proportional to the user's budget and research goal.

For each candidate, identify the source and inputs, hardware and software, thread settings, batch,
precision, warmup and timing boundary. Compare the same work and output quality against a trusted
reference. Include transfers, synchronization, setup, preprocessing and postprocessing when the actual
service pays for them. Report cold and warm behavior separately when relevant. Repeat paired runs,
capture variance and memory use, and investigate unexpected differences instead of discarding them.

Check the complete output against the reference, including shape, units and numerical tolerance.
Inspect the active code path so a no-op or reduced workload cannot masquerade as an improvement.
The coordinator independently checks the returned source, measurements and output evidence before
accepting a worker's speedup claim. Preserve the validated baseline and active jobs; report a result
as unverified when the available hardware, data or time cannot support the intended check.
