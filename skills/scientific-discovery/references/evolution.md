# Evolve the skill from evidence

The owner explicitly wants a living skill. Improve it from demonstrated use rather than accumulating
generic advice. Apply the current task's authorization and repository publication policy.

## When to revise

When skill maintenance is requested or otherwise authorized, consider an explicit user correction,
reproducible workflow failure, independent forward-test failure, or an observation that transfers
beyond one project's numeric settings. Ordinary research does not automatically edit this skill.
A single surprising score is evidence about an experiment, not automatically about this skill.

1. Record the observation in `references/evidence.md`: date, source, expected/observed behavior,
   alternative explanation, proposed narrow change and its scope. Use links to public evidence or a
   deidentified description; never copy private chat, data, credentials or local personal paths.
2. Classify it as user preference, proposed lesson, supported procedure, or counterexample.
   A preference can direct workflow without being represented as an empirical theorem.
3. Change the smallest relevant instruction. Prefer adjusting or removing a narrowing rule to adding
   another blanket prohibition. Keep project-specific rules in that project.
4. Add or revise a realistic behavioral case in `evals/scenarios.md`. Test the decision it changes,
   not a required phrase or heading. Retain cases that could reveal regressions.
5. Validate frontmatter, links, portability and unfinished scaffold text. For a material change, run
   an independent forward-test with a fresh context when available and authorized. Give the skill,
   user request and raw facts, but not the intended answer or the rubric's conclusions.
6. Inspect the resulting decisions/artifacts, including what the agent actually read or did.
   Record skipped checks and failures. Run a control without the skill when practical; one pass
   without a control does not prove causal improvement or cross-model reliability.
7. Keep a reversible diff and the evaluation record. Commit or publish only when authorized by the
   user or applicable project workflow. Mention meaningful changes.

The skill itself must not grant permission to change user goals, erase evidence, expose private work,
spend on providers or publish artifacts. Do not add a new approval gate for already authorized edits.

## What to promote into core guidance

Promote observations with a clear transferable mechanism, repeated evidence or an explicit owner
preference. Include boundaries and a counterexample. Keep uncertain observations as hypotheses.
For example, “another worker repeated the initial restriction” supports checking brief content and
actual method changes; it does not establish that a fresh context must always ignore all history.

Read the main skill for duplication after each revision. Update its metadata version for a material
behavior change and identify the tested revision. Keep it short; move occasional detail to a
reference. Remove stale guidance when evidence contradicts it, retaining the change in Git history.
Do not promise automatic learning: updates require actual observations, edits and validation.

## Practical evidence entry

```text
Date / revision:
Origin and evidence status:
Observed failure or benefit:
Alternative explanation / limits:
Narrow proposed change:
Behavioral case and observed result:
Retain, revise or revert:
```

The evaluation set is a starting point, not proof of scientific creativity. Add genuinely different
domains over time; avoid optimizing the wording of the skill to a fixed handful of examples.
