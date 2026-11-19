---
name: engineering-workflow
description: Use for software implementation, debugging, refactoring, profiling and performance optimization, reviews, and technical design.
---

# Engineering workflow

Use these practices where they help, without a fixed sequence or extra approval gates. Follow project
conventions and existing authorization, preserve others' work, and adapt to the user's feedback.

- **Frame the outcome.** Inspect the owning code, current plan, and source of each material
  requirement. For each consequential deliverable, identify observable acceptance evidence from
  the real calling path. Use thresholds only when the goal needs one. Apply new user direction to
  the plan and checks. Raise consequential trade-offs and continue independent work.
- **Investigate uncertainty.** For a bug or regression, seek a reproduction, trace, failing check, or
  measured baseline. Test explanations against evidence. If reproduction is unavailable, investigate
  what you can and state the verification limit. Use a small, clearly marked prototype when it can
  resolve an important design question.
- **Profile before optimizing.** Use a representative workload and check that timing, synchronization,
  and correctness measure the intended path. Use the baseline trace to locate the limiting stage.
  State the expected signal and what would disprove the explanation. Test the change on matched
  work and quality, and report end-to-end impact alongside any component gain.
- **Design for the current problem.** Prefer cohesive interfaces that hide complexity. Account for
  invariants and errors; add abstractions only when needed. Make the smallest coherent change and
  handle failures explicitly, avoiding speculative features and unrelated cleanup.
- **Plan security and defensive behavior early.** Before choosing an approach, consider the real
  exposure: sensitive data and secrets, trust boundaries, untrusted inputs, permissions, external
  dependencies, and plausible failures or misuse. Select safeguards proportionate to the impact
  and current stage. Plan validation at boundaries, least privilege, safe defaults, and explicit
  failure handling where relevant; avoid leaking secrets or sensitive data in logs and errors.
  Put essential safeguards and their checks in the owning work, not a generic later hardening task.
  For a draft or MVP, keep the solution simple and record material risks deferred before wider use.
- **Verify the safeguards that matter.** Include targeted checks for relevant invalid input,
  unauthorized access, and failure paths alongside the normal path. Use existing language and
  framework security guidance when it applies. Do not imply a full security audit or protection
  against threats that were not assessed.
- **Test first when feasible.** For a bug or behavior change, use the narrowest meaningful check
  with expectations from the user or governing contract. Run it on the original code and observe
  the relevant failure before editing the implementation. Make the smallest coherent fix, rerun
  the check, and check nearby behavior. For a behavior-preserving refactor, capture a passing baseline.
  If a test-first check is impractical, record the reason and use the best available evidence.
- **Reconsider when evidence stalls or contradicts the approach.** Return to the current objective,
  governing constraints, and last verified state. Identify which assumption the approach relies on,
  including your own earlier assumptions. Look for the strongest relevant counterevidence. Correct
  any conclusion it overturns, then test a different cause, abstraction, or design when warranted.
- **Verify the result against the current plan.** Review each consequential requirement against
  actual output, test results, or another appropriate check. Record what ran and what remains
  unverified. Broaden checks for relevant risk or project requirements. Report code, verified
  behavior, and deployment as distinct states. Use a visual or worked example when it helps.

Use specialist workflows when needed and compatible with the user's instructions. Suggest a lasting
skill improvement when feedback reveals a recurring issue.

## Sources for these practices

Checks that fail before a fix and pass after it draw on [Haratian et al., ADAPT](https://arxiv.org/abs/2611.16114v1). Choosing measurements for the suspected bottleneck draws on [Wang et al., AutoProfiler](https://arxiv.org/abs/2610.36576v1).
