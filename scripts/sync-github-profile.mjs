import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const USERNAME = "SebastianBoehler"
const PROFILE_REPO = "sebastianboehler"
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${PROFILE_REPO}-profile-sync`,
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
const FEATURED_HIGHLIGHTS = [
  "imagegen-canvas",
  "orpheus-podcast",
  "domain-check-mcp",
  "solana-dapp-learning",
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

  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(repo.name))
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
    let summary = stripMarkdown(repo.description ?? "")
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
      updatedAt: repo.updated_at,
      createdAt: repo.created_at,
      topics: repo.topics ?? [],
    })
  }

  return cards
}

function pickFeatured(cards, preferredNames, fallbackSorter, limit, excludedNames = new Set()) {
  const cardMap = new Map(cards.map((card) => [card.name, card]))
  const selected = []
  const seen = new Set(excludedNames)

  for (const name of preferredNames) {
    const card = cardMap.get(name)
    if (card && !seen.has(card.name)) {
      selected.push(card)
      seen.add(card.name)
    }
  }

  const fallback = [...cards]
    .filter((card) => !seen.has(card.name))
    .sort(fallbackSorter)

  for (const card of fallback) {
    if (selected.length >= limit) {
      break
    }

    selected.push(card)
    seen.add(card.name)
  }

  return selected
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

function renderContributionSvg(years) {
  const descendingYears = [...years].sort((a, b) => b.year - a.year)
  const width = 760
  const paddingX = 24
  const paddingTop = 24
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
  const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

  const legend = colors.map((color, index) => {
    const x = xOffset + paddingX + chartWidth - 118 + index * 18
    return `<rect x="${x}" y="50" width="10" height="10" rx="2" fill="${color}" />`
  })

  const rows = descendingYears.flatMap((yearData, index) => {
    const rowY = headerHeight + index * rowHeight
    const cells = yearData.cells.map((entry) => {
      const x = xOffset + paddingX + labelWidth + entry.week * cellPitch
      const y = rowY + 8 + entry.day * cellPitch
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${colors[entry.level]}" />`
    })

    return [
      `<text x="${xOffset + paddingX}" y="${rowY + 22}" fill="#f0f6fc" font-size="15" font-weight="700">${yearData.year}</text>`,
      `<text x="${xOffset + paddingX}" y="${rowY + 40}" fill="#8b949e" font-size="11">${yearData.total.toLocaleString("en-US")} contributions</text>`,
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
  <rect x="${xOffset}" y="12" width="${panelWidth}" height="${height - 24}" rx="18" fill="#0d1117" stroke="#30363d"/>
  <text x="${xOffset + paddingX}" y="${paddingTop + 6}" fill="#f0f6fc" font-size="20" font-weight="700">GitHub contribution history</text>
  <text x="${xOffset + paddingX}" y="${paddingTop + 28}" fill="#8b949e" font-size="12">All public contribution years stacked in one view. Darker green means heavier activity on GitHub&apos;s own scale for that year.</text>
  <text x="${xOffset + paddingX}" y="68" fill="#8b949e" font-size="11">Less</text>
  ${legend.join("\n  ")}
  <text x="${xOffset + paddingX + chartWidth - 18}" y="68" fill="#8b949e" font-size="11">More</text>
  ${rows.join("\n  ")}
</svg>
`
}

function buildReadme({ profile, recent, highlights, contributions }) {
  const generatedOn = DATE_FORMATTER.format(new Date())
  const contributionRange = `${contributions[0].year}-${contributions.at(-1).year}`
  const recentSection = recent
    .map(
      (repo) =>
        `- **[${repo.name}](${repo.url})** (${repo.language}, updated ${formatDate(repo.updatedAt)}) - ${repo.summary}`
    )
    .join("\n")

  const highlightSection = highlights
    .map(
      (repo) =>
        `- **[${repo.name}](${repo.url})** (${repo.stars} ${repo.stars === 1 ? "star" : "stars"}) - ${repo.summary}`
    )
    .join("\n")

  return `# ${profile.name}

Full-stack engineer focused on C++ trading infrastructure, DeFi systems, AI tooling, and product builds. Based in ${profile.location}. Building through [${profile.company}](https://sunderlabs.com) and shipping projects at [sebastian-boehler.com](${profile.blog}).

Public GitHub snapshot as of ${generatedOn}: ${profile.public_repos} public repos, ${profile.followers} followers, active on GitHub since ${formatDate(profile.created_at)}.

## Contribution history

![Stacked GitHub contribution history](./assets/github-contributions-all-years.svg)

All years from ${contributionRange} are shown in one stacked calendar so the full activity arc is visible at a glance.

## Recent public work

${recentSection}

## Also worth a look

${highlightSection}

## Links

- [Portfolio](${profile.blog})
- [GitHub](https://github.com/${USERNAME})
- [LinkedIn](https://www.linkedin.com/in/sebastian-boehler/)
- [X](https://x.com/${profile.twitter_username})
`
}

async function main() {
  const [profile, repos] = await Promise.all([
    fetchJson(`https://api.github.com/users/${USERNAME}`),
    fetchJson(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`),
  ])

  const filteredRepos = repos.filter((repo) => !isExcludedRepo(repo))
  const featuredNames = new Set([...FEATURED_RECENT, ...FEATURED_HIGHLIGHTS])
  const candidateRepos = [
    ...filteredRepos.filter((repo) => featuredNames.has(repo.name)),
    ...filteredRepos
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 18),
    ...filteredRepos
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count
        }
        return new Date(b.updated_at) - new Date(a.updated_at)
      })
      .slice(0, 16),
  ].filter((repo, index, list) => list.findIndex((entry) => entry.name === repo.name) === index)

  const repoCards = await buildRepoCards(candidateRepos)
  const recent = pickFeatured(
    repoCards,
    FEATURED_RECENT,
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    6
  )
  const highlights = pickFeatured(
    repoCards,
    FEATURED_HIGHLIGHTS,
    (a, b) => {
      if (b.stars !== a.stars) {
        return b.stars - a.stars
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    },
    4,
    new Set(recent.map((repo) => repo.name))
  )
  const startYear = new Date(profile.created_at).getUTCFullYear()
  const endYear = new Date().getUTCFullYear()
  const contributionYears = await Promise.all(
    Array.from({ length: endYear - startYear + 1 }, (_, offset) => fetchContributionYear(startYear + offset))
  )

  const svg = renderContributionSvg(contributionYears)
  const readme = buildReadme({
    profile,
    recent,
    highlights,
    contributions: contributionYears,
  })

  await mkdir(path.resolve("assets"), { recursive: true })
  await writeFile(path.resolve("assets/github-contributions-all-years.svg"), svg)
  await writeFile(path.resolve("README.md"), readme)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
