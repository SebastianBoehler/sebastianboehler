# Latency report notes

The agreed acceptance check is a reduction of at least 10% in p95 latency on the full 10,000-request
replay, with identical outputs and peak memory at or below 512 MiB. Compare pinned builds on the same
host with the same benchmark settings. The reporting task authorizes no benchmark runs or changes.

The project ticket describes K, a scheduler change, as a 30% improvement. Its numbers are 100 ms
p95 for baseline on the full replay and 70 ms for K on the first 1,000 requests. The benchmark
maintainer found that the candidate command used `--limit 1000`. Baseline p95 was 65 ms when the
maintainer used that same subset. The notes contain no full-replay result for K.
