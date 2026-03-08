const USERNAME = "SebastianBoehler"

const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "sebastianboehler-portfolio",
}

const EXCLUDED_REPO_PATTERNS = [/^sebastianboehler$/i, /^technical-assessment/i]
const FEATURED_RECENT = [
  "stuttgart-pulse",
  "polymarket-cpp-client",
  "tue-cli",
  "poly-arb",
  "bybit-cpp-client",
  "bybit_market_maker_cpp",
]

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
  profile: GitHubProfile
  recentRepos: RepoCard[]
  contributionYears: ContributionYear[]
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: API_HEADERS,
    next: { revalidate: 60 * 60 * 24 },
  })

  if (!response.ok) {
    throw new Error(`GitHub JSON fetch failed: ${response.status} ${url}`)
  }

  return response.json() as Promise<T>
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: API_HEADERS,
    next: { revalidate: 60 * 60 * 24 },
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

  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(repo.name))
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
      updatedAt: repo.updated_at,
    })
  }

  return cards
}

function pickFeatured(cards: RepoCard[], featuredNames: string[], limit: number) {
  const cardMap = new Map(cards.map((card) => [card.name, card]))
  const selected: RepoCard[] = []
  const seen = new Set<string>()

  for (const name of featuredNames) {
    const card = cardMap.get(name)
    if (card && !seen.has(card.name)) {
      selected.push(card)
      seen.add(card.name)
    }
  }

  for (const card of cards.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))) {
    if (selected.length >= limit) {
      break
    }

    if (!seen.has(card.name)) {
      selected.push(card)
      seen.add(card.name)
    }
  }

  return selected
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

  const filteredRepos = repos.filter((repo) => !isExcludedRepo(repo))
  const candidateRepos = [
    ...filteredRepos.filter((repo) => FEATURED_RECENT.includes(repo.name)),
    ...filteredRepos.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 16),
  ].filter((repo, index, list) => list.findIndex((entry) => entry.name === repo.name) === index)

  const repoCards = await buildRepoCards(candidateRepos)
  const recentRepos = pickFeatured(repoCards, FEATURED_RECENT, 6)

  const startYear = new Date(profile.created_at).getUTCFullYear()
  const endYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: endYear - startYear + 1 }, (_, offset) => fetchContributionYear(startYear + offset))
  )

  contributionYears.sort((a, b) => b.year - a.year)

  return { profile, recentRepos, contributionYears }
}
