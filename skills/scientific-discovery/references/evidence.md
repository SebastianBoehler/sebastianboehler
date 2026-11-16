# Evidence and learning notes

## 2026-11-16: initial sources

- [How models explore ideas, Bespoke Labs, 10 November 2026](https://bespokelabs.ai/blog/how-models-explore-ideas):
  observational analysis of AutoResearchExam trajectories. Functional method families reveal limited
  exploration despite many submissions; new-family steps correlate with larger early gains.
  This does not establish a universal gain multiplier or an EEG-specific intervention.
- [Fork-and-Flush, 5 October 2026](https://arxiv.org/abs/2610.07447): periodically starts parallel,
  fresh-chat continuations from the accumulated workspace, then retains the strongest trajectory.
  Its equal-budget results support testing this intervention, not assuming every reset improves a task.
- [Scaling Discovery Requires Forgetting, 14 October 2026](https://arxiv.org/abs/2610.20563):
  removes both agent sessions and candidate-history state, retaining the best candidate and score.
  Its four-task evaluation motivates limiting narrative inheritance. Our protocol preserves canonical
  audit evidence outside proposer briefs, rather than deleting project history.

These sources informed the workflow. The coverage audit, evolution protocol and model-routing choices
are practical design decisions, not claims that those exact procedures were validated in these papers.

## 2026-11-17: AIDE and research-process iteration

[AIDE](https://arxiv.org/abs/2502.13138),18February2025, provides an earlier code-tree formulation;
[AIDE²](https://arxiv.org/abs/2609.26457),22September2026, studies changes to the agent's procedure.
The former's methods and the latter's abstract were checked. Added candidate lineage, explicit
draft/debug/improve operations and evaluation of workflow changes, while retaining the separate
semantic-coverage audit. These are complementary to context resets, not proof that all branches
in a large code tree represent distinct ideas. No Weco service or paid provider was invoked.

## 2026-11-16: owner-reported failure and intended correction

**Origin:** explicit owner report from a past design competition; not an independent causal study.
The agent repeatedly reported broad exploration and resets, while retaining an early incumbent's
restriction. Those reports gave more confidence than the demonstrated coverage justified.

**Change:** require actual constraint provenance, the assumption changed, method/test artifacts and
remaining gaps before claiming breadth. Reset/proposal/implementation/evaluation are separate states.
Do not let an incumbent's representation or parameterization become an unexplained hard boundary.

**Limit:** a fresh context can still find the same strong method for good reasons. Method novelty is
not itself a success metric; compare valid alternatives with credible controls and budgets.

**Evaluation:** initial behavioral cases cover inherited restrictions, weak-system gains, novel methods
and provider availability. The [initial check](../evals/initial-check.md) records the observed planning behavior and its limits;
this is not validation of scientific outcomes or cross-provider reliability.
