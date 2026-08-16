export type WorkItem = {
  id: "flightrl" | "hb-capital" | "dialogue-research" | "lecture-pilot"
  name: string
  title: string
  summary: string
  evidence: string
  boundary: string
  links: readonly { label: string; href: string }[]
}

export const selectedWork: readonly WorkItem[] = [
  {
    id: "flightrl",
    name: "Sunderlabs / FlightRL",
    title: "Training compact policies before they reach real hardware.",
    summary: "High-throughput native environments, privileged teachers, edge-shaped policies, telemetry, and staged gates.",
    evidence: "FlightRL repository and Sunderlabs research program.",
    boundary: "Learned navigation is pre-deployment research, not live-control authority.",
    links: [{ label: "Explore Sunderlabs", href: "https://sunderlabs.com" }],
  },
  {
    id: "hb-capital",
    name: "HB Capital",
    title: "Keeping market claims attached to their evidence.",
    summary: "Market structure, positioning, macro context, native research tooling, and read-only account context.",
    evidence: "HB Capital's live research workspace.",
    boundary: "Research access grants no trading authority.",
    links: [{ label: "Explore HB Capital", href: "https://hb-capital.app" }],
  },
  {
    id: "dialogue-research",
    name: "Dialogue research",
    title: "Testing whether smaller language models can predict what users say next.",
    summary: "QLoRA next-turn prediction with multi-step dialogue rollout evaluation.",
    evidence: "Peer-reviewed IEEE proceedings paper.",
    boundary: "The publication supports its reported experiments, not broader model-performance claims.",
    links: [{ label: "Read the paper", href: "https://doi.org/10.1109/ICETSIS68266.2026.11549360" }],
  },
  {
    id: "lecture-pilot",
    name: "LecturePilot",
    title: "Turning private course material into controlled learning workspaces.",
    summary: "Professor-owned sources, enforced unlocks, typed tutor capabilities, and learner-owned work.",
    evidence: "LecturePilot's working source-grounded course system.",
    boundary: "Live-pilot status is not production-security or learning-efficacy approval.",
    links: [{ label: "View the repository", href: "https://github.com/SebastianBoehler/lecture-pilot" }],
  },
]
