import type { Competition, Project } from "./work"

export const overview = {
  introduction: "I build models, simulators and the software to test them. My work spans quantitative research, scientific machine learning and robot learning.",
  interests: "Quantitative research · Research engineering · Applied ML",
  tools: "Python · C++ · JAX · PyTorch",
  results: {
    "start-hack": { order: 0, title: "QuantCo challenge", note: "Insurance pricing agents under a 60-second deadline.", context: "START Hack League Munich" },
    agenthon: { order: 1, title: "Agenthon", note: "Finance agents: explainability, forecasting, simulation and coding.", context: "NeurIPS 2026 workshop" },
    learn2design: { order: 2, title: "Learn2Design", note: "Gravitational-wave detector optimisation and a faster JAX simulator.", context: "NeurIPS 2026 competition" },
    eeg: { order: 3, title: "EEG decoding", note: "Cognitive-task decoding across sessions and participants.", context: "NeurIPS 2026 workshop" },
    fusion: { order: 4, title: "Fusion equilibrium", note: "Physics-based plasma reconstruction on CPU; neural models for DIII-D.", context: "NeurIPS 2026 competition" },
  } satisfies Record<Competition["id"], { order: number; title: string; note: string; context: string }>,
  projects: {
    "hb-capital": { order: 0, note: "Trading infrastructure, backtesting and RL environments." },
    flight: { order: 1, note: "Learned drone control and simulation. Hardware policy tests next." },
    duplex: { order: 2, note: "German speech models that listen and speak simultaneously." },
    "lecture-pilot": { order: 3, note: "Open-source tutoring from university course material." },
  } satisfies Record<Project["id"], { order: number; note: string }>,
} as const
