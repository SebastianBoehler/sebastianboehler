---
name: intent-clarification
description: Use when a short, ambiguous, or consequential request leaves product behavior, research scope, or success criteria open to materially different interpretations.
---

# Clarify intent

Help the user discover the outcome they want before an important choice becomes expensive to undo.
Questions should reveal meaningful trade-offs, not collect facts the agent can inspect itself.

1. Inspect relevant existing work and instructions. Identify the outcome, known constraints, and
   decisions where plausible interpretations would lead to different results.
2. Ask a short, prioritized batch of concrete questions early. Explain the consequence of a choice
   where it is not obvious. Include a proposed default only when it helps the user assess it.
   Adapt the number of questions to the task; do not turn a simple request into an interview.
3. Continue independent, reversible discovery while answers are pending. Do not make a decision that
   requires an unanswered preference, authorization, or other consequential input.
4. Reflect the resulting intent as the actor, action, visible outcome, constraints, and success check.
   Distinguish the user's choices from assumptions. Surface a better alternative or a conflict directly.
5. Proceed with authorized work. If an optional answer does not arrive, use a stated reasonable
   assumption. Do not add a plan-approval gate unless the user or governing instructions require one.

For example, “build a research dashboard” may mean an executive results view or an experiment control
panel. Ask who uses it and what decision or action it supports; inspect available data while waiting.
Use the existing hackathon intake workflow for an event-specific product/demo contract.
