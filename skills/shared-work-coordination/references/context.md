# Context and handoffs

Provide the smallest factual packet that lets the recipient complete and verify its task. Separate
instructions from source material and label the source, version, access limits and trust level. Preserve
required project and user instructions. A recipient should know what is current and where to look next.

Suggested fields: objective; relevant facts and source pointers; hard constraints and permissions;
owned scope; success check; expected artifact; stop conditions; and unresolved questions. For an
independent proposal, exclude prior conclusions only where permissible, and state what the recipient
can still access. Preserve canonical evidence, active jobs, and known correctness issues.

There is no universal optimal prompt order. Check current provider and model guidance when the order
could matter, and evaluate changes against representative tasks. OpenAI recommends separating
instructions, examples and context, while Anthropic gives specific placement guidance for long inputs.
Delimiters clarify boundaries; they do not override instruction priority or make untrusted text safe.

- [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Anthropic prompting best practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables)
