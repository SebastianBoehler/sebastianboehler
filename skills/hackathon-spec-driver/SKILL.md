---
name: hackathon-spec-driver
description: Drive time-bounded hackathon builds from a user-confirmed product and demo contract, with an early high-information intent interview, AI-native delivery estimates, bounded agent scope, lean acceptance tests, explicit completion states, and protected demo time. Use for hackathon ideation, implementation, rescue, or demo preparation; do not apply to ordinary mature-product development without a hard event deadline.
---

# Hackathon Spec Driver

Optimize for one complete, memorable, provable demo under a fixed deadline.

The governing artifact is a short **product/demo contract**, not a growing backlog or architecture plan. Preserve technical integrity, but do not turn the hackathon into production-platform construction.

## Research the event

Check current official rules, eligibility, deadlines and time zones, challenge statements, prize
conditions, judging criteria and weights, submission requirements, and what judges can inspect.
Use official organizer and platform sources first. Record source links, access date, unresolved
conflicts, and unknowns; revisit mutable rules before submission.

When useful, inspect organizers' and sponsors' published objectives and named judges' public roles,
relevant experience, and public statements. Separate verified facts from hypotheses about how these
may affect a demo or questions a judge might ask. A biography does not establish a person's private
preferences or scoring behavior. Official criteria take precedence over inferred preferences.
If a roster, weights, or source is unavailable, say so; do not invent coverage or spend the build
budget chasing low-value profiles. Turn relevant findings into concrete demo and submission checks.

## Start with discovery and an intent interview

Immediately after a build request, before implementation:

1. Inspect the event rules, repository, current runtime, and deadline read-only.
2. Ask the unanswered, high-information questions needed to clarify outcome, audience moment, product behavior, visual intent, boundaries, proof, and fallback. Adapt the number to the task.
3. Ask them early in a scannable batch. Continue safe discovery while the user answers; do not insert a separate plan-approval pause.
4. Do not ask what the repository, official rules, or existing artifacts can answer.

The agent cannot literally ask before receiving the user's prompt. Interpret “ask before I prompt/build” as **ask immediately after the request and before coding**.

Use [references/intake-contract.md](references/intake-contract.md) for the question bank and contract template.

## Freeze one product/demo contract

Convert the answers into a one-page contract containing:

- one-sentence audience memory;
- one live “magic moment”;
- exact actor, action, and visible result;
- why the target platform materially enables it;
- smallest complete happy path;
- lowest stable primitive and intended extension mechanism;
- open-world versus closed-world boundary;
- canonical input/output examples;
- must-build, must-not-build, and must-remain-unchanged lists;
- essential invariants;
- completion evidence and fallback;
- deadline, internal feature freeze, and demo rehearsal window.

State material assumptions. Ask a follow-up only when guessing would change the product. Otherwise proceed against the contract without another approval ceremony.

Update the contract when the user changes direction. Do not silently keep implementing the old interpretation.

Persist it in the repository's existing planning location when appropriate. If none exists, use a small `docs/hackathon/product-demo-contract.md`; do not introduce a planning hierarchy.

## Lock the abstraction contract

Before choosing schemas, enums, templates, modules, or APIs, determine whether extensibility is:

- a central product claim;
- a necessary implementation property; or
- only a future preference.

If it is central, write down:

- the lowest stable primitive;
- what generation or input may express;
- what verification or execution must restrict;
- which facts may be enumerated temporarily;
- how a second example extends the system without changing the core primitive.

Implement the smallest generic kernel plus one demonstrator. Do not replace an intended open kernel with several hardcoded product cases merely because each case is easier to test. Conversely, do not build a universal framework when extensibility is not part of the audience-visible value.

Use one extension acceptance check: add or describe a materially different case through configuration, data, or a bounded module. If it requires rewriting the core contract, the claimed abstraction is not implemented.

## Estimate AI-native delivery, not developer-days

Do not translate a conventional engineer-day estimate into the hackathon plan. Code generation can collapse implementation time, so estimate the critical path in short **AI work cycles**:

> specify one bounded result → generate or edit → run the exact check → inspect the real result → correct or stop

Separate three clocks:

1. **Generation time** — producing code, copy, tests, or assets;
2. **Convergence time** — correcting misunderstood intent and integrating the pieces;
3. **Proof time** — running, deploying, rehearsing, and validating external state.

Generation is often cheap. Do not assume convergence or proof is. Size work by dependencies, uncertainty, and feedback loops rather than lines of code or historical manual effort:

- **Green:** self-contained, known stack, existing pattern, reversible, and no external state. Expect one short cycle.
- **Amber:** multi-file integration, unfamiliar API, auth, schema, runtime, or UX uncertainty. Budget multiple cycles and test the seam early.
- **Red:** new provider, chain deployment, wallet flow, hardware, or other live external dependency. Run a timeboxed feasibility probe before admitting it to the committed core.

Use AI speed ambitiously: the committed core may be larger than a traditional same-day estimate when its pieces are known and independently verifiable. But never count generated code as delivered product.

Maintain two scope lanes:

- **Committed core:** the strongest complete, memorable vertical slice that must become demo-ready before the buffer.
- **Ranked expansion options:** independent refinements or same-kernel extensions, each reversible and small enough for one bounded cycle.

If a task cannot produce inspectable evidence within a short cycle, split it. After one or two failed convergence cycles, simplify or cut it unless it is indispensable to the magic moment.

At the internal freeze, choose in order: repair and prepare the core, refine its comprehension and presentation, then admit at most one expansion option. Preserve the final 60–90 minutes as an option to improve a working product, not as time required to obtain the first complete demo.

## Build the vertical slice first

Implement the shortest real path from audience action to visible result. Keep it runnable throughout the day.

Prefer, in order:

1. real core state transition;
2. visible product consequence;
3. target-platform proof;
4. stable deployment;
5. presentation packaging;
6. optional breadth.

Reject a new capability when it adds another identity model, provider, deployment, explanation, or failure domain without strengthening the agreed demo moment.

Do not confuse a new case supported by the agreed generic primitive with feature breadth. It may be valuable proof of the architecture. Keep it only when it exercises the same kernel and can be demonstrated without creating a second product path.

## Use a lean proof budget

TDD protects product meaning, not every temporary implementation detail.

Default proof budget:

- focused unit tests for one to three essential domain invariants;
- one integration or contract test for the critical seam;
- one browser smoke or scripted end-to-end happy path;
- repeated manual rehearsal of the exact demo.

Add more only when risk or a demonstrated regression justifies it. Usually skip snapshot tests, prose/copy tests, styling assertions, trivial component tests, and exhaustive edge matrices during the hackathon.

Write a failing test first when the failure could produce an unsafe, false, or semantically wrong result. For low-risk presentation changes, implement and verify the visible path directly.

Stop testing when the agreed acceptance evidence is sufficient. Do not spend the demo window increasing coverage.

## Bound agents and adjacent discoveries

Every delegated task must specify:

- one outcome;
- allowed subsystem or files;
- exact acceptance check;
- explicit exclusions;
- stop condition;
- required evidence in the return message.

An agent may fix an adjacent defect only if it blocks the assigned acceptance check. Otherwise it reports the defect and continues or stops. The integration owner alone admits new scope.

Do not delegate two tasks that can redefine the same contract, interface, schema, or core component concurrently.

For each agent result, verify the named acceptance check before integrating. “Tests pass” is not evidence that the requested user experience exists.

## Keep an explicit completion ledger

Report each important capability using exactly one current state:

1. **Specified** — behavior and acceptance evidence agreed.
2. **Implemented** — code exists in the working tree.
3. **Verified** — named local checks passed.
4. **Deployed** — intended environment runs the verified revision.
5. **Demo-ready** — exact public path was rehearsed and fallback captured.

Never call a plan implemented, a compiler result executable, a passing local test deployed, or a live deployment demo-ready without its corresponding evidence.

Maintain a compact ledger in the product/demo contract. Update it after scope changes and before every status claim.

## Protect the deadline

Set an internal feature freeze before the official freeze. For a one-day event, reserve at least the final 60–90 minutes for:

- stable deployment;
- submission fields and public repository;
- README and proof links;
- backup screenshots/video;
- repeated timed rehearsal.

After the internal freeze, admit only:

- blockers on the exact demo path;
- required event-compliance fixes;
- corrections to false or unsafe behavior.

Backlog all other improvements.

## Evaluate every interruption

When a bug, test idea, refactor, or feature appears, ask:

> Does this directly protect or strengthen the agreed live proof?

- Blocking and yes: fix now.
- Relevant but not blocking: record; integration owner decides.
- No: backlog and return to the contract.

## Finish against the audience, not the codebase

Completion requires all of:

- the canonical example works in the deployed environment;
- the audience can understand the idea quickly;
- the platform-specific mechanism is visible;
- the three-minute path is rehearsed;
- failure fallback is ready;
- submission artifacts match the live implementation;
- status claims use the completion ledger honestly.

The final retrospective should distinguish product, engineering, process, and presentation learnings. Record only demonstrated failures and successful countermeasures; do not manufacture generic lessons.

## Calibrate judging without inventing certainty

Use judging analysis to choose direction and expose gaps, not to reassure the builder with a precise rank.

Before evaluating competitiveness:

1. Freeze the exact deadline artifact: commit, deployment, submission fields, video, and public evidence.
2. Evaluate only what a judge or voter can actually observe from that artifact.
3. Separate eligibility, rubric fit, demo/vote conversion, and evidence credibility.
4. Compare against official historical winners and the broadest discoverable current field; do not privilege projects merely because they have public repositories.
5. State missing roster coverage, private submissions, unknown weights, organizer discretion, and mutable public surfaces.

Return:

- strongest and weakest judging dimensions;
- one highest-leverage product improvement;
- one highest-leverage demo improvement;
- competitive tier and failure scenarios;
- a wide probability range only when the user asks for one.

Do not present “Codex score” as a calibrated placement forecast. A project can lead on inspectable engineering and still lose on immediacy, adoption, delight, narrative, or private evidence.

For peer voting, explicitly test whether an uninformed participant can, after one short exposure:

- explain the product in one sentence;
- identify the novel/platform-native mechanic;
- recall its name after several other demos;
- describe the visible outcome; and
- feel a reason to vote for it.

Record predicted tier/range, evaluated snapshot, actual result, and post-result error cause so later forecasts become calibrated rather than repeatedly self-confirming.
