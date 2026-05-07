import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fetchContributionYear } from "./lib/github-contribution-data.mjs"
import { ensureGhAuth, runGhRestJson, runGhRestText } from "./lib/github-gh-client.mjs"
import {
  EXCLUDED_REPO_PATTERNS,
  RECENT_REPO_LIMIT,
  SUMMARY_OVERRIDES,
  USERNAME,
} from "./lib/github-profile-config.mjs"
import { buildReadme, renderContributionSvg } from "./lib/github-profile-render.mjs"

function stripMarkdown(value) {
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

function isExcludedRepoName(name) {
  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(name))
}

function isExcludedRepo(repo) {
  return repo.fork || repo.archived || isExcludedRepoName(repo.name)
}

function isUsefulSummary(summary) {
  return Boolean(summary && summary.length >= 18)
}

function extractSummaryFromReadme(readme) {
  const lines = readme.split(/\r?\n/)
  const paragraphs = []
  let currentParagraph = []
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

async function fetchReadmeSummary(repo) {
  const branchesToTry = [repo.default_branch, "main", "master"].filter(Boolean)

  for (const branch of [...new Set(branchesToTry)]) {
    try {
      const readme = await runGhRestText(`repos/${USERNAME}/${repo.name}/readme`, [
        "-H",
        "Accept: application/vnd.github.raw+json",
        "-f",
        `ref=${branch}`,
      ])
      const summary = extractSummaryFromReadme(readme)
      if (summary) {
        return summary
      }
    } catch (error) {
      if (!String(error.message).includes("404")) {
        throw error
      }
    }
  }

  return null
}

async function buildRepoCards(repos) {
  const cards = []

  for (const repo of repos.filter((item) => !isExcludedRepo(item))) {
    let summary = SUMMARY_OVERRIDES[repo.name] ?? stripMarkdown(repo.description ?? "")
    if (!isUsefulSummary(summary)) {
      summary = await fetchReadmeSummary(repo)
    }

    if (isUsefulSummary(summary)) {
      cards.push({
        name: repo.name,
        url: repo.html_url,
        summary,
        language: repo.language ?? "Code",
        stars: repo.stargazers_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
      })
    }
  }

  return cards
}

function pickRecentRepos(cards) {
  return [...cards]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, RECENT_REPO_LIMIT)
}

async function main() {
  await ensureGhAuth()

  const [profile, repos] = await Promise.all([
    runGhRestJson(`users/${USERNAME}`),
    runGhRestJson(`users/${USERNAME}/repos?per_page=100&sort=updated`),
  ])
  const candidateRepos = repos
    .filter((repo) => !isExcludedRepo(repo))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 24)
  const recent = pickRecentRepos(await buildRepoCards(candidateRepos))
  const startYear = new Date(profile.created_at).getUTCFullYear()
  const endYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: endYear - startYear + 1 }, (_, offset) =>
      fetchContributionYear({ username: USERNAME, year: startYear + offset })
    )
  )

  await mkdir(path.resolve("assets"), { recursive: true })
  await writeFile(path.resolve("assets/github-contributions-all-years.svg"), renderContributionSvg(contributionYears, "dark"))
  await writeFile(path.resolve("assets/github-contributions-all-years-dark.svg"), renderContributionSvg(contributionYears, "dark"))
  await writeFile(path.resolve("assets/github-contributions-all-years-light.svg"), renderContributionSvg(contributionYears, "light"))
  await writeFile(path.resolve("README.md"), buildReadme({ profile, recent, contributions: contributionYears }))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
