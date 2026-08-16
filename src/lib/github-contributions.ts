import type { ContributionArcState, ContributionCell, ContributionYear } from "@/lib/github-types"

type ContributionFetcher = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) => ReturnType<typeof fetch>

const contributionUrl = (year: number) =>
  `https://github.com/users/SebastianBoehler/contributions?from=${year}-01-01&to=${year}-12-31`

function getFirstSunday(year: number) {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  yearStart.setUTCDate(yearStart.getUTCDate() - yearStart.getUTCDay())
  return yearStart
}

export function parseContributionYear(html: string, year: number): ContributionYear {
  const totalMatch = html.match(new RegExp(`([\\d,]+)\\s+contributions?\\s+in\\s+${year}`))
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : 0
  const firstSunday = getFirstSunday(year)
  const cells = Array.from(
    html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g),
    (match): ContributionCell => {
      const date = match[1]
      const cellDate = new Date(`${date}T00:00:00Z`)
      const daysFromFirstSunday = Math.floor((cellDate.getTime() - firstSunday.getTime()) / 86_400_000)

      return {
        date,
        week: Math.floor(daysFromFirstSunday / 7),
        day: cellDate.getUTCDay(),
        level: Number(match[2]),
      }
    }
  )

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
        const response = await request(contributionUrl(year), { next: { revalidate: 3600 } })
        if (!response.ok) throw new Error(`GitHub contributions failed: ${response.status}`)
        return parseContributionYear(await response.text(), year)
      })
    )

    return { status: "ready", years: contributionYears.sort((a, b) => b.year - a.year) }
  } catch {
    return { status: "unavailable", message: "GitHub activity is temporarily unavailable." }
  }
}
