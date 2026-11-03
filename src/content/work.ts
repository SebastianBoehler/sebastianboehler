export type Link = { label: string; href: string }

export type Figure = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export type Competition = {
  id: "agenthon" | "fusion" | "learn2design" | "eeg"
  name: string
  venue: string
  /** Official placing, or the current status while a competition is still running. */
  result: string
  /** One line for the /neurips page. */
  short: string
  summary: string
  figure?: Figure
  links: readonly Link[]
}

export type Publication = {
  title: string
  venue: string
  year: number
  links: readonly Link[]
}

export type Project = {
  id: "flight" | "duplex" | "hb-capital" | "lecture-pilot"
  name: string
  context: string
  summary: string
  status: string
  /** Hardware flight footage goes here once the policy has flown; nothing renders until then. */
  video?: { src: string; poster: string; caption: string }
  links: readonly Link[]
}

export const competitions: readonly Competition[] = [
  {
    id: "agenthon",
    name: "Agenthon 2026",
    venue: "Quant-finance agent competition, Stony Brook University · workshop at NeurIPS 2026",
    result: "2nd of 63, Explainability track · 6th of 87 Forecasting · 6th of 55 Simulation · 17th of 61 Coding",
    short: "Quant-finance agents in four tracks, with my team Proof of Alpha.",
    summary:
      "Four tracks that test whether AI agents produce finance outputs that hold up under automated evaluation: coding, forecasting, simulation and explainability. In the explainability track, the agent predicts a label, value or ordering from a table and text evidence, and has to ground its reasons in exact quotes from that evidence. I took part with my team, Proof of Alpha.",
    links: [{ label: "Final leaderboard", href: "https://www.agenthon.net/#leaderboard" }],
  },
  {
    id: "fusion",
    name: "Fusion Equilibrium Challenge",
    venue: "NeurIPS 2026 competition",
    result: "16th of 46 on zero-shot transfer to MAST · 19th of 58 on DIII-D",
    short: "Tokamak plasma equilibria. For MAST, a free-boundary Grad–Shafranov solve per shot on CPU, without machine learning.",
    summary:
      "The task is to reconstruct the magnetic equilibrium of a tokamak plasma from its diagnostics. For MAST no equilibrium labels were allowed, so instead of training a model I solved the free-boundary Grad–Shafranov equation for each of the 1,205 test shots, on CPU, from measured coil currents, the passive vessel structure and Thomson-scattering temperature profiles. For DIII-D I used an ensemble of residual MLPs.",
    figure: {
      src: "/research/fusion-equilibrium.png",
      width: 1080,
      height: 1350,
      alt: "Poloidal flux contours inside the last closed flux surface of a MAST plasma, with coils and passive structure drawn around it.",
      caption: "Predicted equilibrium for an anonymised MAST test shot. Black: last closed flux surface; coloured: normalised flux; dashed: vacuum flux.",
    },
    links: [
      { label: "Code and write-up", href: "https://github.com/SebastianBoehler/fusion-equilibrium-challenge" },
      { label: "Final results", href: "https://fusion-equilibrium-challenge.sophelio.io/results/" },
    ],
  },
  {
    id: "learn2design",
    name: "Learn2Design 2026",
    venue: "NeurIPS 2026 competition",
    result: "13th of 110 in the final round",
    short: "Gravitational-wave detector design in JAX. Technical report submitted; winners are announced on 11 December.",
    summary:
      "Optimizers that design gravitational-wave detector interferometers in a differentiable simulator. I worked in JAX and built differometor-fast, a faster backend for the simulator. I submitted a technical report on 29 October; winners are announced on 11 December. A follow-up paper is in progress.",
    links: [
      { label: "Official leaderboard", href: "https://github.com/artificial-scientist-lab/Learn2Design-2026/blob/main/competition_data/round4/leaderboard.csv" },
      { label: "Competition", href: "https://github.com/artificial-scientist-lab/Learn2Design-2026" },
    ],
  },
  {
    id: "eeg",
    name: "EEG/EMG Foundation Challenge 2026, Track 2",
    venue: "NeurIPS 2026 Brain & Body Workshop",
    result: "Sealed final phase, 5–21 November",
    short: "Decoding cognitive tasks from EEG across sessions and participants.",
    summary:
      "Decoding cognitive tasks from EEG across sessions and participants. Results follow after the final phase closes.",
    links: [{ label: "Challenge website", href: "https://neural-interfaces26.github.io/" }],
  },
]

export const publications: readonly Publication[] = [
  {
    title: "QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step Dialogue Rollouts",
    venue: "IEEE ICETSIS 2026, pp. 1548–1555",
    year: 2026,
    links: [{ label: "DOI 10.1109/ICETSIS68266.2026.11549360", href: "https://doi.org/10.1109/ICETSIS68266.2026.11549360" }],
  },
]

export const grants = [
  "EuroHPC AI Factory compute: two awards of 5,000 GPU-hours each on Leonardo (CINECA), one for the speech agent below and one for follow-up research on Learn2Design.",
] as const

export const projects: readonly Project[] = [
  {
    id: "flight",
    name: "Learned flight control",
    context: "Sunderlabs",
    summary:
      "Small learned policies for the Crazyflie nano-quadcopter. The policy proposes bounded velocity setpoints, while the onboard estimator and safety layer stay in charge.",
    status: "Simulation so far; first hardware flights are next.",
    links: [{ label: "Sunderlabs", href: "https://sunderlabs.com" }],
  },
  {
    id: "duplex",
    name: "German full-duplex voice agent",
    context: "Sunderlabs",
    summary:
      "A voice agent that listens and speaks at the same time, handles interruptions and can use tools, in German. It runs on a EuroHPC AI Factory compute award on Leonardo BOOSTER.",
    status: "Early-stage research.",
    links: [{ label: "Sunderlabs", href: "https://sunderlabs.com" }],
  },
  {
    id: "hb-capital",
    name: "HB Capital",
    context: "Co-founder",
    summary: "Market-structure tooling, backtesting and reinforcement-learning environments for trading research.",
    status: "Since 2023.",
    links: [{ label: "hb-capital.app", href: "https://hb-capital.app" }],
  },
  {
    id: "lecture-pilot",
    name: "LecturePilot",
    context: "Open source",
    summary: "A tutor for university lectures that works from the course's own material.",
    status: "Prototype.",
    links: [{ label: "Repository", href: "https://github.com/SebastianBoehler/lecture-pilot" }],
  },
]
