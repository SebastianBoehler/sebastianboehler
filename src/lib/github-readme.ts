import { SUMMARY_OVERRIDES } from "@/lib/github-config"
import type { GitHubRepo, RepoCard } from "@/lib/github-types"

export function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[:;,-]\s*$/, "")
}

export function isUsefulSummary(summary: string | null) {
  return Boolean(summary && summary.length >= 18)
}

export function extractSummaryFromReadme(readme: string) {
  const lines = readme.split(/\r?\n/)
  const paragraphs: string[] = []
  let currentParagraph: string[] = []
  let inCodeBlock = false

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      continue
    }

    if (!line) {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(" "))
        currentParagraph = []
      }
      continue
    }

    if (
      line.startsWith("#") ||
      line.startsWith("[![") ||
      line.startsWith("![") ||
      line.startsWith("|") ||
      line.startsWith("<!--") ||
      /^[-*]\s/.test(line) ||
      /^\d+\.\s/.test(line)
    ) {
      continue
    }

    currentParagraph.push(line)
  }

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "))
  }

  for (const paragraph of paragraphs) {
    if (/[:;]\s*$/.test(paragraph)) {
      continue
    }

    const summary = stripMarkdown(paragraph)
    if (isUsefulSummary(summary)) {
      return summary
    }
  }

  return null
}

export async function buildRepoCards(
  repos: GitHubRepo[],
  fetchReadmeSummary: (repo: GitHubRepo) => Promise<string | null>
) {
  const cards: RepoCard[] = []

  for (const repo of repos) {
    let summary: string | null = SUMMARY_OVERRIDES[repo.name] ?? stripMarkdown(repo.description ?? "")

    if (!isUsefulSummary(summary)) {
      summary = await fetchReadmeSummary(repo)
    }

    if (!isUsefulSummary(summary)) {
      continue
    }

    cards.push({
      name: repo.name,
      url: repo.html_url,
      summary: summary ?? "",
      language: repo.language ?? "Code",
      stars: repo.stargazers_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    })
  }

  return cards
}

export function pickRecentRepos(cards: RepoCard[], limit: number) {
  return [...cards]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit)
}
