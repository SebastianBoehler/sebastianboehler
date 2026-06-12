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
of numbers that places it somewhere in a learned space.

The first useful idea is simple: **meaning becomes position**. Words, phrases,
and partial answers are represented by locations and directions. Similar things
usually land near each other. Different styles, tasks, and levels of detail pull
the model in different directions.

## Step 1: words become coordinates

Imagine a map. On a normal map, north-south and east-west are enough to locate a
city. In a model, there are far more directions. One direction might loosely
track formality. Another might track whether the text is mathematical or
metaphorical. Another might track whether the answer should be short or
careful.

The real model space has thousands of dimensions, so we cannot draw it directly.
The plot below compresses the idea into two dimensions. That compression is not
the real model. It is a teaching sketch that lets us reason visually.

[[visual:latent-space]]

## Step 2: a prompt is not a point

A prompt is a sequence. Each token changes the state a little. "Explain latent
space" starts in one region. Adding "to a beginner" pushes the state toward
simple language and examples. Adding "geometrically" pulls it toward derivation.
Adding "as a metaphor" pulls it toward imagery.

That is why I find it better to think of a prompt as a **trajectory**. It moves
through the model's internal space. The final state after reading the prompt is
where the model starts predicting the next token.

## Step 3: the model predicts a distribution

The model does not choose one next word directly. It produces a probability
distribution over possible next tokens. In plain language, it says: these next
tokens are likely, these are unlikely, and these are almost impossible in this
context.

If the settings are fixed, the weights are fixed, and the numerical computation
is exactly repeated, this distribution is the deterministic part. The model is
not confused. It has computed a landscape of possibilities.

## Step 4: generation samples a path

Text generation turns that probability distribution into one actual token, then
feeds that token back into the model and repeats the process. Each sampled token
bends the next state. After many steps, a whole answer has been traced through
the space.

Temperature and related settings control how adventurous this sampling is. Low
temperature stays close to the highest-probability path. Higher temperature
allows more side paths. In the visual, move the sampling-spread slider and watch
the repeated runs widen or tighten.

## Step 5: repeated runs form a cloud

If you run the same prompt many times, you do not get one perfect point. You get
a cluster of outputs. I call that cluster the **run cloud**.

The center of the run cloud is the answer the model most naturally wants to
give. The width of the cloud is how much practical variation you should expect.
Some prompts create tight clouds: many runs say almost the same thing. Other
prompts create wide clouds: runs drift into different examples, styles, or
reasoning paths.

## Step 6: randomness has layers

"Randomness" is too blunt. Several layers can contribute to the spread:

- **Sampling variance**: the decoder intentionally chooses among plausible next
  tokens.
- **Numerical variance**: tiny floating point differences can affect borderline
  choices.
- **System variance**: batching, kernels, drivers, and host scheduling can alter
  the exact numerical path through equivalent computations.

The theoretical object is the probability distribution. The practical object is
the distribution plus the run cloud you observe when the system actually runs.

## Step 7: prompts steer regions

This changes how prompt engineering should feel. A prompt is not a magic spell.
It is a steering function. It pushes the model toward a region, a style, and a
range of likely continuations.

A strong prompt is therefore not just one that produces a good answer once. It
is one whose run cloud stays inside the region you want. If the cloud is wide,
you either accept variety, lower the sampling spread, add constraints, or break
the task into smaller steps.

The main takeaway: latent space is a way to reason about direction. Prompts move
through it, decoding samples paths inside it, and repeated runs reveal the cloud
of answers the model is likely to produce.
