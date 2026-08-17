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

export type ContributionArcState =
  | { status: "ready"; years: ContributionYear[] }
  | { status: "unavailable"; message: string }
