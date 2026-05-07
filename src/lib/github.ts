import {
  EXCLUDED_REPO_PATTERNS,
  FETCH_REVALIDATE_SECONDS,
  RECENT_REPO_LIMIT,
  USERNAME,
} from "@/lib/github-config"
import { buildRepoCards, extractSummaryFromReadme, pickRecentRepos } from "@/lib/github-readme"
import type {
  ContributionYear,
  GitHubProfile,
  GitHubRepo,
  GitHubSnapshot,
} from "@/lib/github-types"

export type {
  ContributionCell,
  ContributionYear,
  GitHubProfile,
  GitHubSnapshot,
  RepoCard,
} from "@/lib/github-types"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sebastianboehler-portfolio",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: API_HEADERS,
    next: { revalidate: FETCH_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`GitHub JSON fetch failed: ${response.status} ${url}`)
  }

  return response.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: API_HEADERS,
    next: { revalidate: FETCH_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    throw new Error(`GitHub text fetch failed: ${response.status} ${url}`)
  }

  return response.text()
}

function isExcludedRepoName(name: string) {
  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(name))
}

function isExcludedRepo(repo: GitHubRepo) {
  return repo.fork || repo.archived || isExcludedRepoName(repo.name)
}

async function fetchReadmeSummary(repo: GitHubRepo) {
  const branchesToTry = [repo.default_branch, "main", "master"].filter(Boolean)

  for (const branch of Array.from(new Set(branchesToTry))) {
    try {
      const readme = await fetchText(
        `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/${branch}/README.md`
      )
      const summary = extractSummaryFromReadme(readme)
      if (summary) {
        return summary
      }
    } catch (error) {
      if (!String(error).includes("404")) {
        throw error
      }
    }
  }

  return null
}

function getYearBounds(year: number) {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const firstSunday = new Date(yearStart)
  firstSunday.setUTCDate(firstSunday.getUTCDate() - firstSunday.getUTCDay())
  return { firstSunday }
}

async function fetchContributionYear(year: number): Promise<ContributionYear> {
  const html = await fetchText(
    `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`
  )
  const totalMatch = html.match(new RegExp(`([\\d,]+)\\s+contributions?\\s+in\\s+${year}`))
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0
  const { firstSunday } = getYearBounds(year)
  const cells = Array.from(
    html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g),
    (match) => {
      const date = match[1]
      const level = Number(match[2])
      const cellDate = new Date(`${date}T00:00:00Z`)
      const diffDays = Math.floor((cellDate.getTime() - firstSunday.getTime()) / 86_400_000)

      return {
        date,
        week: Math.floor(diffDays / 7),
        day: cellDate.getUTCDay(),
        level,
      }
    }
  )

  return { year, total, cells }
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const [profile, repos] = await Promise.all([
    fetchJson<GitHubProfile>(`https://api.github.com/users/${USERNAME}`),
    fetchJson<GitHubRepo[]>(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
  ])

  const candidateRepos = repos
    .filter((repo) => !isExcludedRepo(repo))
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, 24)

  const repoCards = await buildRepoCards(candidateRepos, fetchReadmeSummary)
  const recentRepos = pickRecentRepos(repoCards, RECENT_REPO_LIMIT)
  const startYear = new Date(profile.created_at).getUTCFullYear()
  const currentYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: currentYear - startYear + 1 }, (_, offset) =>
      fetchContributionYear(startYear + offset)
    )
  )

  contributionYears.sort((a, b) => b.year - a.year)

  return { currentYear, profile, recentRepos, contributionYears }
}
