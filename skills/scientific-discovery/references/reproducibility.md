# Proportional research reproducibility

Use the existing project record. Capture enough to reproduce a result at its claimed scope; avoid
building new infrastructure when a short record and existing tools suffice.

For each consequential result, record the input dataset and version or immutable artifact, how data
was obtained and processed, split and independent sampling units, code revision and uncommitted
changes, configuration, command, seeds, relevant dependencies and hardware, outputs and metrics.
Record missing information and permissions. Keep secrets and private data out of shared records.

Use a content hash where an important input or output has no reliable immutable version, or where
accidental changes would affect interpretation. State which file and algorithm were hashed. A hash
establishes content identity, not correctness, ownership, data quality, or reproducibility.

Check samples, schema, units, labels, duplicates, provenance, split overlap and leakage as relevant.
State what was actually checked and any inaccessible or unknown data. Record nondeterminism and the
acceptable tolerance; seeds alone do not guarantee identical outcomes across devices or runtimes.
When practical, rerun a meaningful result from the recorded inputs in a clean environment, compare
against the stated tolerance, and record the outcome. Otherwise report that reproduction is untested.

Clean up scratch space only after identifying active jobs, required artifacts, source snapshots and
retention rules. Preserve evidence and failed runs needed to interpret claims. Follow project and user
authorization before deleting files; never remove another contributor's work as routine cleanup.
