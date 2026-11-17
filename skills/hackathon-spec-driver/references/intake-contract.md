# Intake and Product/Demo Contract

Use this reference when starting or rescuing a hackathon build.

## High-information intent interview

Select the questions that matter and are not already answered by the repository or event rules:

1. What exactly should the room see happen during the demo?
2. Who performs the decisive action: presenter, volunteer, or whole audience?
3. What single sentence should voters remember afterward?
4. What user problem, desire, or emotion does the project serve?
5. What is genuinely new compared with the obvious existing solution?
6. Why does this require the target platform rather than merely run on it?
7. What exact state changes onchain or in the authoritative system?
8. What is the smallest complete happy path, and what would you improve first if it were demo-ready an hour early?
9. What is the lowest-level primitive the product must expose or preserve?
10. Which variability must be data-driven, modular, or open rather than encoded as fixed cases?
11. What tempting capabilities must explicitly remain out of scope?
12. What visual style and current behavior must remain unchanged?
13. Which failures invalidate the demo, and which one to three invariants deserve test-first implementation?
14. What exact deadline artifact and public evidence will judges see, and how will we test comprehension rather than self-score it?
15. What is the fallback when network, wallet, model, or deployment fails?

Ask concrete alternatives when they help the user express intent, but do not force a choice before inspecting available evidence.

## One-page contract template

```markdown
# Product/Demo Contract

Deadline:
Internal feature freeze:
Demo rehearsal window:

## AI-native delivery budget
Committed core:
Expected short work cycles:
External or uncertain dependencies:
Feasibility probes:
Ranked expansion options:
Extension admission gate:
Buffer purpose:

## Audience memory
After the demo, a voter should say: “...”

## Magic moment
Actor:
Action:
Visible result:
Authoritative/onchain proof:
Why this platform matters:

## Abstraction contract
Lowest stable primitive:
Open-world input/generation:
Closed-world verification/execution:
Temporarily enumerated facts:
Second-case extension check:

## Canonical journey
Given:
When:
Then:
Must not result in:

## Scope
Must build:
-

Must not build:
-

Must remain unchanged:
-

## Acceptance evidence
Essential invariant tests:
-

Critical seam check:
-

Deployed demo check:
-

Fallback:
-

## Judgeability
Exact evaluated commit/deployment/submission snapshot:
One-sentence comprehension test:
Name/novelty recall test:
Historical/current comparison set:
Unknown roster, weights, or private evidence:
Predicted competitive tier or range:
Post-result calibration note:

## Completion ledger
| Capability | State | Evidence |
|---|---|---|
| Core loop | Specified | This contract |
| Deployment | Specified | Target URL/network |
| Demo | Specified | Timed script/fallback |

## Open assumptions
-
```

## Delegated-task template

```markdown
Outcome:
Allowed files/subsystem:
Acceptance check:
Explicit exclusions:
Stop condition:
Adjacent discoveries: report them; fix only when they block the acceptance check.
Return evidence: changed files, exact verification, and current completion state.
```
