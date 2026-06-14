---
title: "Context Engineering for Agents"
description: "How agent harnesses load instructions, skills, memory, tools, and files without stuffing everything into the first prompt."
date: "2026-06-14"
tags: ["Agents", "Context Engineering", "Skills"]
visual: "context-engineering"
---

An LLM agent is not only a model. It is a model inside a harness.

The model predicts tokens. The harness decides what the model can see, what
tools it can call, what files it can read, what instructions are active, and
what gets added back into the conversation after each action. That surrounding
system is where a lot of agent behavior comes from.

This is why context engineering is different from ordinary prompting. A prompt
is one piece of text. Context engineering is the design of the whole information
flow around the model.

## Step 1: the context window is a budget

A model can only attend to the tokens inside its context window. Bigger windows
help, but they do not remove the problem. If you load every policy, every tool
manual, every memory, every style rule, and every file at the start, three
things go wrong:

- The important instruction is harder to find.
- Irrelevant text competes with relevant text.
- The agent spends attention on context that the current task does not need.

So a good agent harness usually starts with a small bootstrap context. That
bootstrap says what kind of agent this is, what rules are always active, and
where more context can be found.

The bootstrap is not the whole brain. It is the map.

[[visual:context-engineering]]

## Step 2: bootstrap context tells the agent what exists

Many coding agents start by loading a repo instruction file such as
`AGENTS.md`. That file may say:

- how to edit code in this repo,
- how to run tests,
- what should never be changed,
- where skills live,
- where memory lives,
- which tools are available,
- when to search the web,
- when to ask before taking risky actions.

This matters because the model cannot use a skill it does not know exists. The
initial context needs enough information to route. It does not need every
workflow in full detail.

A useful bootstrap says:

- Here are the always-on rules.
- Here are the available context sources.
- Here is how to decide which source is relevant.
- Here is how to load only the needed source.

That is the core trick. Do not preload everything. Preload the index.

## Step 3: skills are delayed context

A skill is not magic. It is usually a structured packet of context. It might
contain:

- workflow instructions,
- tool usage rules,
- examples,
- domain vocabulary,
- scripts,
- templates,
- assets,
- verification steps.

The important part is delayed loading. The harness can tell the model: "There
is a plotting skill, a browser-testing skill, a PDF skill, a React skill, and a
deployment skill. Load the one that matches the task."

That gives the agent two advantages. First, the initial context stays small.
Second, the loaded context becomes more relevant. When the task is "debug this
React page," the React and browser-testing instructions should dominate. The PDF
skill should not be sitting in the prompt just because it exists.

In latent-space terms, skills steer the model. In harness terms, skills are a
retrieval system for operational instructions.

## Step 4: memory is not the same as a skill

Memory answers a different question.

A skill says: "Here is how to do this kind of task."

Memory says: "Here is what has happened before in this workspace, repo, user
relationship, or project."

For example, memory might tell an agent:

- the user prefers small commits,
- this repo has unrelated changes from parallel threads,
- the production site deploys from `master`,
- a previous dependency bump broke the build,
- a certain API key lives in a project environment,
- generated outputs should stay ignored.

That context can be useful, but it is dangerous if loaded blindly. Old memory
can be stale. Irrelevant memory can distract. Personal memory can be sensitive.
So memory should be retrieved with a reason, checked against the current
workspace when possible, and kept smaller than the task itself.

Good memory retrieval is not "remember everything." It is "retrieve the few
facts that change the next action."

## Step 5: tools change the loop

Agent papers often frame this as reasoning plus acting. ReAct is a clean
example: the model reasons, takes an action, observes the result, and updates
the next step. Toolformer explores models learning when API calls are useful.
Voyager stores reusable code skills and improves them from environment
feedback. Generative Agents uses memory, reflection, and planning to keep
behavior coherent over time.

The common idea is simple: the model is no longer only producing an answer from
static text. It can interact with something outside itself.

That changes context engineering. Tool results become new context:

- a test failure,
- a browser screenshot,
- a search result,
- a file diff,
- a database schema,
- a command error,
- a deployment log.

The harness has to decide what part of that result should be inserted back into
the prompt. Too little context and the model cannot act. Too much context and
the model loses the thread.

## Step 6: context engineering is routing

The useful mental model is a router.

The user asks for something. The bootstrap context tells the agent what sources
exist. The model or harness decides what to load. The loaded context changes the
working state. The agent acts. The result of the action becomes new context.
Then the loop continues.

For a coding bug:

- Load repo instructions.
- Inspect relevant files.
- Load debugging or frontend-testing skill.
- Run the failing command.
- Add the error output.
- Patch the smallest relevant file.
- Run verification.
- Summarize what changed.

For a research answer:

- Load source-quality rules.
- Search or open primary sources.
- Keep citations.
- Ignore unrelated memories.
- Explain uncertainty.
- Link the sources used.

For a data task:

- Load spreadsheet or plotting workflow.
- Inspect the file schema.
- Run analysis.
- Generate the chart.
- Keep generated artifacts out of git unless asked.

The model is the reasoning engine, but the harness is managing what evidence and
instructions reach that engine.

## Step 7: context can fail

Bad context engineering creates predictable failures:

- **Overload**: too much irrelevant text enters the window.
- **Missing route**: the model does not know a relevant skill exists.
- **Stale memory**: old facts override the current workspace.
- **Tool blindness**: the model guesses instead of inspecting files or logs.
- **Instruction conflict**: two loaded rules point in different directions.
- **Premature specificity**: the bootstrap overfits one workflow and blocks
  another.

The fix is not always "add more context." Often the fix is better routing:
smaller bootstrap, clearer source index, stronger retrieval criteria, and
explicit verification after tool use.

## Step 8: the practical design pattern

A good agent context system has layers:

- **Always-on rules**: safety, repo boundaries, communication style.
- **Source index**: what skills, memories, tools, and files exist.
- **Retrieval policy**: when to load each source.
- **Working context**: the small set of facts active for this task.
- **Feedback loop**: tool outputs and user corrections added back in.
- **Compaction**: summary when the context gets too large.

This is why skills should not all be pasted into the first prompt. The first
prompt should teach the agent how to find the right skill. The skill itself
should load only when relevant.

The point is not to hide information from the model. The point is to preserve
attention for the information that actually changes the next action.

## Step 9: how this connects back to latent space

The latent-space article describes prompts and skills as steering the model's
hidden state. This article describes the system around that steering.

The harness decides which text enters the model. That text changes attention,
hidden states, logits, and tool choices. A skill is one kind of steering text. A
memory is another. A test failure is another. A file diff is another.

So context engineering is not just "write a better prompt." It is:

- decide what should be visible now,
- decide what should stay retrievable but unloaded,
- decide what tool results should come back,
- decide what should be summarized,
- decide when to stop and ask the user.

Good agents are not only smarter models. They are better context loops.

## Sources behind the model

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761)
- [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)
- [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
