import type { ContributionArcState, ContributionCell, ContributionYear } from "@/lib/github-types"

type ContributionFetcher = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>

const REQUEST_TIMEOUT_MS = 5_000
const DAY_MS = 86_400_000

const contributionUrl = (year: number) =>
  `https://github.com/users/SebastianBoehler/contributions?from=${year}-01-01&to=${year}-12-31`

function getFirstSunday(year: number) {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  yearStart.setUTCDate(yearStart.getUTCDate() - yearStart.getUTCDay())
  return yearStart
}

function parseTotal(html: string, year: number) {
  const headings = Array.from(html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi), (match) =>
    match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
  const totalPattern = new RegExp(`^([\\d,]+)\\s+contributions?\\s+in\\s+${year}$`, "i")

  for (const heading of headings) {
    const match = heading.match(totalPattern)
    if (!match) continue

    const total = Number(match[1].replaceAll(",", ""))
    if (Number.isSafeInteger(total) && total >= 0) return total
  }

  throw new Error(`Missing contribution heading for ${year}`)
}

function parseCell(tag: string, year: number, firstSunday: Date): ContributionCell {
  const date = tag.match(/\bdata-date=(['"])([^'"]+)\1/i)?.[2]
  const levelValue = tag.match(/\bdata-level=(['"])([^'"]+)\1/i)?.[2]

  if (!date || levelValue === undefined) throw new Error(`Malformed contribution cell for ${year}`)

  const cellDate = new Date(`${date}T00:00:00Z`)
  const level = Number(levelValue)
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    && !Number.isNaN(cellDate.getTime())
    && cellDate.toISOString().slice(0, 10) === date
    && cellDate.getUTCFullYear() === year

  if (!isValidDate || !Number.isInteger(level) || level < 0 || level > 4) {
    throw new Error(`Invalid contribution cell for ${year}`)
  }

  const daysFromFirstSunday = Math.floor((cellDate.getTime() - firstSunday.getTime()) / DAY_MS)
  const week = Math.floor(daysFromFirstSunday / 7)
  if (week < 0 || week > 53) throw new Error(`Contribution date outside calendar bounds for ${year}`)

  return { date, week, day: cellDate.getUTCDay(), level }
}

export function parseContributionYear(html: string, year: number): ContributionYear {
  const total = parseTotal(html, year)
  const firstSunday = getFirstSunday(year)
  const tags = Array.from(html.matchAll(/<td\b[^>]*>/gi), (match) => match[0])
    .filter((tag) => /\bdata-(?:date|level)=/i.test(tag))
  if (tags.length === 0) throw new Error(`Missing contribution cells for ${year}`)

  const cells = tags.map((tag) => parseCell(tag, year, firstSunday))
    .sort((left, right) => left.date.localeCompare(right.date))
  if (new Set(cells.map((cell) => cell.date)).size !== cells.length) {
    throw new Error(`Duplicate contribution dates for ${year}`)
  }

  return { year, total, cells }
}

export async function getContributionArc(
  request: ContributionFetcher = fetch,
  years = Array.from(
    { length: new Date().getUTCFullYear() - 2017 + 1 },
    (_, index) => 2017 + index
  ),
): Promise<ContributionArcState> {
  try {
    const contributionYears = await Promise.all(
      years.map(async (year) => {
        const response = await request(contributionUrl(year), {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        })
        if (!response.ok) throw new Error(`GitHub contributions failed: ${response.status}`)
        return parseContributionYear(await response.text(), year)
      })
    )

    return { status: "ready", years: contributionYears.sort((a, b) => b.year - a.year) }
  } catch {
    return { status: "unavailable", message: "GitHub activity is temporarily unavailable." }
  }
}
