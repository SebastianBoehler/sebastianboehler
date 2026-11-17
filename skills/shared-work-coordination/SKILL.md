---
name: shared-work-coordination
description: Use when people or agents coordinate work across sessions, machines, or shared repositories, or need a durable scratchpad and precise handoffs.
---

# Coordinate shared work

Keep one understandable current state while preserving each contributor's work and the evidence
behind decisions. Use the project's existing tracker, journal, or scratchpad before creating another.

## Record current state

Keep only decision-relevant information: goal and success check; current status with evidence; active
tasks with owner and scope; decisions and constraints; blockers; next action and verification; last
update and relevant revision. Use named actors and direct verbs. Mark proposed, running, completed,
validated and deployed work distinctly. Link to artifacts rather than copying long logs or private data.
Archive or prune stale notes only under the project's retention and authorization rules.

Use the existing project convention for where the scratchpad lives and whether it is tracked or shared.
If no convention exists, choose a small project-local record appropriate to collaboration and privacy.
Do not publish credentials, private notes, unreviewed results or another contributor's work.

## Divide work and hand off

Assign a concrete outcome, owner, file or subsystem boundary, constraints, acceptance check and stop
condition. Avoid concurrent ownership of the same interface when practical. Identify shared contracts
before work starts. Make small, coherent checkpoints when the project workflow authorizes them; a
commit should be understandable and reversible without relying on unrelated work.

For a new session or authorized independent agent, provide the task and success check, mandatory
instructions, factual state, relevant artifacts and revision, permitted actions, known risks, and required
return. State what was omitted if independence matters. A new context is not proof of independence if
it receives the full prior narrative or can implicitly rely on it. Verify returned artifacts and integrate
them against the shared contract. Consult [prompt and context notes](references/context.md) as needed.

## Synchronize safely

Agree on how and when contributors synchronize. Inspect local changes and ownership before staging;
fetch and inspect remote changes and branch divergence before integrating. Preserve uncommitted work,
avoid overwriting or force-updating shared state, and resolve conflicts with the affected owners when
necessary. Use the repository's chosen branch and merge workflow. Fetching, committing, pulling,
pushing and publishing have different effects: perform each only when authorized and appropriate.
Update the scratchpad after meaningful changes and verify the shared revision where applicable.
