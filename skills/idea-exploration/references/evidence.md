# Evidence and learning notes

## 2026-11-23: initial version

**Origin:** owner request to replace the third-party Superpowers brainstorming skill with one in this
suite that helps agents navigate distinct idea basins. Version 0.1.0 is a design built from the
sources below. It has not been behaviorally evaluated; it does not establish better ideas or decisions.
Sources were read on their arXiv abstract or HTML pages; most are preprints, and results apply to the
tasks, models, and conditions studied. Numbers are the authors' reported values.

## Homogenization: why breadth needs structure

- [Si et al., *Can LLMs Generate Novel Research Ideas?*, 6 Sept. 2024](https://arxiv.org/abs/2409.04109),
  §3.2: of 4,000 seed ideas per NLP topic, about 200 (5%) remained after embedding deduplication at
  cosine 0.8, and new unique ideas plateaued. One agent and topic family; threshold chosen by the authors.
- [Jiang et al., *Artificial Hivemind*, 27 Oct. 2025](https://arxiv.org/abs/2510.22954), §3: with 50
  samples per open-ended query, 79% of queries had average pairwise similarity above 0.8; answers from
  different models averaged 0.71–0.82 similarity. Chat queries, not research ideas.
- [Zhang et al., *NoveltyBench*, 7 Apr. 2025](https://arxiv.org/abs/2504.05228): frontier models
  produced roughly 2–3 functionally distinct answers in 10 samples. Asking for a different answer with
  earlier answers in context helped most; paraphrasing the prompt helped marginally.
- [He et al., *Beneath the Diff*, 31 Aug. 2026](https://arxiv.org/abs/2609.00077): autoresearch loops
  edited different lines while repeating the same kind of algorithmic change. Tracking change categories
  with a persistent edit memory and validation gate reduced that collapse in their setting.
- [Anderson et al., 2 Feb. 2024](https://arxiv.org/abs/2402.01536) and
  [Doshi and Hauser, 1 Dec. 2023](https://arxiv.org/abs/2312.00506): LLM assistance made ideas or
  stories across people more similar, even where individual outputs were rated better.

## Interventions

- [Ibrahim et al., *Anchorless Diversification*, 28 May 2026](https://arxiv.org/abs/2605.30150v1):
  planning five distinct directions, then generating across them, gave the best measured trade-off of
  diversity, quality, and compute among the tested methods; it reached the reference diversity in 7.4
  outputs versus 17.9 for a divergence instruction alone. Stories, alternative uses, and slogans with
  automated quality proxies.
- [Meincke, Mollick and Terwiesch, 27 Jan. 2024](https://arxiv.org/abs/2402.01727): across 35 prompts
  for GPT-4 product ideas, a chain-of-thought prompt (draft many short ideas, make them bold and
  different, then develop them) was among the most diverse; human groups were still more diverse.
- [Deng, Brucks and Toubia, v2 2 Nov. 2026](https://arxiv.org/abs/2602.20408v2): personas plus
  chain-of-thought produced more unique category combinations than humans or default prompting;
  personas alone increased fixation on earlier ideas. Diversity only; quality not measured.
- [Shen et al., 11 May 2026](https://arxiv.org/abs/2605.11258): cross-domain analogies by shared
  relational structure raised solution diversity on scientific problems. Abstract-level verification.
- [Lu et al., NeoCoder denial prompting, 12 Jul. 2024](https://arxiv.org/abs/2407.09007), Table 3:
  banning the previous solution's techniques raised GPT-4's share of novel techniques from 4.5% to
  15.3% while correctness fell from 16.2% to 0%. Forced constraints need a feasibility check.
- [Chen et al., 20 Apr. 2026](https://arxiv.org/abs/2604.18005v2): in multi-agent research
  ideation, diversity per agent fell as groups grew and dense communication accelerated convergence.
- [Bradley et al., QDAIF, 19 Oct. 2023](https://arxiv.org/abs/2310.13032): keeping the best output per
  region of a diversity archive outperformed non-quality-diversity baselines; axes were hand-chosen and
  top quality scores were partly reward-hacked.

## Judging and selection

- [Sinhahajari et al., 10 Jun. 2026](https://arxiv.org/abs/2606.12071): LLM judges overrated the
  novelty of generated research questions, and domain experts preferred the questions authors pursued.
  [Schopf et al., 26 Aug. 2026](https://arxiv.org/abs/2608.25660) report a bias toward "medium novel".
- [Shahid et al., 27 Jun. 2025](https://arxiv.org/abs/2506.22026): literature-grounded novelty checks
  agreed better with experts than earlier automated approaches.
- [Bao et al., 6 Jun. 2026](https://arxiv.org/abs/2606.08251): with 6,749 scientists rating ideas
  from their own papers, models rarely proposed null hypotheses and scientists favored ideas like their
  own. Abstract-level verification.
- [Si et al., 2024](https://arxiv.org/abs/2409.04109), §3.3, §7.2: a pairwise tournament separated
  accepted from rejected papers in a sanity check, but the first author's reranking matched only 17 of
  49 of the AI ranker's picks. [Si et al., *The Ideation-Execution Gap*, 25 Jun. 2025](https://arxiv.org/abs/2506.20803):
  after execution, LLM ideas' scores dropped more than human ideas'. Cheap execution evidence should
  inform the final choice.
- [Xu et al., *DivAlign*, 30 Jul. 2026](https://arxiv.org/abs/2607.28087): conditioning directions on
  each researcher's profile reduced community-wide similarity while keeping measured fit.

## Not adopted

Higher temperature, model switching, or adding agents as the main source of breadth: the studies above
found limited gains. Diversity quotas and novelty for its own sake: options are compared on the user's
criteria, and a basin stays open only while a credible reason remains.
