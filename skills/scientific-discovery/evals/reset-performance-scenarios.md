# Reset and hardware planning scenarios

These synthetic cases test plans, not completed experiments. Use the assigned frozen skill and these
facts. Do not read the evaluation rubric or other workers' outputs.

## D: A research reset with disputed locks

User: “Progress stalled. Reset the team, challenge the design decisions, and plan the next four
simulator-hours. Two assistants are available. Preserve the running job and research record.”

- The official simulator accepts any connected optical graph with at most eight elements. It requires
  a minimum transmission of 95%; the user's goal is minimum noise subject to that requirement.
- A decision record says “six-element topology locked.” The record gives no source or rationale for
  this lock. The incumbent uses that topology; 100 runs changed only its continuous parameters.
- A running job uses a pinned snapshot. The canonical ledger records results, failures and contracts.
  A seven-element candidate failed at import; it never ran. The best six-element result is validated.
- Each assistant can propose or run authorized isolated tests. No external provider or spending is
  available. The coordinator owns the ledger, running job, requirements and final decisions.

Provide the reset procedure, a proposed wave and concrete assistant instructions. Identify which
decisions can be challenged and which constraints remain binding; do not claim execution occurred.

## E: Optimize an inference pipeline

User: “Make this pipeline as fast as practical on the available machine without changing its output.
Coordinate the work and use four engineering-hours.”

- A pinned model processes one fixed batch in 120 ms end to end on a 32-core CPU machine. The service
  requires numerically equivalent results within absolute tolerance 1e-5 and the same input/output.
- A GPU exists on the same machine. A prior prototype timed only 30 ms of GPU kernel execution but
  did not measure transfers, setup, preprocessing or end-to-end output equivalence.
- The input batches, CPU reference implementation, benchmark harness and two assistants are available.
  Thread settings, timing variance, memory use and component breakdown are not yet measured.
- The production source and running service cannot be modified during the study; no new paid services
  or external data sharing are authorized.

Provide worker briefs and a budgeted measurement-and-optimization plan. Define a fair speed comparison,
correctness checks and when to keep the CPU path. State which performance conclusions are unsupported.
