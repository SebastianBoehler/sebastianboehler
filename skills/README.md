# Agent skills

Reusable research and engineering workflows maintained from actual use. Each skill follows the
portable `SKILL.md` format. The repository is the canonical source; global installations can link here.
Apply user feedback and explicit preferences as the task progresses, within the task's constraints.
Treat a context-specific choice as specific to that context unless the user makes it a lasting preference.
Suggest durable skill updates when feedback reveals a recurring improvement.

| Skill | Purpose |
|---|---|
| [intent-clarification](intent-clarification/SKILL.md) | Ask decision-relevant questions early and clarify success without blocking independent work. |
| [engineering-workflow](engineering-workflow/SKILL.md) | Adapt investigation, design, implementation, and verification to the engineering task. |
| [scientific-discovery](scientific-discovery/SKILL.md) | Map meaningful alternatives, challenge inherited constraints, run controlled experiments and refresh research context without erasing evidence. |
| [citation-verification](citation-verification/SKILL.md) | Check research claims against their cited sources and maintain a traceable bibliography. |
| [human-writing](human-writing/SKILL.md) | Draft and edit natural prose while respecting the author's voice, evidence, and genre. |
| [shared-work-coordination](shared-work-coordination/SKILL.md) | Coordinate contributors, handoffs and scratchpads across sessions and machines. |
| [hackathon-spec-driver](hackathon-spec-driver/SKILL.md) | Research event requirements and drive a focused, verifiable hackathon demo. |

The scientific-discovery skill includes model/provider routing, a proportional reproducibility record,
and behavioral evaluation cases. It does not require multiple providers or authorize new API spending.
Its sources, including research on narrow exploration and fresh contexts, and validation limits are
recorded [with the skill](scientific-discovery/references/evidence.md).

## Local installation

From this repository, link each desired skill into a supported client's global skill directory. Do not
overwrite an existing installation without checking it first. For example, if the target does not exist:

```sh
mkdir -p ~/.codex/skills
ln -s "$PWD/skills/scientific-discovery" ~/.codex/skills/scientific-discovery
```

The same folder can be linked into `~/.claude/skills/` or a client's supported shared skills directory.
Invoke a skill by name when needed; automatic discovery depends on the client. Already-running sessions
may need a refresh to discover a newly installed skill; an agent can read its file directly.

Keep task data and private working notes in their project. Maintain this catalog and improve the
reusable procedure through focused Git revisions, supported examples and behavioral checks.
