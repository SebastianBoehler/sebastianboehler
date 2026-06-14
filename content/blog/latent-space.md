---
title: "Prompt Trajectories in Latent Space"
description: "A step-by-step visual explanation of how prompts become directions, how generations form clusters, and why model randomness is better understood as a run cloud."
date: "2026-06-12"
tags: ["Latent Space", "LLMs", "Visualization"]
visual: "latent-space"
image: "/blog/latent-space-projection-clean.png"
imageAlt: "Axis-free Matplotlib contour plot showing word clusters, prompt paths, and run clouds in a toy latent space."
---

Large language models can feel mysterious because we talk to them with words,
but they do not think in words. They compute with numbers. A prompt enters as
text, gets split into tokens, and each token is converted into a vector: a list
of numbers. The model then updates those vectors by looking at the surrounding
text. So the vector for a word is not just "the word itself"; it is the word in
this sentence, in this task, with this surrounding context.

The first useful idea is simple: **meaning becomes a direction in number
space**. Similar things often end up near each other. Different styles, tasks,
and levels of detail push the model toward different regions before it starts
answering.

This is why latent space is useful as a mental model. It lets us stop thinking
of language as a bag of strings and start thinking of it as geometry.

## Step 1: words become coordinates

Imagine a map. On a normal map, north-south and east-west are enough to locate a
city. In a model, there are far more directions. One direction might loosely
track formality. Another might track whether the text is mathematical or
metaphorical. Another might track whether the answer should be short or
careful.

Start with individual words. "Cat", "kitten", and "pet" should be closer to
each other than to "compiler" or "interest rate". Not because the model was
given a dictionary, but because during training those words appeared in similar
contexts. They were surrounded by related words, used in related sentences, and
helped predict related continuations.

So the model learns neighborhoods. Animal words form one rough neighborhood.
Programming words form another. Finance words form another. These neighborhoods
are not clean boxes. They overlap, stretch, and bend. "Mouse" can live near pets
or computers depending on context. That is the important part: context can move
the same word toward a different neighborhood.

## Step 2: similar words form clusters

A cluster is just a region where related points are close together. In language,
clusters happen because words and phrases that behave similarly get similar
vectors. The model learns that "dog" and "puppy" can often appear in similar
places. It also learns that "gradient", "loss", and "optimizer" belong to a
different local region.

The real model space has thousands of dimensions, so we cannot draw it directly.
The plot below compresses the idea into two dimensions. That compression is not
the real model, and the plotted coordinates are not measured from a specific
LLM. It is a teaching sketch that lets us reason visually. Click the tabs from
left to right: first clusters, then an animated context path, then run clouds,
then the landscape analogy.

[[visual:latent-space]]

## Step 3: a prompt becomes a path and a point

A prompt starts as a sequence. Each token is processed in order, and each token
changes the contextual state a little. "Explain latent space" starts in one
region. Adding "to a beginner" pushes the state toward simple language and
examples. Adding "geometrically" pulls it toward derivation. Adding "as a
metaphor" pulls it toward imagery.

So there are two valid views:

- As input, a prompt is a sequence of tokens.
- After the model has processed that sequence, the current context can be
  represented by a hidden state vector. For a specific layer and token position,
  that vector is a point in representation space.

That is why a useful mental model is a prompt as a **trajectory that ends in a
state**. The trajectory is the sequence of internal updates caused by the
tokens. The endpoint is the current context state from which the model predicts
the next token.

This is not a measured physical path through one fixed map. It is a mental
model for how each extra token changes the model's next guess. The exact "point"
also depends on which layer and which token position you inspect, so there is
not one universal prompt coordinate that all models expose.

The trajectory is not locked inside the first cluster forever. Context usually
anchors the model near a region, but a strong instruction can move the
contextual state toward a different neighborhood. "Explain this simply" and
"now derive it rigorously" can pull the same topic into different answer
families. The base embedding map is not being retrained; the contextual state is
being recomputed from the text in front of the model.

## Step 4: a conversation keeps moving

A conversation is a longer trajectory. In many chat systems, each turn is
read together with the transcript so far. The next user message does not start
from zero; it is evaluated in the context of the conversation that still fits
inside the context window.

That means a chat can drift. If the first turn asks for an intuitive
explanation, later answers are more likely to use examples and plain language.
If the second turn asks for equations, the likely answer shifts toward formal
language. If the third turn asks for implementation details, it shifts again
toward code and systems.

Good conversations often work because each turn narrows the region. Bad
conversations often fail because the path wanders: the model keeps carrying
old context, ambiguous intent, or conflicting style pressure.

So a conversation is a balance. It has inertia because earlier turns remain in
context, but it is not a prison. Later turns can correct, narrow, or redirect
the path if they are specific enough.

[[visual:conversation-drift]]

## Step 5: attention decides what context matters now

There is one more mechanism between "the context is in the model" and "the
model predicts the next token": attention.

A transformer does not simply average the whole prompt into one static point.
It keeps a representation for each token position. In each attention layer, a
token can look at other tokens and mix in information from them. Technically,
the model makes queries, keys, and values. A query from the current position is
compared with keys from earlier positions. That comparison produces attention
weights. Those weights decide how much value information flows from those
earlier tokens into the current token's representation.

So if the context contains an article about cars, planes, and ships, then the
question you append matters a lot. A question like "Why do wings generate lift?"
can make the current token states draw more from the plane-related parts. A
question like "Why does a hull displace water?" can draw more from the
ship-related parts. The full context is available, but the model does not use
all of it equally for every next-token decision.

This is why "where the whole input lies in latent space" is still too simple.
The model is not only asking:

- what is the general topic of the context?

It is also asking:

- which earlier tokens matter for this exact next token?
- which instruction is currently active?
- which examples, definitions, or constraints should be copied into the current
  state?

Attention is the mechanism that lets the prompt re-weight the context. The
result is still a contextual state vector, but that state has been built by
selectively routing information from the sequence, not by treating the entire
article as one undifferentiated blob.

That contextual state is what this post means by **hidden state**. It is not
the raw word embedding anymore. A raw embedding is closer to "what this token
usually means." A hidden state is closer to "what this token or current
position means after reading this whole context." It has already been shaped by
attention, feed-forward layers, position information, and the surrounding
tokens.

For next-token prediction, the most important hidden state is usually the state
at the current final position: the place where the model has integrated the
prompt and is ready to predict what comes next. You can think of that state as
the endpoint of the context trajectory. It is a point in a model layer's
representation space, but it is a point that was constructed from the whole
sequence.

This also explains why a long context does not control the next token only by
its broad topic. If an article mentions cars, planes, and ships, the appended
question changes the final hidden state by changing which earlier tokens become
relevant. The continuation is controlled by the context as routed through
attention, not by a single static "article location."

Attention is also not a perfect human-style explanation of what the model
"cares about." Different heads and layers track different patterns, and the
final answer also depends on feed-forward layers and the output projection. But
as a first mental model, attention explains why the appended question can steer
which parts of a long context shape the next prediction.

## Step 6: the model predicts a distribution

The model does not choose one next word directly. It produces a probability
distribution over possible next tokens. In plain language, it says: these next
tokens are likely, these are unlikely, and these are almost impossible in this
context.

This is where the starting point matters. The prompt has already moved the
model into a region before the first output token is sampled. A bare prompt like
"explain latent space" leaves many directions open. A beginner prompt makes
examples and analogies more likely. A coding prompt makes implementation details
more likely. A poetic prompt makes metaphor more likely.

But here is the subtle part: **nearby in representation space does not
automatically mean high next-token probability**.

Imagine the context is:

> I drove to work in my

The token "car" might be likely. Words like "bicycle", "motorbike", "truck",
and "vehicle" may live near it in a rough semantic neighborhood because they
are all transport words. But that neighborhood is not the whole decision. The
model has just built a contextual state from the exact phrase "I drove to work
in my". Attention has routed information from the relevant earlier tokens into
that state: "drove", "to work", and especially the phrase "in my" matter for
what can naturally come next.

So "bicycle" can be semantically close to "car" and still be much less likely
here, because the context usually wants "in my car" rather than "in my bicycle".
If the sentence were "I rode to work on my", attention would build a different
contextual state and "bicycle" would become much more compatible. The semantic
cluster did not disappear; the prompt changed which parts of that cluster are
usable for this exact continuation.

So the visual should be read like this:

- The starting context changes the hidden state.
- Attention decides which earlier tokens matter for the current prediction.
- That contextual state is compared against many possible next tokens.
- Semantically nearby tokens often become plausible alternatives, but only if
  they also fit the active context.
- The actual probabilities also depend on syntax, phrasing, frequency, task
  instruction, and the exact conversation so far.

The model's final next-token probabilities are produced by a learned projection
and softmax, not by simply choosing the geometrically nearest word on a 2D map.
The map is useful because it shows neighborhoods of related meaning. It is
misleading only if we pretend distance alone is the probability rule.

One more step makes this clearer. After the prompt has been processed, the
model has a contextual hidden state for "what should come next here?" That state
is used to score many candidate tokens. You can loosely imagine each possible
token having an output direction, and the current hidden state asking: "how
compatible is this token with the context right now?"

Those scores are called logits. The model then turns logits into probabilities
with softmax. The highest score is not always the only reasonable continuation.
Several tokens may be plausible for different reasons: meaning, grammar, style,
frequency, task instruction, or the conversation so far. Sampling chooses one
token from that probability distribution. Then the chosen token is appended to
the context, the model recomputes the next hidden state, and the process repeats.

So the continuation is not:

- find the closest word in semantic space,
- output that word,
- move to the next closest word.

It is closer to:

- use attention and feed-forward layers to turn the whole sequence into a final
  hidden state,
- score every possible next token against that final state,
- convert scores into a distribution,
- sample or choose one token,
- feed that token back into the context and continue.

This is why "car" can beat "vehicle" after "I drove to work in my", even if
both words live near each other semantically. The model is not asking only
"which token is nearby?" It is asking "which token best continues this exact
sentence, in this exact conversation, under this decoding setting?"

If the settings are fixed, the weights are fixed, and the computer repeats the
same calculation exactly, this landscape of possibilities is the fixed part.
The model is not confused. It has assigned scores to the possible next tokens.

[[visual:prompt-distribution]]

## Step 7: reasoning can be text or hidden state

Chain-of-thought reasoning is the familiar version: the model writes
intermediate steps as ordinary text before giving the final answer. This can
help because each written step becomes part of the context. The model can look
back at its own scratchpad, catch local mistakes, and decompose a problem into
smaller moves.

But a written chain of thought is also expensive. Every intermediate word has
to be decoded, stored in the context, and then attended to later. Many tokens
are there for human-readable grammar: "therefore", "next", "we can see", and so
on. They make the reasoning inspectable, but they are not always the most
compact form of the computation.

Latent reasoning asks a different question: what if some intermediate reasoning
steps stay in continuous hidden-state space instead of being converted into
visible words? In a normal language model, a hidden state is usually projected
into logits, decoded into a token, appended to the context, and then processed
again. Latent-reasoning methods try to feed some hidden states or soft
representations forward directly, using them like internal scratchpad states.

That can be more token-efficient because one vector can carry information that
would take many words to spell out. It can also avoid committing too early to
one exact sentence. A text chain has to choose a discrete path: token, token,
token. A continuous state can, at least in principle, keep several partial
possibilities alive before the model commits to words.

Recent work explores this directly. Coconut, for example, treats the last
hidden state as a "continuous thought" and feeds it back as the next input
embedding instead of immediately decoding it into text. SoftCoT and
SwiReasoning explore related soft or switchable reasoning modes. The practical
idea is not that natural language reasoning disappears. It is that a model can
mix modes: use visible chain-of-thought when human-readable working memory is
useful, and use latent computation when compact internal search is enough.

There is a tradeoff. Visible chain-of-thought costs tokens, but it gives humans
something to inspect. Latent reasoning can be more efficient, but it is harder
to monitor. Also, written chain-of-thought is not guaranteed to be a faithful
transcript of the model's real causes. It can be a useful scratchpad, a
rationalization, or both. So the safe mental model is:

- **Hidden state reasoning** is the model's internal vector computation.
- **Chain-of-thought** is reasoning externalized into language tokens.
- **Latent reasoning methods** try to do more of the intermediate work before
  paying the cost of text.
- **Final answers** are still sampled token by token unless the whole interface
  changes.

This fits the latent-space picture. Natural language is a narrow channel
through the model's space. It is useful because humans can read it. It is
inefficient because every idea has to squeeze through discrete tokens. Latent
reasoning keeps some work in the wider continuous space, then only decodes when
the model needs to communicate.

## Step 8: generation samples a path

Text generation turns that probability distribution into one actual token, then
adds that token back into the context and repeats the process. Each chosen token
changes the next set of probabilities. After many steps, a whole answer has been
built one token at a time.

Temperature and related settings control how adventurous this sampling is. Lower
temperature concentrates probability on already likely tokens. Higher
temperature spreads probability mass across more alternatives. In the visual,
move the sampling-spread slider and watch the repeated runs widen or tighten.

## Step 9: repeated runs form a cloud

If you run the same prompt many times, you may not get one perfect point. You
get a distribution over possible strings. If you embed those generated answers
and plot them, you can think of the result as a **run cloud**.

There are two different reasons this can happen. The first is intentional:
sampling and temperature ask the decoder to choose among plausible tokens. The
second is unintentional: even with nominal sampling disabled, a production
serving system can introduce tiny numerical differences before the decoder makes
its choice.

So the densest part of the run cloud is the kind of answer the system most often
produces under those settings and serving conditions. The width of the cloud is
how much practical variation you should expect. Some prompts create tight
clouds: many runs say almost the same thing. Other prompts create wider clouds:
runs drift into different examples, styles, or reasoning paths.

## Step 10: randomness has layers

"Randomness" is too blunt. Several layers can contribute to the spread:

- **Sampling variance**: the decoder intentionally chooses among plausible next
  tokens.
- **Numerical variance**: parallel floating point operations can produce tiny
  differences, especially when operation order changes.
- **Serving variance**: batching, kernels, hardware, model versions, and backend
  configuration can change whether repeated calls are exactly reproducible.

So there are two things to keep separate: the probabilities the model computes,
and the run cloud you observe when the system actually generates answers.

There is an important practical result here. A deployed model can sometimes
produce different answers even when the requested temperature is zero. That
does not mean the model contains a little random creature making choices. The
cleaner explanation is that real serving systems can change the exact
computation. Thinking Machines Lab argues that the central culprit is often
dynamic batching. Your request may be processed alone in one run and beside
other requests in another run. If the kernels are not **batch invariant**, the
same request can receive slightly different numerical results when the batch
shape changes. This is not just "the model decided randomly." It is an
implementation-level perturbation: floating point arithmetic, reduction order,
kernel shape, and server load affect the logits by a tiny amount.

Those differences are usually tiny. Most of the time they do not matter. But if
two next-token choices are almost tied, a tiny logit difference can flip which
token wins. After that first different token, generation is autoregressive: the
new token is added back into the context, so the next prediction is now made
from a slightly different state. A tiny branch can become a visibly different
answer.

[[visual:nondeterminism-boundary]]

So the useful picture is not "the model jumps randomly across latent space."
It is more like this:

- The same prompt lands in almost the same region each time.
- Sampling can deliberately choose different plausible tokens.
- Implementation nondeterminism can create a small cloud around the same state
  even when nominal temperature is zero.
- If the cloud is far from a decision boundary, every run looks the same.
- If the cloud crosses a boundary between two near-tied continuations, runs can
  branch.
- Once a branch starts, later tokens can amplify the difference.

Some researchers call the observed hidden randomness at nominal temperature
zero a kind of **background temperature**. That phrase is useful because it
keeps the two knobs separate: the temperature you ask for, and the effective
variation created by the serving system.

There is also a separate kind of noise during training. Stochastic gradient
descent trains the weights by looking at mini-batches of data, so the training
path can wiggle through the loss landscape. That is different from generation
time. During a normal chat, the weights are already fixed. The noise you see is
mostly about decoding choices and serving details, not the model learning a new
valley while it answers.

## Step 11: small experiments make the cloud visible

The simplest experiment is not to prove what happens inside a specific GPU. It
is to measure the outside behavior. Send the exact same prompt many times, keep
the model, temperature, and settings fixed, then compare the outputs. Count how
often the text is identical. If it differs, find the first token or word where
the runs diverge. That first divergence is the boundary you are looking for.

The repo includes a small code artifact for that style of test in
`experiments/llm-nondeterminism`. The Python script generates the boundary
effect plots locally. The API collector records repeated completions as JSONL
and prints a compact summary. If repeated temperature-zero runs still produce
multiple unique outputs, that is evidence of serving-level variation. Higher
temperature runs mostly measure intentional sampling.

The experiment is deliberately modest. It cannot see the model's true latent
space, and it cannot prove which GPU kernel caused a difference. What it can do
is make the run cloud concrete: same prompt, same settings, observed output
spread.

## Step 12: skills are context engineering

A skill is a structured way to add context before the model has to decide what
to do. It might include definitions, procedures, examples, constraints, file
paths, style rules, or domain vocabulary. That extra context changes the start
point.

In agent systems, "skill" often means something more specific than a prompt
snippet: a file, workflow, tool contract, or memory surface that the harness can
load when the task calls for it. That system-level version is covered in
[Context Engineering for Agents](/blog/context-engineering-for-agents). Here,
the important point is simpler: loaded context changes the state from which the
model predicts.

In the latent-space picture, a skill does not make the model smarter by itself.
It steers the model closer to the region where the useful answer already lives.
It narrows the distribution. It makes irrelevant continuations less likely and
domain-specific continuations more likely. The model has not learned new
weights. It is using the text you gave it as steering information.

This is why context engineering matters. You are not only asking a question.
You are shaping the state from which the model predicts. A weak context leaves
the model high on the landscape, where many paths are plausible. A strong
context places it near a basin: a region where the next steps are more coherent,
more specific, and less likely to wander.

The phrase "local minimum" is useful only as a metaphor. During a chat, the
model is not training its weights or literally optimizing into a minimum. The
weights are fixed. What changes is the hidden state and the probability
distribution. If we draw a landscape where valleys mean "answers the model is
more likely to give", then a basin means a region of likely continuations. No
optimizer is rolling downhill during normal generation; the landscape is just a
picture for the probabilities.

Different initial contexts can therefore lead to completely different clusters
of outputs. The same user can ask about latent space as a beginner, as a
mathematician, as a programmer, or as a writer. Those are not tiny wording
changes. They are different start points, and they pull the conversation toward
different answer families.

This is the useful version of the physics analogy: a prompt or skill is not a
new law of nature, but it can act like a constraint on the answer space. It
reduces the directions that are plausible, the same way a physical simulator or
reward constraint reduces useless moves for an RL agent.

## Step 13: prompts steer regions

This changes how prompt engineering should feel. A prompt is not a magic spell.
It is a steering function. It pushes the model toward a region, a style, and a
range of likely continuations.

A strong prompt is therefore not just one that produces a good answer once. It
is one whose run cloud stays inside the region you want. If the cloud is wide,
you either accept variety, lower the sampling spread, add constraints, or break
the task into smaller steps.

The main takeaway: latent space is a way to reason about direction. Prompts
change the model's internal state, conversations change the context, decoding
samples from the resulting probabilities, and repeated runs reveal the cloud of
answers the model is likely to produce.

## Papers behind the mental model

- [Distributed Representations of Words and Phrases and their Compositionality](https://arxiv.org/abs/1310.4546)
- [How Contextual are Contextualized Word Representations?](https://arxiv.org/abs/1909.00512)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751)
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Language Models Don't Always Say What They Think](https://arxiv.org/abs/2305.04388)
- [Training Large Language Models to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769)
- [SoftCoT: Soft Chain-of-Thought for Efficient Reasoning with LLMs](https://aclanthology.org/2025.acl-long.1137/)
- [SwiReasoning: Switch-Thinking in Latent and Explicit for Pareto-Superior Reasoning LLMs](https://arxiv.org/abs/2510.05069)
- [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [Introducing Background Temperature to Characterise Hidden Randomness in Large Language Models](https://arxiv.org/abs/2604.22411)
- [The Impact of Non-determinism on Reproducibility in Deep Learning](https://arxiv.org/abs/2207.09955)
