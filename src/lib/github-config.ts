export const USERNAME = "SebastianBoehler"
export const FETCH_REVALIDATE_SECONDS = 60 * 60
export const RECENT_REPO_LIMIT = 6

export const EXCLUDED_REPO_PATTERNS = [
  /^sebastianboehler$/i,
  /^technical-assessment/i,
  /^compute_atlas$/i,
  /^markettensor$/i,
  /^marketing/i,
  /^jurisflow$/i,
]

export const SUMMARY_OVERRIDES: Record<string, string> = {
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
