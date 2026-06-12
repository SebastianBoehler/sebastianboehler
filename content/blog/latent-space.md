---
title: "Prompt Trajectories in Latent Space"
description: "A step-by-step visual explanation of how prompts become directions, how generations form clusters, and why model randomness is better understood as a run cloud."
date: "2026-06-12"
tags: ["Latent Space", "LLMs", "Visualization"]
visual: "latent-space"
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
left to right: first clusters, then prompt movement, then conversation movement,
then randomness.

[[visual:latent-space]]

## Step 3: a prompt is not a point

A prompt is a sequence. Each token changes the state a little. "Explain latent
space" starts in one region. Adding "to a beginner" pushes the state toward
simple language and examples. Adding "geometrically" pulls it toward derivation.
Adding "as a metaphor" pulls it toward imagery.

That is why I find it better to think of a prompt as a **trajectory**. It moves
through a sequence of internal states. This is not a measured physical path
through one fixed map. It is a mental model for how each extra token changes the
model's next guess.

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

[[visual:conversation-drift]]

## Step 5: the model predicts a distribution

The model does not choose one next word directly. It produces a probability
distribution over possible next tokens. In plain language, it says: these next
tokens are likely, these are unlikely, and these are almost impossible in this
context.

This is where the starting point matters. The prompt has already moved the
model into a region before the first output token is sampled. A bare prompt like
"explain latent space" leaves many directions open. A beginner prompt makes
examples and analogies more likely. A coding prompt makes implementation details
more likely. A poetic prompt makes metaphor more likely.

If the settings are fixed, the weights are fixed, and the computer repeats the
same calculation exactly, this landscape of possibilities is the fixed part.
The model is not confused. It has assigned scores to the possible next tokens.

[[visual:prompt-distribution]]

## Step 6: generation samples a path

Text generation turns that probability distribution into one actual token, then
adds that token back into the context and repeats the process. Each chosen token
changes the next set of probabilities. After many steps, a whole answer has been
built one token at a time.

Temperature and related settings control how adventurous this sampling is. Lower
temperature concentrates probability on already likely tokens. Higher
temperature spreads probability mass across more alternatives. In the visual,
move the sampling-spread slider and watch the repeated runs widen or tighten.

## Step 7: repeated runs form a cloud

If you run the same prompt many times with sampling enabled, you do not get one
perfect point. You get a distribution over possible strings. If you embed those
generated answers and plot them, you can think of the result as a **run cloud**.

The densest part of the run cloud is the kind of answer the model most often
samples under those settings. The width of the cloud is how much practical
variation you should expect. Some prompts create tight clouds: many runs say
almost the same thing. Other prompts create wide clouds: runs drift into
different examples, styles, or reasoning paths.

## Step 8: randomness has layers

"Randomness" is too blunt. Several layers can contribute to the spread:

- **Sampling variance**: the decoder intentionally chooses among plausible next
  tokens.
- **Numerical variance**: parallel floating point operations can produce tiny
  differences, especially when operation order changes.
- **Serving variance**: batching, kernels, hardware, model versions, and backend
  configuration can change whether repeated calls are exactly reproducible.

So there are two things to keep separate: the probabilities the model computes,
and the run cloud you observe when the system actually generates answers.

## Step 9: skills are context engineering

A skill is a structured way to add context before the model has to decide what
to do. It might include definitions, procedures, examples, constraints, file
paths, style rules, or domain vocabulary. That extra context changes the start
point.

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

## Step 10: prompts steer regions

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
