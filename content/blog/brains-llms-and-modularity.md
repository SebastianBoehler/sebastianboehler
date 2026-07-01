---
title: "Why Brains and LLMs Both Become Modular"
description: "A careful walk from brain networks to dense LLM circuits, MoE models, and the deeper idea that modularity may be a solution to interference."
date: "2026-07-01"
tags: ["LLMs", "Neuroscience", "Mechanistic Interpretability", "MoE"]
---

The easy version of the brain and machine learning analogy is usually wrong.
A biological neuron is not a transformer neuron. A synapse is not just a scalar
weight. The brain does not run ordinary backpropagation through a PyTorch graph.

But there is a better comparison at a higher level:

What kind of structure does an intelligent system develop when it has to solve
many different kinds of problems?

That is why the recent preprint [Modular Cognitive Architecture Emerges in Large
Language Models](https://pengrui-han.github.io/LLM_Modularity_Page/assets/paper.pdf)
is interesting. It does not simply say "LLMs are like brains." The more careful
claim is that brains and dense LLMs, despite being optimized in radically
different ways, appear to develop a similar kind of functional separation.

Brains separate language, formal reasoning, social reasoning, and physical
reasoning into partially distinct networks. The paper asks whether LLMs do
something analogous internally.

The answer appears to be yes, with caveats.

## Step 1: what modularity means

Modularity means that different parts of a system specialize for different
kinds of work.

That sounds obvious until you ask what the alternative is. A system could use
the same distributed pool of units for everything. Every problem would be solved
by heavily overlapping resources. Some overlap is useful, but total overlap
creates a problem: computations start interfering with each other.

If the same internal machinery handles grammar, arithmetic, belief attribution,
and intuitive physics, then updates or activity patterns that help one domain
can damage another. A clean system needs both sharing and separation.

The human brain seems to do this. Language processing uses a language network.
Demanding formal tasks recruit the multiple-demand network. Thinking about
other minds uses theory-of-mind regions. Intuitive physical reasoning recruits
physical-reasoning regions.

These are not sealed boxes. Real brains are interactive. But the broad
organization is not random either. Some cognitive work is repeatedly routed
through partly separable systems.

## Step 2: why LLMs make this question sharper

Brains are biological systems. They are shaped by evolution, development,
embodiment, energy cost, cell biology, and a lifetime of interaction with the
world. If the brain is modular, that modularity could be there for many reasons.

Maybe modularity is useful for computation. Maybe it is mainly a side effect of
biological constraints. Maybe it is both.

LLMs give us a second kind of system to compare against. They are not evolved
animals. They are trained with gradient descent to predict tokens across huge
text corpora. They do not have a metabolic budget in the biological sense.
They do not have cortical tissue. They do not grow up inside a body.

So if dense LLMs still develop functional modularity, the explanation cannot be
only "biology made it that way."

That does not prove modularity is a universal law of intelligence. But it makes
the hypothesis more serious.

## Step 3: how the paper tests it

The paper studies 46 tasks across four cognitive domains:

- Language: agreement, anaphora, negative polarity items, hypernymy, and a wug-style morphology task.
- Formal reasoning: arithmetic, logic, code, sorting, sequence completion, and equations.
- Physical reasoning: Newtonian prediction, object properties, buoyancy, elasticity, solubility, speed, stability, and temperature.
- Social reasoning: beliefs, goals, emotions, social relations, interactions, appropriateness, and morality.

For each task, the authors build minimal pairs. A prompt and a slightly modified
version have different correct continuations. For example, a grammatical cue,
an arithmetic operand, a physical property, or a social situation changes, and
the right answer flips.

Then they use attribution patching to ask which MLP units matter for the model's
choice. In simple terms, a unit matters when two things are true:

- Its activation changes between the original and alternative input.
- Changing that activation would affect the model's preference for the correct continuation.

For each task, they keep the top 0.1% positively attributed units. Then they
ask: do tasks in the same cognitive domain reuse the same units more than tasks
from different domains?

They run this across six instruction-tuned open-weight LLMs from 24B to 123B
parameters: Mistral-Small-24B, Qwen2.5-32B, OLMo-2-32B, Llama-3.1-70B,
Qwen2.5-72B, and Mistral-Large-123B.

## Step 4: what they find

The core result is clean.

Tasks in the same domain share much more of their top-attributed units than
tasks from different domains. The paper reports 12.9% within-domain overlap
versus 3.0% cross-domain overlap. The task overlap structure also clusters into
the four neuroscience-inspired domains with an adjusted Rand index of 0.78.

The pattern is not just visible after averaging models together. The authors
report the same broad within-domain greater than cross-domain pattern in each
of the six large models.

The layer result is also interesting. The domain-relevant units are often in
similar mid-to-late parts of the model, but the units are largely different.
So the claim is not that language lives in one layer and physics lives in
another layer. It is more subtle: different domains can coexist in the same
depth range while using different subpopulations.

That is closer to functional specialization than to a simple layer-by-layer
pipeline.

## Step 5: why ablation matters

Overlap alone is not enough. Maybe the same units light up for superficial
reasons. Maybe the attribution method is finding a correlate, not a cause.

So the paper performs ablations. For every source-task and target-task pair,
the authors identify the source task's top units, then perturb those units while
the model performs the target task.

If the system is modular, ablating language-relevant units should hurt other
language tasks more than physical or social tasks. Ablating formal-reasoning
units should hurt formal tasks more than language tasks. And so on.

That is what they find. Within-domain ablations reduce accuracy by 25.9% on
average, while cross-domain ablations reduce it by only 2.5%. The causal effect
is about ten times larger within domain than across domains.

This is the strongest part of the paper. It moves the story from "these tasks
activate overlapping units" to "these units are selectively important for
behavior."

## Step 6: the controls make the result harder to dismiss

There are several obvious objections.

The first is that tasks in the same domain use similar words. Physical tasks
mention objects and materials. Social tasks mention people and feelings. Maybe
the result is just semantic similarity.

The paper addresses this with semantic controls: TF-IDF, GloVe, SBERT, and
Qwen input-token embeddings. These baselines do not recover the same four-domain
structure as well as the neuron-overlap matrix, and the same-domain effect
survives regression controls.

The second objection is that the pipeline might create modularity even in a
model that cannot solve the tasks. The authors run a control on GPT-2-small.
GPT-2 performs language tasks reasonably but fails the reasoning domains. The
modularity signal mostly collapses outside language. That suggests the result
depends on task competence, not just prompt format.

The third objection is threshold choice. The paper repeats overlap analyses
across top 0.05%, 0.1%, 1%, and 5% unit sets. The modularity effect weakens as
the selected set gets broader, which is what you would expect if the sharpest
domain-specific signal lives in the most important units, but it remains
significant across thresholds.

None of this makes the paper immune to criticism. It is still a preprint. The
tasks are proxies. The mapping from a task to a human brain network is sometimes
a well-motivated hypothesis rather than direct neural evidence for that exact
task. And "transformer MLP unit" is not the same thing as "biological neuron."

But the controls are real enough that the result should not be waved away as a
cute analogy.

## Step 7: where MoE fits

This is where mixture-of-experts models become interesting.

In a dense LLM, every token passes through the same broad parameter stack. The
paper finds implicit modularity inside that dense system: no one explicitly
told the model to allocate one internal population to language, another to
formal reasoning, another to physical reasoning, and another to social
reasoning.

MoE models are different. They build modularity into the architecture. A router
chooses which expert blocks process a token. Only a subset of parameters is
active for each token. This is usually sold as an efficiency and scaling trick:
increase total parameter count without activating everything on every forward
pass.

But MoE also raises a deeper question:

Are engineered experts just a compute optimization, or can they become
cognitive modules?

The answer is not automatic. An MoE expert may specialize by language, token
format, topic, syntax, data source, position in a sequence, routing artifact, or
load-balancing pressure. "Expert" does not mean "physics module" or "social
reasoning module."

That distinction matters.

The paper finds implicit cognitive modularity: dense models appear to separate
some cognitive domains internally. MoE provides explicit architectural
modularity: the model is forced to route computation through different expert
pools. Those are related ideas, but they are not the same thing.

The interesting future question is whether they can be made to line up.

Could an MoE model learn experts that correspond more cleanly to language,
formal reasoning, physical reasoning, and social reasoning? Would that improve
interpretability? Would it reduce interference during training? Would it make
models easier to steer or patch? Or would forcing clean expert boundaries make
the model worse because real reasoning often needs multiple systems at once?

That is the useful comparison:

- Dense LLM modularity is discovered after training.
- MoE modularity is imposed by architecture.
- Brain modularity is shaped by biology, development, and task pressure.
- The shared pressure may be interference management.

## Step 8: why modularity might emerge at all

Suppose a system has to solve many problems with one set of parameters. Some
problems require grammar. Some require arithmetic. Some require social
inference. Some require physical prediction. Many real prompts require several
of these at once.

A detective story might require language parsing, social reasoning about
motives, formal reasoning about timelines, and physical reasoning about whether
an event could have happened. A good system cannot simply collapse all of that
into one undifferentiated soup.

It needs interaction, but it also needs separation.

That gives a first-principles reason for modularity: separable internal codes
reduce interference. They let the system represent different kinds of
information at the same time without every computation overwriting every other
computation.

This also connects to learning. If the same units support everything, then
updates that improve one skill can damage another. If partly distinct
subpopulations carry different computations, the system can change one domain
with less collateral damage elsewhere.

That does not require a brain. It is a generic pressure on any large adaptive
system trained across heterogeneous tasks.

## Step 9: the careful takeaway

The wrong takeaway is:

LLMs have brain areas now.

The better takeaway is:

When a system is trained to support many different kinds of computation, it may
benefit from separating those computations into partly distinct internal
resources.

That is the bridge between brains, dense LLMs, and MoE models. Brains show
functional networks. Dense LLMs appear to develop implicit task-relevant unit
populations. MoE models expose an architectural version of the same broad idea,
although their experts are not automatically cognitive modules.

So the paper is not interesting because it lets us say "LLMs are brains." It is
interesting because it points at a deeper design pressure:

Intelligence may need shared representations, but it also needs boundaries.

For the lower-level analogy between synapses, myelin, credit assignment, and
machine learning, see [Neuroscience and Machine Learning](/blog/neuroscience-and-machine-learning).
This post is about the next level up: not how a connection changes, but how a
large system organizes the work.

## Sources

- [Modular Cognitive Architecture Emerges in Large Language Models](https://pengrui-han.github.io/LLM_Modularity_Page/assets/paper.pdf)
- [Project page: LLM Modularity](https://pengrui-han.github.io/LLM_Modularity_Page/)
- [Code and data repository](https://github.com/Pengrui-Han/LLM_Modularity)
- [Functional specificity for high-level linguistic processing in the human brain](https://www.pnas.org/doi/10.1073/pnas.1112937108)
- [Broad domain generality in focal regions of frontal and parietal cortex](https://pmc.ncbi.nlm.nih.gov/articles/PMC3799302/)
- [Functional neuroanatomy of intuitive physical inference](https://www.pnas.org/doi/10.1073/pnas.1610344113)
- [People thinking about thinking people](https://web.mit.edu/bcs/nklab/media/pdfs/SaxeKanwisherNeuroImage03.pdf)
- [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538)
