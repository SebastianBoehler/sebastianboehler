---
title: "Neuroscience and Machine Learning"
description: "A grounded guide to synapses, myelin, credit assignment, reinforcement learning, and what brain-inspired machine learning can and cannot claim."
date: "2026-06-14"
tags: ["Machine Learning", "Neuroscience", "Brain-Inspired AI"]
visual: "neuro-inspired-learning"
---

Machine learning borrowed words from neuroscience: neuron, network, activation,
weight, learning. That makes the comparison tempting. A brain learns by changing
connections. A neural network learns by changing weights. So are they basically
doing the same thing?

The honest answer is: partly, but not literally.

The useful bridge is this: both systems become better by changing which
pathways are easier to activate next time. The unsafe shortcut is to say that a
deep network learns the way a human brain learns. Brains use spikes, synapses,
neuromodulators, glial cells, myelin, sleep, attention, hormones, embodiment,
and a living environment. Backpropagation uses a precisely computed error
signal through a mathematical graph.

So this article keeps the analogy narrow.

## Step 1: a neuron is not just a node

In a simple neural network diagram, a neuron receives numbers, multiplies them
by weights, adds them up, applies a function, and sends a number forward.

A biological neuron is messier. It receives chemical and electrical signals
through synapses, integrates them across dendrites and the cell body, and may
send spikes down an axon. The timing, location, and history of those signals
matter.

The comparison still helps if we keep it abstract:

- A pathway can become easier or harder to activate.
- Signals can be amplified, damped, delayed, or coordinated.
- Learning changes the system so future activity follows different routes.

That is the first bridge to ML.

## Step 2: synapses are the closest weight analogy

A common intuition is that learning makes certain paths more likely. In the
brain, that idea is closest to synaptic plasticity.

A synapse is a connection where one neuron influences another. Synaptic
plasticity means that influence can change. Long-term potentiation can make a
synapse more effective. Long-term depression can make it less effective. This
is one biological basis for learning and memory, although it is not the whole
story.

In ML language, this is the closest match to a weight update. A weight says how
strongly one unit influences another. Training changes that influence. After
many updates, some paths through the model become easier to use than others.

The analogy is useful, but limited. A neural-network weight is a clean number in
memory. A synapse is a living biochemical structure with timing, location,
receptors, cell types, and local history.

[[visual:neuro-inspired-learning]]

## Step 3: myelin is not the weight, but it matters

The "material that grows around connections" is myelin.

Myelin is an insulating sheath around many axons. It helps signals travel faster
and more reliably. It also helps coordinate timing across circuits. Recent
research supports the idea that myelin is not just fixed wiring from childhood.
Activity and learning can influence myelination, especially in motor learning
and circuit adaptation.

This is where the analogy needs care.

If synaptic plasticity is like changing the strength of a connection, myelin is
more like improving the quality of a communication channel. It can make a used
route faster, more reliable, and better timed. It does not by itself decide what
the answer should be.

For machine learning, the closest analogy is not "increase this weight." It is
more like changing routing efficiency, latency, stability, or bandwidth in a
system. A model parameter can change the output directly. Myelin often changes
how well and when activity arrives.

## Step 4: learning needs credit assignment

Here is the hard question for both brains and ML:

Which part of the system deserves the update?

In a neural network, backpropagation answers this with math. It compares the
output to a target, computes gradients, and updates each weight according to how
it contributed to the error.

The brain does not seem to run ordinary backpropagation exactly as implemented
in deep learning libraries. But the brain still has to solve some version of
credit assignment. If an action leads to reward, pain, surprise, or correction,
which synapses should change?

Neuroscience points to a mixture of local and global signals. Local activity
matters because a synapse can only directly "know" nearby events. Global
signals, including neuromodulators such as dopamine, can broadcast information
about reward, salience, or error. Timing matters too: the system has to connect
what happened earlier with what happened later.

This is why reinforcement learning feels brain-like. In RL, an agent tries
actions, receives reward, and changes future behavior. Dopamine reward
prediction error is one of the strongest bridges between neuroscience and RL.
But even here, the brain is richer than the algorithm.

## Step 5: brain-inspired ML is real, but specific

Neuroscience influences machine learning in concrete ways:

- Hebbian learning: strengthen connections that are active together.
- Spiking neural networks: model communication with discrete spikes.
- Neuromodulated learning: use global reward or context signals to gate updates.
- Replay and consolidation: revisit experience to stabilize learning.
- Predictive coding: learn by reducing prediction error across levels.
- Attention and recurrence: use feedback, not just one forward pass.

These ideas are not all equally mature. Backpropagation remains the workhorse of
modern deep learning because it is efficient and scales. Many biologically
plausible alternatives are scientifically interesting but not yet general
replacements.

So the best way to read "brain-inspired" is not "this is how the brain does it."
It is "this design borrows one constraint or principle from neuroscience."

## Step 6: the useful comparison

The clean comparison is:

- **Synaptic plasticity**: change how strongly one activity pattern influences
  another.
- **Myelin plasticity**: change the speed, reliability, and timing of a pathway.
- **Neuromodulation**: change which updates matter under reward, attention, or
  surprise.
- **Backpropagation**: a machine-learning solution to credit assignment in a
  differentiable graph.
- **Reinforcement learning**: a machine-learning frame for trial, outcome,
  reward, and policy change.

Imagine learning as a path becoming easier to travel. Synapses are the gates,
myelin is the road quality, neuromodulators are traffic signals, and credit
assignment is deciding which part of the route should be repaired.

That picture is simple, but it is closer than saying "the brain updates weights"
or "myelin makes the connection stronger."

## Step 7: where the analogy breaks

There are several places to be careful:

- Biological neurons are not artificial neurons.
- Synapses are not single scalar weights.
- Myelin changes timing and reliability more than semantic preference.
- The brain learns continuously, locally, and under metabolic constraints.
- Deep networks usually train in separated phases: train, then deploy.
- Backpropagation is exact in software, while biological credit assignment is
  still an active research question.

This does not make the analogy useless. It makes it more useful. The goal is
not to force the brain into ML language. The goal is to ask better questions:
what changes, where is the signal, how is credit assigned, what gets stabilized,
and what becomes easier to activate next time?

## Step 8: what to remember

The most accurate simple version is:

Learning changes future activity.

In brains, that can happen through synaptic plasticity, myelin changes,
neuromodulators, structural change, and circuit reorganization. In artificial
neural networks, it mostly happens through parameter updates computed by an
optimizer. The two systems are not the same, but they share a useful abstract
idea: repeated useful patterns become easier to produce again.

That is the bridge worth keeping.

## Sources behind the model

- [The synaptic plasticity and memory hypothesis](https://pmc.ncbi.nlm.nih.gov/articles/PMC3843897/)
- [Long-term potentiation: 50 years on](https://royalsocietypublishing.org/doi/10.1098/rstb.2023.0218)
- [Myelin plasticity: sculpting circuits in learning and memory](https://pmc.ncbi.nlm.nih.gov/articles/PMC8018611/)
- [Myelin plasticity and nervous system function](https://www.annualreviews.org/eprint/MTiTvMWWPAJv9SIZBCyZ/full/10.1146/annurev-neuro-080317-061853)
- [Motor learning requires myelination to reduce asynchrony and spontaneity in neural activity](https://pmc.ncbi.nlm.nih.gov/articles/PMC6899965/)
- [Understanding dopamine and reinforcement learning](https://www.pnas.org/doi/10.1073/pnas.1014269108)
- [Backpropagation and the brain](https://pubmed.ncbi.nlm.nih.gov/32303713/)
- [The combination of Hebbian and predictive plasticity learns invariant object representations](https://www.nature.com/articles/s41593-023-01460-y)
- [Brain-inspired learning in artificial neural networks: a review](https://pubs.aip.org/aip/aml/article/2/2/021501/3291446/Brain-inspired-learning-in-artificial-neural)
