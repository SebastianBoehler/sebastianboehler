const USERNAME = "SebastianBoehler"
const FETCH_REVALIDATE_SECONDS = 60 * 60
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sebastianboehler-portfolio",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

const EXCLUDED_REPO_PATTERNS = [/^sebastianboehler$/i, /^technical-assessment/i]
const RECENT_REPO_LIMIT = 6
const RECENT_COMMIT_LIMIT = 6

export type GitHubProfile = {
  name: string
  company: string | null
  blog: string
  location: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export type RepoCard = {
  name: string
  url: string
  summary: string
  language: string
  stars: number
  createdAt: string
  updatedAt: string
}

export type ContributionCell = {
  date: string
  week: number
  day: number
  level: number
}

export type ContributionYear = {
  year: number
  total: number
  cells: ContributionCell[]
}

export type GitHubSnapshot = {
  currentYear: number
  profile: GitHubProfile
  recentRepos: RepoCard[]
  recentCommits: RecentCommit[]
  contributionYears: ContributionYear[]
}

export type RecentCommit = {
  branch: string
  committedAt: string
  message: string
  repoName: string
  repoUrl: string
  sha: string
  url: string
}

type GitHubRepo = {
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
  created_at: string
  default_branch: string
  fork: boolean
  archived: boolean
}

type GitHubEvent = {
  type: string
  created_at: string
  repo: {
    name: string
  }
  payload: {
    head?: string
    ref?: string
  }
}

type GitHubCommit = {
  html_url: string
  sha: string
  commit: {
    author?: {
      date?: string
    }
    message: string
  }
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

function stripMarkdown(value: string) {
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

function isUsefulSummary(summary: string | null) {
  return Boolean(summary && summary.length >= 18)
}

function isExcludedRepo(repo: GitHubRepo) {
  if (repo.fork || repo.archived) {
    return true
  }

  return isExcludedRepoName(repo.name)
}

function isExcludedRepoName(name: string) {
  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(name))
}

function extractSummaryFromReadme(readme: string) {
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
      line.startsWith("<!--")
    ) {
      continue
    }

    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
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

async function buildRepoCards(repos: GitHubRepo[]) {
  const cards: RepoCard[] = []

  for (const repo of repos) {
    let summary: string | null = stripMarkdown(repo.description ?? "")

    if (!isUsefulSummary(summary)) {
      summary = await fetchReadmeSummary(repo)
    }

    if (!isUsefulSummary(summary)) {
      continue
    }

    const finalSummary = summary ?? ""

    cards.push({
      name: repo.name,
      url: repo.html_url,
      summary: finalSummary,
      language: repo.language ?? "Code",
      stars: repo.stargazers_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    })
  }

  return cards
}

function pickRecentRepos(cards: RepoCard[], limit: number) {
  return [...cards]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limit)
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

async function fetchRecentCommits(): Promise<RecentCommit[]> {
  const events = await fetchJson<GitHubEvent[]>(
    `https://api.github.com/users/${USERNAME}/events/public?per_page=20`
  )

  const pushEvents = events
    .filter((event) => event.type === "PushEvent" && event.payload.head)
    .filter((event) => {
      const [, repoName = ""] = event.repo.name.split("/")
      return !isExcludedRepoName(repoName)
    })

  const seen = new Set<string>()
  const uniquePushes = pushEvents.filter((event) => {
    const key = `${event.repo.name}:${event.payload.head}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })

  const commits = await Promise.allSettled(
    uniquePushes.slice(0, RECENT_COMMIT_LIMIT).map(async (event) => {
      const [owner, repoName] = event.repo.name.split("/")
      const sha = event.payload.head!
      const branch = event.payload.ref?.replace("refs/heads/", "") ?? "main"
      const commit = await fetchJson<GitHubCommit>(
        `https://api.github.com/repos/${owner}/${repoName}/commits/${sha}`
      )

      return {
        branch,
        committedAt: commit.commit.author?.date ?? event.created_at,
        message: commit.commit.message.split("\n")[0].trim(),
        repoName,
        repoUrl: `https://github.com/${owner}/${repoName}`,
        sha: commit.sha,
        url: commit.html_url,
      } satisfies RecentCommit
    })
  )

  return commits
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
    .sort((a, b) => Date.parse(b.committedAt) - Date.parse(a.committedAt))
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const [profile, repos, recentCommits] = await Promise.all([
    fetchJson<GitHubProfile>(`https://api.github.com/users/${USERNAME}`),
    fetchJson<GitHubRepo[]>(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetchRecentCommits(),
  ])

  const filteredRepos = repos.filter((repo) => !isExcludedRepo(repo))
  const candidateRepos = [...filteredRepos]
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, 24)

  const repoCards = await buildRepoCards(candidateRepos)
  const recentRepos = pickRecentRepos(repoCards, RECENT_REPO_LIMIT)

  const startYear = new Date(profile.created_at).getUTCFullYear()
  const currentYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: currentYear - startYear + 1 }, (_, offset) =>
      fetchContributionYear(startYear + offset)
    )
  )

  contributionYears.sort((a, b) => b.year - a.year)

  return { currentYear, profile, recentRepos, recentCommits, contributionYears }
}
