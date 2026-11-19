---
name: hackathon-spec-driver
description: Use for hackathon ideation, builds, rescue, or demo preparation under a fixed event deadline. Focus scope and verification on a complete, credible demo.
---

# Deliver a hackathon demo

Optimize for a memorable, working demonstration within the event's rules and deadline. Adapt to the
remaining time and existing work; avoid turning a small build into a planning exercise.

## Clarify the demo

Check official rules, eligibility, deadlines/time zones, judging criteria, and submission requirements.
Record sources and unresolved conflicts; recheck mutable requirements before submission. Ask early
about consequential gaps in the audience, action, visible outcome, and scope while inspecting the
repository and runtime. Reuse answered questions and proceed within existing authorization.

Keep a short product/demo contract in the existing planning location: audience value, canonical
journey, platform-specific proof where required, scope, acceptance evidence, deadline, and rehearsal
buffer. Update it with the user's direction. Use [intake prompts](references/intake-contract.md) only
when discovery or a compact contract would help.

## Build and protect the core

- Build the shortest real path from user action to visible result and keep it runnable. Separate the
  committed core from optional improvements; prioritize work that strengthens the demo.
- Consider exposure and likely misuse while scoping the demo. Include essential safeguards for
  secrets, user data, access, untrusted input, and failure handling where relevant. Keep safeguards
  proportional to the demo and verify the important ones; record material risks before wider use.
- Preserve extensibility when it is a product claim: identify the stable primitive and show a second
  case without rewriting it. Otherwise avoid building a general framework.
- Estimate short edit/check cycles from dependencies and uncertainty. Allow for integration,
  deployment, and proof time, not just generation speed. Probe risky dependencies early and simplify
  work that repeatedly fails to converge. See [delivery notes](references/delivery.md) when useful.
- Verify essential invariants, critical integration, and the actual demo path. Choose checks for the
  risk; use test-first work for consequential correctness. Avoid coverage targets or fixed test counts.
- If delegating, bound ownership, scope, acceptance evidence, and stop conditions. Verify returned
  artifacts; keep adjacent discoveries from expanding the task without a reason.

Reserve time suited to the event for deployment, required submission materials, backup evidence when
needed, and timed rehearsal. Near the deadline, prioritize demo blockers, compliance, and correctness.
Keep implemented, verified, deployed, and rehearsed work distinct. Demo readiness means the intended
path works in the target environment, fits the allotted presentation time, and matches the submission.

When judging competitiveness, assess what judges can inspect from the exact submission snapshot.
Use official criteria, disclose missing comparisons, and distinguish engineering quality from audience
comprehension. Follow [judging notes](references/judging.md) for a substantial assessment; avoid precise
placement claims unsupported by evidence.
