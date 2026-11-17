# Research behind the skills suite

The suite helps users and agents work out the goal together, then gives the agent a way to check
what it delivers. The agent reads authoritative requirements, challenges assumptions inherited from
earlier work, and proposes measurable checks. The user resolves consequential trade-offs and
approves departures from agreed goals or constraints within their authority. The agent can continue
authorized work while those decisions are open. The research below informs this design choice.

## 3–17 November 2026

This targeted scan uses arXiv v1 submission dates and the publication date for first-party reports.
Most of the papers are preprints. Their results apply to the tasks, models, and conditions studied.

| Failure mode | Findings | Suite implication |
| --- | --- | --- |
| The agent endorses a preferred claim despite contrary evidence. | Yang et al. observed that most of the measured sycophancy was already present at supervised fine-tuning checkpoints across three model families and three benchmarks. In the earlier SPINE benchmark, every tested model conceded more often under longer simulated pushback. These studies establish a failure mode under their conditions. [Yang et al., 5 Nov.](https://arxiv.org/abs/2611.10045v1) [Tang et al., 8 Sept.](https://arxiv.org/abs/2609.09090v1) | Respect the user's preferences. Verify factual claims independently, including the agent's own. State conflicting evidence and the check that could change the answer. Evaluate resistance to unsupported pressure and willingness to update when evidence changes. |
| The agent settles on an interpretation while user preferences are still open. | *Ask Precisely, Assume Wisely* uses simulated users with fixed preferences across ambiguous question answering, semantic parsing, and data visualization. Models that guessed more made more incorrect assumptions. Models that asked more tended to repeat questions or ask about irrelevant details. Optimized prompts improved measured interaction efficiency with broadly similar task accuracy. [Dutta et al., 13 Nov., §§2–4](https://arxiv.org/html/2611.18905v1) | Ask early when an answer would change the objective, binding scope, or approach. Resolve facts from available sources and record open choices while independent work continues. |
| Intent gets lost between clarification and completion. | In a simulated workplace with 101 real-repository assignments, the two leading SWE-CoWork models passed about 63% of tests for new behavior and completed fewer than 8% of assignments. In the Claude Opus 5.5 trajectory analysis, 255 of 826 requirements reported complete failed their corresponding tests. Supplying complete requirements upfront improved partial scores for two tested models, with no change in their full completion rates. [Lei et al., 15 Nov., §§5–6](https://arxiv.org/html/2611.20218v1) | Keep the current requirement, unresolved question, and acceptance evidence together. Carry user corrections into the plan, checks, and delegated work. |
| Tests confirm an implementation while missing intended behavior. | ADAPT ran generated tests on both revisions of 426 real pull requests. GPT-4o produced a fail-to-pass test for 62.0% of pull requests, versus 35.4% for the prior method. Spec-Driven PBT derived properties from the written specification before inspecting the implementation. On 25 ViBench apps, almost 60% of the 169 bugs found by the two testing approaches were unique to one approach. Both studies evaluated test generation. [Haratian et al., 11 Nov.](https://arxiv.org/abs/2611.16114v1) [Shukla et al., 11 Nov.](https://arxiv.org/abs/2611.15920v1) | Express expected behavior before implementation when practical. For a change to behavior, observe a focused test fail for the expected reason, then pass after the change. Retain existing regression checks. |
| A partial score conceals a failed requirement. | ExpertCrowd-SWE uses mostly executable criteria and mandatory blockers for 100 expert-authored tasks. The authors calibrated graders against reference solutions, untouched repositories and inert changes. For 80 tasks, no model earned full credit on all five runs. The authors selected difficult tasks, so the observed rates describe that set. [Vrdoljak et al., 9 Nov.](https://arxiv.org/abs/2611.13246v1) | Give each binding requirement its own check. Treat a failed requirement as unresolved even if most other checks pass. Verify that important checks reject an incorrect or unchanged result. |
| An autonomous loop promotes noise as progress. | On three benchmarks and two models, TRUST reduced the reported share of inferior accepted updates from 45.59% with a greedy validation-score rule to 2.78%. The authors use online statistical testing, and the guarantees depend on their assumptions. [Gao et al., 7 Nov.](https://arxiv.org/abs/2611.10787v1) | Require evidence commensurate with the noise and number of trials. Confirm a selected candidate against an independent test before claiming improvement. |
| Research teams lose decision context or miss errors. | In three synchrotron experiments under evolving human-defined objectives, 59–68% of recorded corrections involved multiple participants. Human inspection caught a mismatch between a configured sampling step and the actual measurement grid. The result describes one deployment with three experiments and a transcript-based audit. [Luthra et al., 6 Nov., §§2.2, 3.2.2, 4.1](https://arxiv.org/html/2611.12933v1) | Track consequential decisions, their evidence, and who can change them. Show evidence the user can inspect. Check the delivered effect in the target environment. |
| More agents add cost, duplicate work, or fail at integration. | WorkflowArena uses hidden verification of integrated deliverables on 145 tasks across eight domains. No tested configuration led across all domains. MultiLoop improved a DeepSearchQA harness in one case study while many coordination failures persisted. In the s³ exploration tests, agents trained to communicate reduced repeated work by nearly 50% and exceeded the best-of-N baseline by up to 9.4 percentage points. [Jiang et al., 9 Nov.](https://arxiv.org/abs/2611.12856v1) [Gottesman et al., 11 Nov., §§3–4](https://arxiv.org/html/2611.15754v1) [Jha et al., 5 Nov.](https://arxiv.org/abs/2611.08615v1) | Delegate work with clear scope, ownership, shared constraints, and a check for the integrated result. Compare teams with one agent using a comparable budget before attributing gains to coordination. |
| Automated coverage misses something the reader values. | In a TREC RAG 2026 team report, the system favored by human readers in one evaluation batch had lower automated coverage than other submissions. A different system led human preference in the second batch. [RMIT-ADM+S, 12 Nov.](https://arxiv.org/abs/2611.16425v1) | Verify source support for material claims and check audience, meaning, and wording when those require judgment. |

## Recovering the allowed solution space

An idea basin is a family of functionally similar solutions. Measure it from the approach and the
resulting artifacts. A first-party AutoResearchExam analysis found that 47% of runs spent the full
24 hours in their first basin. New-method steps correlated with greater early gains. The study grouped
methods from generated code using model judgments and did not assign agents to alternate search
policies. *Continual AutoResearch* compared matched streams across nine task families. Persistent state
helped five agents find strong solutions sooner **across tasks**, with inconsistent improvement in
final held-out results. [Bespoke Labs, 10 Nov.](https://bespokelabs.ai/blog/how-models-explore-ideas)
[Qin et al., 3 Nov.](https://arxiv.org/abs/2611.05108v1)

Earlier controlled studies tested ways to reopen a search **within a task**. *Fork-and-Flush* started
fresh chats from the incumbent workspace and selected a continuation. With matched compute on 13
tasks, its normalized average score was 0.78, compared with 0.47 for one continuous run and 0.54 for
four independent runs. On an 11-task subset, fresh context without forking also improved on a
continuous session, and combining both did best. *Scaling Discovery Requires Forgetting* removed candidate and workspace
history from the search, restarting from the best candidate. Over four tasks it reported gains of
up to 15% over parallel agents. *AutoMIP* instead kept an idea pool and a tree of executable states so
the agent could resume from a compatible earlier candidate when it switched methods. Its evidence
comes from mixed-integer optimization tasks. These studies test different retained state and tasks.
[Cai et al., 5 Oct., Tables 1–2](https://arxiv.org/html/2610.07447v1)
[Tan et al., 14 Oct.](https://arxiv.org/abs/2610.20563v1)
[Wu et al., 30 Sept., v2 §§3–4](https://arxiv.org/html/2609.39360v2)

The same issue can begin before an experiment. *Clarification Is Not Correction* gave two Gemini 2.5
models equivalent writing, planning, and coding information in different orders. The order changed
outcomes, especially in coding, and tested prompting and memory changes did not consistently recover
success. The practical implication is to rebuild the affected plan, checks, and artifacts when a
clarification invalidates an early reading. [Lin et al., 21 Sept.](https://arxiv.org/abs/2609.25337v1)

In this suite, trace proposed restrictions to the authoritative source, an agreed decision, or a
working assumption. If an assumption excludes viable methods, reopen it before further tuning.
When repeated work produces little new evidence, state what assumption a different method would test,
return to the earliest valid artifact or a fresh brief as appropriate, and run the smallest decisive
comparison. Preserve the evaluator, binding constraints, best validated artifact, and audit history.
Check whether the new method actually changed and whether its results hold under a comparable budget.
This procedure is a design inference from the studies above.

One way to prompt this behavior is to give the agent a decision to make with evidence:

> Read the governing rules and current results. Show which constraints come from the rules and
> which assumptions came from the current approach. If a missing priority would change the next
> experiment, ask me before committing. Identify the bottleneck from the evidence. Compare the best
> next refinement with a genuinely different mechanism. Propose the smallest matched check and
> say what result would make you continue, switch, or stop.

## Earlier work that informs the design

- **Autoresearch and Parameter Golf.** Karpathy's autoresearch gives the agent `train.py` to edit,
  with a fixed five-minute training budget and validation bits per byte measured by `prepare.py`.
  The human edits `program.md`, which directs the search. OpenAI's Parameter Golf used a 16 MB
  artifact cap and a ten-minute budget on 8×H100s. Organizers independently reproduced record-track
  submissions and reported that agents sometimes copied invalid approaches with strong scores.
  These examples motivate explicit edit boundaries and independent verification before promoting an
  experimental result. Neither project provides a controlled comparison of oversight policies.
  [Karpathy's autoresearch](https://github.com/karpathy/autoresearch)
  [OpenAI's 12 May results](https://openai.com/index/what-parameter-golf-taught-us/)
- **Human involvement in ideation.** *Aligning Autoresearch* reports that human direction matters
  especially during benchmark ideation and that agents struggle to locate ways a measured score
  was gamed. Its evidence comes from benchmark creation and the authors' HackBench tasks. It
  motivates asking users to resolve which hypotheses and constraints matter when the choice changes
  the study. [Li et al., 28 Oct.](https://arxiv.org/abs/2610.38882v1)
- **Test-driven development.** Fucci et al. analyzed 82 observations from 39 software professionals.
  Small, steady iterations had a stronger association with functional correctness and productivity
  than test sequencing. A family of 12 experiments also found task-dependent results. Test-first is
  the suite owner's preferred workflow where it yields useful evidence. Recent agent test-generation
  studies above provide evidence for checking the test itself, and the broader productivity effect
  of this suite remains unmeasured. [Fucci et al., 2016](https://arxiv.org/abs/1611.05994)
  [Santos et al., 2020](https://arxiv.org/abs/2011.11942)
- **Profile the bottleneck and verify the full workload.** On KernelBench, AutoProfiler found that
  selecting counters for the kernel improved optimization over a fixed collection strategy under
  limited profiling budgets. KernelOPT verified numerical correctness across seeds and retested the
  integrated model. Its H200 results varied by task level. UnitSight demonstrates that aggregate
  counters can obscure per-unit behavior in a study of NVIDIA hardware performance models. These
  results motivate collecting the counters that distinguish competing bottlenecks, then measuring
  representative end-to-end workloads at matched precision and correctness.
  [Wang et al., 27 Oct.](https://arxiv.org/abs/2610.36576v1)
  [Poddar et al., 24 Sept., v2](https://arxiv.org/abs/2609.30059v2)
  [Wang et al., 10 Nov.](https://arxiv.org/abs/2611.13762v1)
- **Claim support and author voice.** An analysis of three open-source deep research systems found
  citation and faithfulness errors introduced during agent handoffs. A human–AI creative writing
  experiment with 333 participants found that the human planning role increased story diversity
  while maintaining the AI-level creativity measured in that study. A separate co-writing study
  found that personalization from a writing sample partly restored perceived ownership. These
  findings motivate retaining source passages through synthesis and taking the author's purpose and
  samples as guidance where available. Story diversity and perceived ownership are different
  outcomes, and neither result measures scientific fidelity.
  [Hirsch et al., Aug.](https://arxiv.org/abs/2608.24306v1)
  [Li et al., Oct.](https://arxiv.org/abs/2610.37916v2)
  [Zhang et al., Jan.](https://arxiv.org/abs/2601.10236)
- **Skill selection and evaluation.** SkillsBench v4 reports a 16.6 percentage-point average gain
  for curated skills across 87 tasks and 18 model–harness configurations. SWE-Skills-Bench v2 found
  no statistically significant effect for 92 of 98 public skills, with some harmful skills overriding
  task instructions. WebDev-Skills-Bench found lower average pass rates and higher token costs from
  injecting matched web skills. Conditions and skill selection differed across studies. These results
  favor short skill entry points, task-specific routing, and paired local measurement.
  [SkillsBench v4](https://arxiv.org/abs/2602.12670v4)
  [SWE-Skills-Bench v2](https://arxiv.org/abs/2603.15401v2)
  [WebDev-Skills-Bench](https://arxiv.org/abs/2608.23067v1)

## How to evaluate a revision

Choose realistic cases and score their deliverables using the same model, tools, starting artifacts,
and budget. Compare the previous suite, the revision, and a run without the relevant skill when
measuring its incremental value. Score outputs without revision labels when practical. Keep some
cases out of prompt development and repeat runs for outcomes that vary between attempts.

| Outcome | Check |
| --- | --- |
| Intent stays intact. | Use a case with an ambiguous goal, an authoritative rule, an inherited assumption, and a mid-task correction. Check which questions the agent raises and whether the correction reaches the deliverable and its checks. Count unresolved binding requirements and unauthorized deviations. |
| Conclusions track evidence. | Give the agent a preferred interpretation contradicted by existing measurements. Follow up with unsupported pushback, then valid new evidence. Score whether the agent preserves the evidentiary standard and updates when new measurements support a different conclusion. |
| Completion is verifiable. | Check every claimed completion against its evidence. For changed software behavior, check failure on the baseline, success on the relevant revision, and relevant regression results. Count false completion claims and missing evidence. |
| Autoresearch explores viable methods and produces valid candidates. | Give the agent an incumbent whose representation closes off a viable alternative. Check whether it reopens the assumption and can show a tested mechanism change with binding checks intact. Compare held-out results under matched budgets. Track time or trials to a valid candidate, rerun agreement, and invalid candidates promoted. |
| Performance reflects a measured bottleneck and user-visible gain. | Compare the same workload, hardware, and quality threshold. Inspect the profile and repeat the end-to-end measurement. Report isolated kernel speed separately. |
| Delegation pays for itself. | Compare integrated acceptance, elapsed time, and compute cost with one agent. Count duplicated work, handoff losses, and unverified worker claims. |
| Research and writing preserve source meaning. | Audit the cited passages for a fixed set of claims. Score fidelity to the author's intended meaning and terminology against the brief or author feedback. Track unsupported claims and material changes in meaning. |
| The demo proves the intended outcome. | Run the critical path with the target environment and exact submission artifact. Check official rules, visible evidence, and rehearsal time against the event limit. |

Agree on thresholds for the task and require evidence for each binding condition. Use partial scores
to diagnose failure. Report run counts, scope, costs, and checks that remain open. Formatting and
link checks can establish release integrity. Claims about better agent behavior require outcome data.
