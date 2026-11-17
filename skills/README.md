# Agent skills

Reusable research and engineering workflows in the portable `SKILL.md` format. Load the skills
and references that fit the task. The user and agent work out the scope together. The agent derives
requirements from authoritative sources, proposes success checks, and asks early about decisions
that would change the outcome. It owns execution and verification within the agreed scope.

| Skill | Purpose |
|---|---|
| [intent-clarification](intent-clarification/SKILL.md) | Derive requirements, ask decision-relevant questions early, and keep the current scope clear. |
| [engineering-workflow](engineering-workflow/SKILL.md) | Diagnose from evidence, test changed behavior, and verify the result against the current plan. |
| [scientific-discovery](scientific-discovery/SKILL.md) | Map meaningful alternatives, challenge inherited constraints, and run controlled experiments. |
| [citation-verification](citation-verification/SKILL.md) | Check research claims against their cited sources and maintain a traceable bibliography. |
| [human-writing](human-writing/SKILL.md) | Draft and edit natural prose while respecting the author's voice, evidence, and genre. |
| [shared-work-coordination](shared-work-coordination/SKILL.md) | Coordinate contributors, handoffs and scratchpads across sessions and machines. |
| [hackathon-spec-driver](hackathon-spec-driver/SKILL.md) | Research event requirements and drive a focused, verifiable hackathon demo. |

## How the skills work together

For ambiguous engineering or research work, start with intent clarification. Carry the current goal,
constraints, and checks into engineering or scientific discovery. Use test-first checks for behavior
changes and baseline traces for optimization. When evidence stalls or contradicts the approach,
return to the governing rules and verified data. Test an alternative that changes the assumption
behind the current approach. Check favored explanations against the evidence, including the agent's
earlier conclusions. Bring decisions about the goal or constraints back to the user.

Apply shared work coordination when contributors need ownership and a common record. The integration
owner checks their combined result. Use citation verification and human writing for claims and prose.
For a hackathon, apply the same agreement to a complete demo that judges can inspect.

See the [research behind the suite](research.md), [evaluation scenarios](evals/scenarios.md),
and [release validation](evals/results.md).

## Local installation

Use the [tagged release](https://github.com/SebastianBoehler/sebastianboehler/releases/tag/skills-v1.0.1)
to install a fixed revision. Extract the skills archive into a directory you plan to keep. From the
extracted directory or a repository checkout, link each desired skill into a supported client's global
skill directory. Check any existing installation before replacing it.

```sh
mkdir -p ~/.agents/skills
ln -s "$PWD/skills/scientific-discovery" ~/.agents/skills/scientific-discovery
```

The example uses the [Codex user skills directory](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills).
For another client, use its supported skills directory. Invoke a skill by name when needed. If a
running session misses a new installation, restart the client.

Keep task data and private working notes in their project. Use focused revisions and behavioral
checks when changing a reusable workflow.
