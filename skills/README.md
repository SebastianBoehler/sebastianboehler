# Agent skills

Reusable research and engineering workflows maintained from actual use. Each skill follows the
portable `SKILL.md` format. The repository is the canonical source; global installations can link here.

| Skill | Purpose |
|---|---|
| [scientific-discovery](scientific-discovery/SKILL.md) | Map meaningful alternatives, challenge inherited constraints, run controlled experiments and refresh research context without erasing evidence. |

The scientific-discovery skill includes model/provider routing, an evidence-based evolution process
and behavioral evaluation cases. It does not require multiple providers or authorize new API spending.
Its current evidence and validation limits are recorded [with the skill](scientific-discovery/references/evidence.md).

## Local installation

From this repository, link the skill into a supported client's global skill directory. Do not overwrite
an existing installation without checking it first. For example, if the target does not exist:

```sh
mkdir -p ~/.codex/skills
ln -s "$PWD/skills/scientific-discovery" ~/.codex/skills/scientific-discovery
```

The same folder can be linked into `~/.claude/skills/` or a client's supported shared skills directory.
Use `$scientific-discovery` explicitly; automatic discovery depends on the client. Already-running
sessions may need a refresh to discover a newly installed skill; an agent can read its file directly.

Keep task data and private working notes in their project. Maintain this catalog and improve the
reusable procedure through focused Git revisions, supported examples and behavioral checks.
