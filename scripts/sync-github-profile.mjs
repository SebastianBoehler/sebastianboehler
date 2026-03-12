import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const USERNAME = "SebastianBoehler"
const PROFILE_REPO = "sebastianboehler"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${PROFILE_REPO}-profile-sync`,
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
}

const EXCLUDED_REPO_PATTERNS = [/^sebastianboehler$/i, /^technical-assessment/i]
const RECENT_REPO_LIMIT = 6
const RECENT_COMMIT_LIMIT = 6
const SUMMARY_OVERRIDES = {
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
const CURRENT_FOCUS_ITEMS = [
  {
    label: "Agent tooling",
    description:
      "building fast Go CLIs for AI-assisted development workflows, including dependency diagnostics and deterministic file editing",
  },
  {
    label: "Autonomous research systems",
    description:
      "shipping production-minded software for closed-loop materials and peptide experimentation",
  },
  {
    label: "DeFi execution infrastructure",
    description:
      "evolving treasury automation and approval flows for stablecoin operations and Solana liquidity strategies",
  },
  {
    label: "Academic and civic products",
    description:
      "building university tooling and map-first data products across Alma, ILIAS, mobility, and air-quality workflows",
  },
]
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

async function fetchJson(url) {
  const response = await fetch(url, { headers: API_HEADERS })
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON from ${url}: ${response.status}`)
  }

  return response.json()
}

async function fetchText(url) {
  const response = await fetch(url, { headers: API_HEADERS })
  if (!response.ok) {
    throw new Error(`Failed to fetch text from ${url}: ${response.status}`)
  }

  return response.text()
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

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

function formatDate(value) {
  return DATE_FORMATTER.format(new Date(value))
}

function isExcludedRepo(repo) {
  if (repo.fork || repo.archived) {
    return true
  }

  return isExcludedRepoName(repo.name)
}

function isExcludedRepoName(name) {
  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(name))
}

function isUsefulSummary(summary) {
  return Boolean(summary && summary.length >= 18)
}

async function fetchReadmeSummary(repo) {
  const branchesToTry = [repo.default_branch, "main", "master"].filter(Boolean)

  for (const branch of [...new Set(branchesToTry)]) {
    try {
      const readme = await fetchText(
        `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/${branch}/README.md`
      )
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

function extractSummaryFromReadme(readme) {
  const lines = readme.split(/\r?\n/)
  let inCodeBlock = false
  const paragraphs = []
  let currentParagraph = []

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

async function buildRepoCards(repos) {
  const candidates = repos.filter((repo) => !isExcludedRepo(repo))

  const cards = []

  for (const repo of candidates) {
    let summary = SUMMARY_OVERRIDES[repo.name] ?? stripMarkdown(repo.description ?? "")
    if (!isUsefulSummary(summary)) {
      summary = await fetchReadmeSummary(repo)
    }

    if (!isUsefulSummary(summary)) {
      continue
    }

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

  return cards
}

function pickRecentRepos(cards, limit) {
  return [...cards]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit)
}

function getYearBounds(year) {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const firstSunday = new Date(yearStart)
  firstSunday.setUTCDate(firstSunday.getUTCDate() - firstSunday.getUTCDay())
  return { yearStart, firstSunday }
}

async function fetchContributionYear(year) {
  const html = await fetchText(
    `https://github.com/users/${USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`
  )
  const totalMatch = html.match(new RegExp(`([\\d,]+)\\s+contributions?\\s+in\\s+${year}`))
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0
  const { firstSunday } = getYearBounds(year)
  const cellMatches = html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)
  const cells = []

  for (const match of cellMatches) {
    const [date, levelString] = [match[1], match[2]]
    const cellDate = new Date(`${date}T00:00:00Z`)
    const diffDays = Math.floor((cellDate.getTime() - firstSunday.getTime()) / 86_400_000)
    const week = Math.floor(diffDays / 7)
    const day = cellDate.getUTCDay()
    cells.push({ date, week, day, level: Number(levelString) })
  }

  return { year, total, cells }
}

async function fetchRecentCommits() {
  const events = await fetchJson(`https://api.github.com/users/${USERNAME}/events/public?per_page=20`)
  const pushEvents = events
    .filter((event) => event.type === "PushEvent" && event.payload?.head)
    .filter((event) => {
      const [, repoName = ""] = event.repo.name.split("/")
      return !isExcludedRepoName(repoName)
    })

  const seen = new Set()
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
      const sha = event.payload.head
      const commit = await fetchJson(`https://api.github.com/repos/${owner}/${repoName}/commits/${sha}`)

      return {
        branch: event.payload.ref?.replace("refs/heads/", "") ?? "main",
        committedAt: commit.commit?.author?.date ?? event.created_at,
        message: commit.commit.message.split("\n")[0].trim(),
        repoName,
        repoUrl: `https://github.com/${owner}/${repoName}`,
        sha: commit.sha,
        url: commit.html_url,
      }
    })
  )

  return commits
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
    .sort((a, b) => new Date(b.committedAt) - new Date(a.committedAt))
}

function renderContributionSvg(years, theme = "dark") {
  const descendingYears = [...years].sort((a, b) => b.year - a.year)
  const width = 760
  const paddingX = 24
  const paddingTop = 36
  const labelWidth = 136
  const cell = 8
  const gap = 2
  const cellPitch = cell + gap
  const rowHeight = 72
  const headerHeight = 104
  const footerHeight = 28
  const gridWidth = cell * 53 + gap * 52
  const chartWidth = labelWidth + gridWidth
  const panelWidth = chartWidth + paddingX * 2
  const height = headerHeight + descendingYears.length * rowHeight + footerHeight
  const xOffset = Math.floor((width - panelWidth) / 2)
  const palette =
    theme === "light"
      ? {
          background: "#f6f8fa",
          panelStroke: "#d0d7de",
          bodyText: "#1f2328",
          mutedText: "#57606a",
          colors: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        }
      : {
          background: "#0d1117",
          panelStroke: "#30363d",
          bodyText: "#f0f6fc",
          mutedText: "#8b949e",
          colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }
  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

  const legend = palette.colors.map((color, index) => {
    const x = xOffset + paddingX + chartWidth - 118 + index * 18
    return `<rect x="${x}" y="50" width="10" height="10" rx="2" fill="${color}" />`
  })

  const rows = descendingYears.flatMap((yearData, index) => {
    const rowY = headerHeight + index * rowHeight
    const cells = yearData.cells.map((entry) => {
      const x = xOffset + paddingX + labelWidth + entry.week * cellPitch
      const y = rowY + 8 + entry.day * cellPitch
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${palette.colors[entry.level]}" />`
    })

    return [
      `<text x="${xOffset + paddingX}" y="${rowY + 22}" fill="${palette.bodyText}" font-size="15" font-weight="700">${yearData.year}</text>`,
      `<text x="${xOffset + paddingX}" y="${rowY + 40}" fill="${palette.mutedText}" font-size="11">${yearData.total.toLocaleString("en-US")} contributions</text>`,
      ...cells,
    ]
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">All GitHub contribution years for ${USERNAME}</title>
  <desc id="desc">Stacked yearly GitHub contribution heatmaps from ${descendingYears.at(-1)?.year ?? ""} to ${descendingYears[0]?.year ?? ""}, newest year first.</desc>
  <style>
    text {
      font-family: ${fontFamily};
    }
  </style>
  <rect x="${xOffset}" y="12" width="${panelWidth}" height="${height - 24}" rx="18" fill="${palette.background}" stroke="${palette.panelStroke}"/>
  <text x="${xOffset + paddingX}" y="${paddingTop + 6}" fill="${palette.bodyText}" font-size="20" font-weight="700">GitHub contribution history</text>
  <text x="${xOffset + paddingX}" y="${paddingTop + 28}" fill="${palette.mutedText}" font-size="12">All public contribution years stacked in one view. Darker green means heavier activity on GitHub&apos;s own scale for that year.</text>
  <text x="${xOffset + paddingX}" y="68" fill="${palette.mutedText}" font-size="11">Less</text>
  ${legend.join("\n  ")}
  <text x="${xOffset + paddingX + chartWidth - 18}" y="68" fill="${palette.mutedText}" font-size="11">More</text>
  ${rows.join("\n  ")}
</svg>
`
}

function buildReadme({ profile, recent, recentCommits, contributions }) {
  const generatedOn = DATE_FORMATTER.format(new Date())
  const contributionRange = `${contributions[0].year}-${contributions.at(-1).year}`
  const currentFocusSection = CURRENT_FOCUS_ITEMS.map(
    (item) => `- **${item.label}:** ${item.description}.`
  ).join("\n")
  const recentSection = recent
    .map(
      (repo) =>
        `- **[${repo.name}](${repo.url})** (${repo.language}, updated ${formatDate(repo.updatedAt)}) - ${repo.summary}`
    )
    .join("\n")

  const commitSection = recentCommits
    .map(
      (commit) =>
        `- **[${commit.repoName}](${commit.repoUrl})** \`${commit.sha.slice(0, 7)}\` on \`${commit.branch}\` (${formatDate(commit.committedAt)}) - [${commit.message}](${commit.url})`
    )
    .join("\n")

  return `# ${profile.name}

Engineer shipping agent tooling, trading infrastructure, on-chain systems, and research software. Based in ${profile.location}. Building through [${profile.company}](https://sunderlabs.com) and shipping projects at [sebastian-boehler.com](${profile.blog}).

Public GitHub snapshot as of ${generatedOn}: ${profile.public_repos} public repos, ${profile.followers} followers, active on GitHub since ${formatDate(profile.created_at)}.

## Contribution history

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/github-contributions-all-years-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/github-contributions-all-years-light.svg">
  <img alt="Stacked GitHub contribution history" src="./assets/github-contributions-all-years-light.svg">
</picture>

All years from ${contributionRange} are shown in one stacked calendar so the full activity arc is visible at a glance.

## Current focus

${currentFocusSection}

## Recent public work

${recentSection}

## Latest public commits

${commitSection}

## Links

- [Portfolio](${profile.blog})
- [GitHub](https://github.com/${USERNAME})
- [LinkedIn](https://www.linkedin.com/in/sebastian-boehler/)
- [X](https://x.com/${profile.twitter_username})
`
}

async function main() {
  const [profile, repos, recentCommits] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
    fetchRecentCommits(),
  ])

  const filteredRepos = repos.filter((repo) => !isExcludedRepo(repo))
  const candidateRepos = [...filteredRepos]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 24)

  const repoCards = await buildRepoCards(candidateRepos)
  const recent = pickRecentRepos(repoCards, RECENT_REPO_LIMIT)
  const startYear = new Date(profile.created_at).getUTCFullYear()
  const endYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: endYear - startYear + 1 }, (_, offset) => fetchContributionYear(startYear + offset))
  )

  const darkSvg = renderContributionSvg(contributionYears, "dark")
  const lightSvg = renderContributionSvg(contributionYears, "light")
  const readme = buildReadme({
    profile,
    recent,
    recentCommits,
    contributions: contributionYears,
  })

  await mkdir(path.resolve("assets"), { recursive: true })
  await writeFile(path.resolve("assets/github-contributions-all-years.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-contributions-all-years-dark.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-contributions-all-years-light.svg"), lightSvg)
  await writeFile(path.resolve("README.md"), readme)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
