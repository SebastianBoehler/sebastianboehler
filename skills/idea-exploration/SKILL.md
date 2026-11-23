---
name: idea-exploration
description: Use for brainstorming, ideation, or choosing among approaches when the answer is open — product or feature ideas, research directions, designs, strategies, or names — to map distinct idea basins before converging.
metadata:
  version: "0.1.0"
---

# Explore ideas

Map the space of meaningfully different options, then converge on the ones worth testing. An idea
basin is a family of options that share a mechanism or core assumption; renamed variants and
re-sampled wording stay in the same basin. Use [intent clarification](../intent-clarification/SKILL.md)
when the goal itself is unclear, and [scientific discovery](../scientific-discovery/SKILL.md) once
options become experiments.

## Ground the problem

Read the request, the project, and what the user has already tried before proposing anything. State
the goal, the binding constraints, and what success would look like; label assumptions you inherited
from the request or an incumbent solution. Ground ideas in this user's context, data, and taste;
generic prompts drift toward the most common answers. Ask one question when its answer would change
which basins matter; otherwise proceed and state your defaults.

## Diverge by basin

1. **Name the basins first.** List four to six mutually distinct directions, each defined by the
   mechanism or assumption it changes, before developing any idea.
2. **Generate within each basin** with earlier ideas visible and an explicit instruction to differ
   from them. Do not rely on higher temperature, more samples, or another model for breadth.
3. **Push past the obvious** with operators that leave the incumbent's basin: derive from a relaxed
   or inverted constraint, borrow a mechanism from a field with the same structure, ban the core
   technique of the current best option, or argue the null or opposite hypothesis. After each forced
   constraint, check that the idea is still feasible.
4. **Use perspectives with care.** A stakeholder or persona can cue different knowledge, but pair it
   with step-wise drafting and distinctness checks; a persona alone can fix on one basin.
5. **Delegate breadth independently.** Parallel workers get the same problem-first brief and generate
   before seeing each other's output. Merge afterwards; more workers add diminishing distinct ideas.

For research directions, run a [landscape scan](../scientific-discovery/references/landscape-scan.md)
so that basins come from citation trails and adjacent fields, not only the nearest papers.

## Count and check

Deduplicate by mechanism. Report the number of distinct basins, which ones remain thin, and stop
generating when a new batch adds no basin. Do not present your own sense of novelty as evidence:
check novelty claims against retrieved literature or existing products, and mark unchecked ones.

## Converge

Keep the strongest option in each basin rather than a single global winner. Compare finalists
pairwise on the user's criteria, stating trade-offs, risks, and what each assumes. Recommend one or
two and say why. Show the user the full basin map so they can redirect; their judgement can favour
the familiar, so name any strong unfamiliar option explicitly. Before committing, propose the
cheapest check, spike, or prototype that could change the choice.

Return: basins with their defining assumption, the best option in each, gaps, the recommendation,
and the next decisive check. Label proposals as proposals; an idea is not a tested result.

## Sources for these practices

See the [evidence notes](references/evidence.md) for findings, scope, and limits. Basin-first
generation draws on [Ibrahim et al., Anchorless Diversification](https://arxiv.org/abs/2605.30150v1)
and [Meincke et al.](https://arxiv.org/abs/2402.01727); homogenization limits on
[Jiang et al., Artificial Hivemind](https://arxiv.org/abs/2510.22954) and
[Zhang et al., NoveltyBench](https://arxiv.org/abs/2504.05228); novelty-judging limits on
[Si et al.](https://arxiv.org/abs/2409.04109) and [Sinhahajari et al.](https://arxiv.org/abs/2606.12071).
