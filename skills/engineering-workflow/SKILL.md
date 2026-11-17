---
name: engineering-workflow
description: Use for software engineering work, including implementation, debugging, refactoring, reviews, and technical design. Adapt the approach, depth, and verification to the task rather than following a fixed process.
---

# Engineering workflow

Understand the requested outcome, work within the existing system, and use evidence to deliver a
change the user can trust. Adapt these practices to the task; they are choices, not mandatory phases.
Follow the user's instructions, project conventions, and applicable constraints. Incorporate feedback
as work progresses.

## Choose the work

- Identify the behavior or decision that matters, the relevant constraints, and how success can be
  observed. Inspect the owning code and existing changes before editing; preserve other people's work.
- For a consequential ambiguity, ask a focused question early while continuing independent work.
  Resolve routine choices yourself. Do not introduce a plan-approval gate or require confirmation of
  test boundaries. Follow the user's existing authorization and any applicable action constraints.
- Match effort to risk and uncertainty. A small, clear change may need only a focused edit and check;
  an unfamiliar or high-impact change may need deeper investigation or comparison of alternatives.

## Investigate and design

- For a bug or regression, seek a useful signal: a reproduction, measured baseline, failing check,
  trace, or targeted observation. Narrow the cause with evidence and test competing explanations when
  needed. If a reproduction is unavailable, inspect what you can and state what remains unverified.
- Prefer a cohesive interface that hides real complexity from callers. Check behavior, errors, and
  invariants at the relevant boundary. Use existing project terminology and abstractions; add a seam
  or abstraction only when the current problem needs it.
- Use a small, clearly identified prototype when it can resolve a consequential uncertainty. Choose a
  form the user can inspect when their judgment matters. Treat prototype results as evidence with
  limits; production changes still need appropriate error handling and verification.

## Implement and verify

- Make the smallest coherent change that achieves the outcome. Preserve behavior and scope outside
  the task. Handle errors explicitly and avoid speculative features, mock data, and unnecessary options.
- Select the narrowest meaningful check, then broaden it when risk, failures, or project requirements
  justify it. When a test is useful, check observable behavior against an independent expectation,
  including relevant failure cases. Use test-first work when it helps; do not add tests merely to mirror
  implementation or for reversible, low-impact changes.
- Before completion, review the actual change for the requested behavior, correctness, project
  conventions, error handling, security where relevant, and unintended effects. Run required checks.
  Distinguish passing checks from verified user behavior; report any check that could not run and why.

## Explain and adapt

Describe the outcome, why it matters, how it was checked, and material limits in terms the user can
follow. Use a compact diagram, worked example, or interactive visual when it makes a complex result
easier to understand and the client supports it. Keep proposed, implemented, and deployed states clear.
Use more specialized workflows when useful and compatible with the user's instructions; do not turn
their optional practices into mandatory gates. Suggest a lasting skill improvement when repeated user
feedback reveals one, while applying the feedback immediately to the current task.
