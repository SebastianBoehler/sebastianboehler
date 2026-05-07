export const USERNAME = "SebastianBoehler"
export const RECENT_REPO_LIMIT = 6
export const EXCLUDED_REPO_PATTERNS = [
  /^sebastianboehler$/i,
  /^technical-assessment/i,
  /^compute_atlas$/i,
  /^markettensor$/i,
  /^marketing/i,
  /^jurisflow$/i,
]

export const SUMMARY_OVERRIDES = {
  "agent-cli-utils":
    "Fast Go CLIs for AI agent workflows, including dependency diagnostics and deterministic file-editing utilities.",
  physics_researcher:
    "Production-minded software for autonomous materials and peptide research with typed orchestration, simulator adapters, and experiment tracking.",
  yieldpilot:
    "ACP-backed treasury operations layer for stablecoin management, wallet automation, and approval flows.",
  "tue-api-wrapper":
    "Python tooling that layers cleaner navigation, search, and summarization on top of Alma and ILIAS.",
  "stuttgart-pulse":
    "Map-first open-source explorer for Stuttgart mobility and air-quality data.",
  "tue-cli":
    "Interactive terminal tooling for Tübingen university workflows with menu-driven navigation and colorized output.",
}

export const CURRENT_FOCUS_ITEMS = [
  {
    label: "Research software",
    description:
      "evaluating LLM fine-tuning, next-turn prediction, dialogue rollouts, and autonomous experiment loops",
  },
  {
    label: "Agent tooling",
    description:
      "building fast Go CLIs for AI-assisted development workflows, dependency diagnostics, and deterministic file editing",
  },
  {
    label: "University tooling",
    description:
      "building practical interfaces around Alma, ILIAS, study workflows, and public data products",
  },
]

export const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})
