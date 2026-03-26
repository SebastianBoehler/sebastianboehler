import { runGhGraphql } from "./github-gh-client.mjs"

const CONTRIBUTION_LEVEL_TO_INTENSITY = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

function getYearBounds(year) {
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const firstSunday = new Date(yearStart)
  firstSunday.setUTCDate(firstSunday.getUTCDate() - firstSunday.getUTCDay())
  return { firstSunday }
}

export async function fetchContributionYear({ username, year }) {
  const response = await runGhGraphql({
    query: `query($login:String!,$from:DateTime!,$to:DateTime!){
      user(login:$login){
        contributionsCollection(from:$from,to:$to){
          contributionCalendar{
            totalContributions
            weeks{
              contributionDays{
                contributionCount
                contributionLevel
                date
                weekday
              }
            }
          }
        }
      }
    }`,
    from: `${year}-01-01T00:00:00Z`,
    login: username,
    to: `${year}-12-31T23:59:59Z`,
  })

  const calendar = response.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) {
    throw new Error(`Missing contribution calendar for ${username} in ${year}.`)
  }

  const { firstSunday } = getYearBounds(year)
  const cells = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((entry) => entry.date.startsWith(`${year}-`))
    .map((entry) => {
      const cellDate = new Date(`${entry.date}T00:00:00Z`)
      const diffDays = Math.floor((cellDate.getTime() - firstSunday.getTime()) / 86_400_000)

      return {
        date: entry.date,
        day: entry.weekday,
        level: CONTRIBUTION_LEVEL_TO_INTENSITY[entry.contributionLevel] ?? 0,
        week: Math.floor(diffDays / 7),
      }
    })

  return {
    cells,
    total: calendar.totalContributions,
    year,
  }
}
