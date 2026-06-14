---
title: "How Physics Shows Up in Machine Learning"
description: "A plain-language guide to SGD noise, states, flows, energy landscapes, constraints, symmetries, conservation laws, and physics-informed machine learning."
date: "2026-06-12"
tags: ["Machine Learning", "Physics", "PIML"]
visual: "physics-informed"
---

Physics and machine learning meet in a few different ways. Sometimes the model
is literally learning a physical system, like weather, fluids, molecules, or a
pendulum. Sometimes physics is used as a source of structure: conservation
laws, symmetries, differential equations, energy, flow, and stable states.
Sometimes physics is only a metaphor that helps us reason about a high
dimensional model.

Those three cases are easy to mix up, so this post keeps them separate.

The short version is this: physics helps machine learning by saying, "not every
function is equally plausible." A pure data model can fit many patterns. A
physics-guided model is pushed toward patterns that obey a law, preserve a
quantity, move smoothly through time, or respect a symmetry.

## Step 1: machine learning starts too open

A neural network is a flexible function. Give it enough parameters and data, and
it can approximate many relationships. That flexibility is useful, but it is
also the problem. If the data is noisy, sparse, or outside the training range,
there are many curves that fit what you have seen and disagree everywhere else.

Physics gives the model a smaller search space.

Instead of asking only, "what curve fits the points?", we can ask, "what curve
fits the points and also behaves like a physical system?" That second question
is much more constrained.

This is one reason physics-informed methods can be valuable when data is
expensive. In many physical domains, you do not have billions of examples. You
have a few sensors, a simulator, or an equation that is partly known.

## Step 2: training is drift plus shake

The clean picture of learning is a ball rolling smoothly downhill. That picture
is useful, but it hides the part that makes modern training work.

Full-batch gradient descent asks every training example where downhill is. That
is expensive. Stochastic gradient descent uses a small mini-batch instead. The
mini-batch direction is cheaper and usually points roughly downhill, but it is
also noisy. The model lurches, not glides.

That noise is not only a mistake. Early in training, the average downhill pull
often dominates, so the model improves quickly. Later, when it reaches a flat
or shallow region, the shaking can help it explore nearby parameter settings
instead of freezing at the first acceptable point.

[[visual:training-dynamics]]

This is where the physics language becomes more than decoration. The gradient
acts like drift or gravity. Mini-batch noise acts like heat. Learning rate,
batch size, momentum, and weight decay change the effective temperature,
damping, and pull of the system.

## Step 3: a state is the system right now

Physics often starts with a state. For a pendulum, the state might be angle and
velocity. For a fluid, it might be velocity, pressure, and density at many
locations. For a model conversation, the "state" is not physical, but we can
still loosely talk about the current internal context or representation.

The important move is this: once you describe the state, you can ask how it
changes.

That creates a trajectory. The system is here now, then here next, then here
after that. In physics, that trajectory may be governed by differential
equations. In machine learning, a model can learn either the state itself, the
next state, or the rule that moves the state forward.

Neural ordinary differential equations are one clean example. Instead of viewing
a network as a fixed stack of discrete layers, they learn a continuous change
rule and use an ODE solver to move the hidden state forward.

## Step 4: flow means "how the state moves"

A flow field tells you the direction a system wants to move at each point. Put a
particle here, and the arrows tell you where it goes next.

This is a useful mental model for machine learning:

- In a dynamical-system model, the flow may be literal.
- In a neural ODE, the learned derivative is the flow.
- In a diffusion model, generation can be described as a learned path from noise
  toward data.
- In an LLM, "flow" is only an analogy: each token changes the context and
  therefore changes the next probability distribution.

The distinction matters. A language model is not automatically simulating
physics. But physics gives us a vocabulary for thinking about states,
directions, stability, and change.

## Step 5: energy means "how compatible is this state?"

An energy landscape assigns a score to possible states. Lower energy usually
means the state is more compatible with what the system wants. Higher energy
means the state is less compatible.

This is not just metaphor in all of ML. Hopfield networks, for example, can be
described as systems that settle into stable low-energy memories. Energy-based
models also explicitly learn an energy function where observed or plausible
configurations should have lower energy than implausible ones.

The marble-in-a-bowl picture is useful:

- The marble's position is the current state.
- A valley is a stable outcome.
- A basin is the region that falls into that outcome.
- A barrier is what separates one basin from another.

The important idea is not only "go downhill." It is "go downhill inside the
world you are allowed to move through." A reward-only learner may discover a
shortcut to a low-loss state. If the shortcut breaks physics, it is not a real
solution. Adding physics changes the shape of the search space: the same basin
can still be the goal, but the path toward it bends around impossible or
expensive states.

For LLMs, be careful. During normal generation, the model is not training its
weights and literally rolling downhill into a new minimum. The weights are
fixed. But the analogy is still helpful if "low energy" means "more likely or
more compatible with the current context."

That is why initial context matters. A prompt can place the model near one
answer family instead of another. A skill, system prompt, example, or long
conversation can narrow the likely region even more.

## Step 6: constraints make bad answers expensive

The most direct way to combine physics and ML is to add a constraint. The model
still learns from data, but it is penalized when it violates a known rule.

For example, imagine fitting a curve through noisy sensor readings. A data-only
model may chase every noisy wiggle. A physics-guided model can be told, "fit the
data, but also stay close to the differential equation, conservation law, or
simulator behavior we expect."

[[visual:physics-informed]]

Physics-informed neural networks are a concrete version of this idea. They
train neural networks to solve supervised tasks while respecting physical laws,
often written as partial differential equations. The loss is no longer only
"match the observed data." It can also include "do not violate this equation at
these points in space and time."

That does not make the method magic. If the equation is wrong, incomplete, or
too expensive to enforce, the model can still fail. But it changes the game: the
model is no longer free to fit any pattern that happens to match the data.

## Step 7: conservation laws reduce drift

Some physical systems preserve quantities. Energy, momentum, mass, or charge may
stay constant under the right assumptions.

Ordinary neural networks do not automatically know that. A model trained on a
pendulum may look right for a short time and then slowly invent or destroy
energy. That kind of drift is a warning sign: the model learned a pattern, but
not the structure behind the pattern.

Hamiltonian neural networks attack this by building inspiration from
Hamiltonian mechanics into the model. The goal is to learn dynamics that respect
conservation laws instead of merely matching the next few examples.

The broader lesson is simple: if a quantity should be conserved, encode that
fact somehow. Put it in the architecture, the loss, the data generation process,
or the simulator loop.

## Step 8: symmetries tell the model what should not matter

Physics is full of symmetries. A law may not care where an object is translated.
It may not care how the coordinate system is rotated. It may care about relative
distances but not absolute labels.

Machine learning can use the same idea. If a task has a symmetry, the model
should not need to relearn the same pattern in every possible orientation or
position. Convolutional networks exploit translation structure in images. Group
equivariant networks generalize that idea to transformations like rotations and
reflections.

This is another way physics helps: it tells the model which differences are
real and which are just coordinate choices.

## Step 9: simulators can teach or correct models

Many physical domains already have simulators. They may be slow, imperfect, or
expensive, but they contain knowledge.

Machine learning can use simulators in several ways:

- Generate training data where real measurements are scarce.
- Learn a fast surrogate that approximates a slow simulation.
- Compare model predictions against simulated rollouts.
- Use simulation inside reinforcement learning or planning.
- Correct a data-driven model when it drifts into physically impossible states.

The practical pattern is hybrid: let data handle what the law does not capture,
and let the law or simulator keep the model from making physically absurd moves.

## Step 10: physics in reinforcement learning

Reinforcement learning is where the physics connection becomes very concrete.
An agent chooses actions, the environment responds, and the agent slowly learns
which actions lead to reward.

The simplest story is: "maximize reward." But the environment decides what
actions are available, what happens after each action, and which shortcuts are
allowed. Physics changes that environment. It does not necessarily change the
goal. It changes the routes that are feasible on the way to the goal.

If the environment is physical, an unconstrained agent can waste enormous time
trying actions that could never work in the real world. A robot cannot ignore
gravity. A drone cannot teleport sideways. A character controller cannot bend a
knee backward without consequences.

Physics can enter the RL loop through the simulator, the reward, the action
space, or the model architecture. The goal is not to remove learning. The goal
is to make the agent spend more of its learning budget on plausible behavior.
In the landscape picture, the agent may still settle into a good basin, but
physics reshapes which slopes, ridges, and paths actually exist.

## Step 11: how this connects back to latent space

Latent space is not automatically a physical space. The axes are learned
representations, not meters or seconds. Still, physics gives useful language for
thinking about it.

A representation can be thought of as a state. A prompt can move the starting
state. A conversation can create a trajectory. A set of likely outputs can look
like a basin. A model's uncertainty can look like spread around a path.

The safe version of the analogy is:

- **State**: the current representation or context.
- **Flow**: how new input changes the next distribution.
- **Basin**: a family of likely continuations.
- **Energy**: compatibility, plausibility, or negative preference.
- **Noise**: sampling variation, numerical variation, or real uncertainty.

This language is useful as long as we remember which parts are literal and which
parts are pictures.

## Step 12: the practical takeaway

Physics in machine learning is not one technique. It is a toolbox of ways to add
structure:

- States and flows describe change.
- Energy landscapes describe stable outcomes.
- Constraints make impossible behavior expensive.
- Conservation laws reduce drift.
- Symmetries reduce unnecessary learning.
- Simulators provide structured experience.

The common theme is inductive bias. Physics tells the model what kinds of
solutions should be easier to learn before it sees all possible examples.

That is the reason the physics analogy is powerful for understanding ML. It
turns "the model found a pattern" into a more precise question: what state is it
in, how does it move, what basins are nearby, what constraints shape the path,
and what laws should it respect?

## Papers behind the mental model

- [Physics-informed machine learning](https://www.nature.com/articles/s42254-021-00314-5)
- [Physics Informed Deep Learning (Part I)](https://arxiv.org/abs/1711.10561)
- [Stochastic Gradient Descent as Approximate Bayesian Inference](https://arxiv.org/abs/1704.04289)
- [On the Generalization Benefit of Noise in Stochastic Gradient Descent](https://proceedings.mlr.press/v119/smith20a/smith20a.pdf)
- [Neural Ordinary Differential Equations](https://arxiv.org/abs/1806.07366)
- [Hamiltonian Neural Networks](https://arxiv.org/abs/1906.01563)
- [Neural networks and physical systems with emergent collective computational abilities](https://pmc.ncbi.nlm.nih.gov/articles/PMC346238/)
- [A Tutorial on Energy-Based Learning](https://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf)
- [DeepMimic: Example-Guided Deep Reinforcement Learning of Physics-Based Character Skills](https://arxiv.org/abs/1804.02717)
- [A Survey on Physics Informed Reinforcement Learning](https://arxiv.org/abs/2309.01909)
- [Group Equivariant Convolutional Networks](https://arxiv.org/abs/1602.07576)
- [Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges](https://arxiv.org/abs/2104.13478)
- [Representation Learning: A Review and New Perspectives](https://arxiv.org/abs/1206.5538)
