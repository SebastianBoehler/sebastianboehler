---
name: engineering-workflow
description: Use for software implementation, debugging, refactoring, reviews, and technical design. Scale the approach and verification to the task.
---

# Engineering workflow

Use these practices where they help, without a fixed sequence or extra approval gates. Follow project
conventions and existing authorization, preserve others' work, and adapt to the user's feedback.

- **Frame the outcome.** Inspect the owning code, constraints, and existing changes. Identify the
  behavior or decision that matters and a useful success check. Resolve routine choices yourself;
  ask early about consequential ambiguity while continuing independent work.
- **Investigate uncertainty.** For a bug or regression, seek a reproduction, trace, failing check, or
  measured baseline. Test explanations against evidence. If reproduction is unavailable, investigate
  what you can and state the verification limit. Use a small, clearly marked prototype when it can
  resolve an important design question.
- **Design for the current problem.** Prefer cohesive interfaces that hide complexity. Account for
  invariants and errors; add abstractions only when needed. Make the smallest coherent change and
  handle failures explicitly, avoiding speculative features and unrelated cleanup.
- **Verify meaningful behavior.** Choose the narrowest useful check and broaden it for risk, failures,
  or project requirements. Tests should use independent expectations and relevant failure cases.
  Use test-first work when useful; skip tests that mirror implementation or add little value to a
  reversible, low-impact change.
- **Review and explain.** Check intent, correctness, conventions, errors, relevant security, and
  unintended effects. Run required checks; report skipped checks and why. Explain the outcome and
  material limits, distinguishing local checks, user behavior, and deployment. Use a visual or worked
  example when it improves understanding and the client supports it.

Use specialist workflows when needed and compatible with the user's instructions. Suggest a lasting
skill improvement when feedback reveals a recurring issue.
