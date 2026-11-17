# Agent skills

Reusable research and engineering workflows maintained from actual use. Each skill follows the
portable `SKILL.md` format. The repository is the canonical source; global installations can link here.

| Skill | Purpose |
|---|---|
| [intent-clarification](intent-clarification/SKILL.md) | Ask decision-relevant questions early and clarify success without blocking independent work. |
| [scientific-discovery](scientific-discovery/SKILL.md) | Map meaningful alternatives, challenge inherited constraints, run controlled experiments and refresh research context without erasing evidence. |
| [citation-verification](citation-verification/SKILL.md) | Check research claims against their cited sources and maintain a traceable bibliography. |
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
