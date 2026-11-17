# Map exporter work log

## Service contract

For every feature, exported geometry must remain within 2 m of the reference. Keep feature order
and the public API. The implementation and transfer strategy are open. The GPU has enough memory
for one request's intermediates. The service also runs overnight batches through the same exporter.

## Frozen baseline and traces

Production trace replay on the reference GPU measures 7.8 ms end-to-end p95 for interactive requests.
Nightly throughput is 850 tiles per minute on that GPU. The interactive tail trace attributes about
4.8 ms of a representative 7.8 ms request's critical path to blocking transfers and synchronization,
1.3 ms to kernel execution, and 1.7 ms to other request work. Transfer and synchronization appear as
one stage in the trace. It does not isolate which costs are avoidable or overlap with computation.

Three launch-configuration changes made kernel time up to 0.2 ms faster. Interactive p95 stayed
within the baseline's run-to-run variation of 0.15 ms. The scratch plan says to try more block sizes
and avoid batching transfers because an earlier prototype used a different input layout. A 45-minute
reference-GPU benchmark slot is available after the planning decision.
