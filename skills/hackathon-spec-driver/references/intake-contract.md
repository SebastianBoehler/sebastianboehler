# Intake and demo contract

Use only the unanswered prompts that can change the product or demo:

- What should the audience see, who acts, and what should they remember?
- Which problem does this solve, what is new, and why does the target platform matter?
- What is the smallest complete journey and its authoritative state change?
- If extensibility matters, what primitive must remain open and how does a second case use it?
- What belongs in scope, what must stay unchanged, and what can wait?
- Which failures matter, what proves correctness, and what will judges actually inspect?
- What happens if a critical live dependency fails, and what can fit before the deadline?

Inspect the event and existing artifacts first. Ask consequential questions early while continuing
independent work; skip settled questions. Use concrete alternatives when helpful.

Adapt this compact record in the existing planning location; omit irrelevant fields:

```text
Audience value and memorable result:
Actor → action → visible outcome:
Platform mechanism / authoritative proof:
Canonical input and expected result:
Core scope / exclusions / behavior to preserve:
Stable primitive and extension check, if central:
Acceptance evidence and essential invariants:
Deadline / dependencies / feature freeze / rehearsal buffer:
Optional improvements, if the core is ready early:
Live-dependency contingency, if needed:
Open assumptions:
Capability → current state → evidence:
```

Use completion states accurately: **specified** means behavior is defined; **implemented** means code
exists; **verified** means named checks passed; **deployed** means the target runs that revision;
**demo-ready** means the intended presentation path was rehearsed and contingencies addressed.
Revise the record when the user changes direction; it is a working agreement, not an approval ceremony.
