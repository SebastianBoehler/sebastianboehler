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
  contributionYears: ContributionYear[]
}

export type GitHubRepo = {
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
