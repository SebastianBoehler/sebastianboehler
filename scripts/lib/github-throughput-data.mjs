import { runGhGraphql } from "./github-gh-client.mjs"

const USERNAME = "SebastianBoehler"
const EXCLUDED_REPO_PATTERNS = [/^sebastianboehler$/i, /^technical-assessment/i]
const LOOKBACK_MONTHS = 13
const MAX_CONCURRENT_REQUESTS = 1

function isExcludedRepo(repo) {
  if (repo.fork || repo.archived || !repo.default_branch) {
    return true
  }

  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(repo.name))
}

function startOfUtcMonth(value) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1))
}

function addUtcMonths(value, months) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + months, 1))
}

function earliestDate(...values) {
  return values.reduce((earliest, current) =>
    current.getTime() < earliest.getTime() ? current : earliest
  )
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function runWorker() {
    while (true) {
      const currentIndex = nextIndex
      nextIndex += 1
      if (currentIndex >= items.length) {
        return
      }

      results[currentIndex] = await worker(items[currentIndex], currentIndex)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runWorker()))
  return results
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function retryRepoCommits(repo, sinceIso) {
  let attempt = 0
  let lastError

  while (attempt < 3) {
    try {
      return await listRepoCommits(repo, sinceIso)
    } catch (error) {
      lastError = error
      attempt += 1
      if (attempt < 3) {
        await wait(250 * attempt)
      }
    }
  }

  throw lastError
}

async function listOwnedRepos() {
  const repos = []
  let afterCursor

  while (true) {
    const response = await runGhGraphql({
      query: `query($after:String){
        viewer{
          repositories(first:100,after:$after,ownerAffiliations:OWNER,orderBy:{field:UPDATED_AT,direction:DESC}){
            nodes{
              name
              isArchived
              isFork
              isPrivate
              pushedAt
              updatedAt
              owner{
                login
              }
              defaultBranchRef{
                name
              }
            }
            pageInfo{
              endCursor
              hasNextPage
            }
          }
        }
      }`,
      ...(afterCursor ? { after: afterCursor } : {}),
    })

    const repositoryConnection = response.data?.viewer?.repositories
    if (!repositoryConnection) {
      return repos
    }

    repos.push(
      ...repositoryConnection.nodes.map((repo) => ({
        archived: repo.isArchived,
        default_branch: repo.defaultBranchRef?.name ?? null,
        fork: repo.isFork,
        name: repo.name,
        owner: repo.owner,
        private: repo.isPrivate,
        pushed_at: repo.pushedAt,
        updated_at: repo.updatedAt,
      }))
    )

    if (!repositoryConnection.pageInfo?.hasNextPage || !repositoryConnection.pageInfo?.endCursor) {
      return repos
    }

    afterCursor = repositoryConnection.pageInfo.endCursor
  }
}

async function listRepoCommits(repo, sinceIso) {
  const commits = []
  let afterCursor

  while (true) {
    const response = await runGhGraphql({
      query: `query($owner:String!,$name:String!,$since:GitTimestamp!,$after:String){
        repository(owner:$owner,name:$name){
          defaultBranchRef{
            target{
              ... on Commit{
                history(first:100,since:$since,after:$after){
                  nodes{
                    additions
                    deletions
                    committedDate
                    author{
                      user{
                        login
                      }
                    }
                  }
                  pageInfo{
                    endCursor
                    hasNextPage
                  }
                }
              }
            }
          }
        }
      }`,
      owner: USERNAME,
      name: repo.name,
      since: sinceIso,
      ...(afterCursor ? { after: afterCursor } : {}),
    })

    const history = response.data?.repository?.defaultBranchRef?.target?.history
    if (!history) {
      return commits
    }

    commits.push(
      ...history.nodes
        .filter((commit) => commit.author?.user?.login === USERNAME)
        .map((commit) => ({
          additions: commit.additions ?? 0,
          deletions: commit.deletions ?? 0,
          committedAt: commit.committedDate,
        }))
    )

    if (!history.pageInfo?.hasNextPage || !history.pageInfo?.endCursor) {
      return commits
    }

    afterCursor = history.pageInfo.endCursor
  }
}

function buildMonthlySeries(commits, now) {
  const currentMonthStart = startOfUtcMonth(now)
  const firstMonthStart = addUtcMonths(currentMonthStart, -(LOOKBACK_MONTHS - 1))
  const months = Array.from({ length: LOOKBACK_MONTHS }, (_, index) => {
    const monthStart = addUtcMonths(firstMonthStart, index)
    return {
      monthStart: monthStart.toISOString(),
      additions: 0,
      deletions: 0,
      changedLines: 0,
      commits: 0,
    }
  })

  const monthIndexByStart = new Map(months.map((month, index) => [month.monthStart.slice(0, 7), index]))

  for (const commit of commits) {
    if (!commit.committedAt) {
      continue
    }

    const monthKey = commit.committedAt.slice(0, 7)
    const index = monthIndexByStart.get(monthKey)
    if (index === undefined) {
      continue
    }

    const changedLines = commit.additions + commit.deletions
    months[index].additions += commit.additions
    months[index].deletions += commit.deletions
    months[index].changedLines += changedLines
    months[index].commits += 1
  }

  return months
}

function buildComparisonRanges(now) {
  const currentMonthStart = startOfUtcMonth(now)
  const currentMonthEnd = now.toISOString()
  const comparisonStart = addUtcMonths(currentMonthStart, -12)
  const comparisonEnd = new Date(Date.UTC(
    comparisonStart.getUTCFullYear(),
    comparisonStart.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ))
  const currentYearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const comparisonYearStart = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1))
  const comparisonYearEnd = new Date(Date.UTC(
    now.getUTCFullYear() - 1,
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ))

  return {
    currentMonthStart: currentMonthStart.toISOString(),
    currentMonthEnd,
    comparisonMonthStart: comparisonStart.toISOString(),
    comparisonMonthEnd: comparisonEnd.toISOString(),
    currentYearStart: currentYearStart.toISOString(),
    comparisonYearStart: comparisonYearStart.toISOString(),
    comparisonYearEnd: comparisonYearEnd.toISOString(),
  }
}

export async function collectGitHubThroughput() {
  const now = new Date()
  const comparisons = buildComparisonRanges(now)
  const firstMonthStart = addUtcMonths(startOfUtcMonth(now), -(LOOKBACK_MONTHS - 1))
  const collectionStart = earliestDate(
    firstMonthStart,
    new Date(comparisons.comparisonYearStart),
    new Date(comparisons.currentYearStart),
    new Date(comparisons.comparisonMonthStart)
  )
  const repos = (await listOwnedRepos())
    .filter((repo) => !isExcludedRepo(repo))
    .filter((repo) => new Date(repo.pushed_at ?? repo.updated_at) >= collectionStart)

  const commitGroups = await mapWithConcurrency(repos, MAX_CONCURRENT_REQUESTS, async (repo) => {
    try {
      return await retryRepoCommits(repo, collectionStart.toISOString())
    } catch (error) {
      return { error, repo: repo.name }
    }
  })

  const successfulGroups = commitGroups.filter((group) => Array.isArray(group))
  const failedGroups = commitGroups.filter((group) => !Array.isArray(group))
  const commits = successfulGroups.flat().filter((commit) => commit.committedAt)
  if (commits.length === 0) {
    throw new Error("No throughput data could be collected from owned repositories.")
  }

  const note =
    failedGroups.length > 0
      ? `Includes owned public and private repositories via the authenticated GitHub CLI session. Measures code movement as additions + deletions on default-branch commits authored by SebastianBoehler. ${failedGroups.length} repositories were skipped because GitHub returned transient API errors.`
      : "Includes owned public and private repositories via the authenticated GitHub CLI session. Measures code movement as additions + deletions on default-branch commits authored by SebastianBoehler."

  return {
    commits,
    comparisons,
    months: buildMonthlySeries(commits, now),
    now: now.toISOString(),
    note,
    reposScanned: successfulGroups.length,
    totalCommits: commits.length,
  }
}
