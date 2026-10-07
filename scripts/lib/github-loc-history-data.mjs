import { formatNumber } from "./github-throughput-svg-format.mjs"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { isExcludedRepo, mapWithConcurrency, USERNAME } from "./github-throughput-helpers.mjs"

const execFileAsync = promisify(execFile)

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function ghApi(path) {
  const { stdout } = await execFileAsync("gh", ["api", "--include", path], {
    maxBuffer: 1024 * 1024 * 32,
    timeout: 45_000,
  })
  const splitAt = stdout.indexOf("\r\n\r\n")
  const headerEnd = splitAt === -1 ? stdout.indexOf("\n\n") : splitAt
  const header = headerEnd === -1 ? stdout : stdout.slice(0, headerEnd)
  const body = headerEnd === -1 ? "" : stdout.slice(headerEnd).replace(/^(\r\n\r\n|\n\n)/, "")
  const status = Number(header.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/)?.[1] ?? 0)
  return { body: body.trim(), status }
}

async function listPublicRepos() {
  const repos = []
  let page = 1

  while (true) {
    const response = await ghApi(`users/${USERNAME}/repos?per_page=100&type=owner&page=${page}`)
    const batch = JSON.parse(response.body)
    if (!Array.isArray(batch) || batch.length === 0) {
      return repos
    }

    repos.push(
      ...batch.map((repo) => ({
        archived: repo.archived,
        default_branch: repo.default_branch ?? null,
        fork: repo.fork,
        name: repo.name,
      }))
    )

    if (batch.length < 100) {
      return repos
    }

    page += 1
  }
}

async function fetchContributorWeeks(repoName) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await ghApi(`repos/${USERNAME}/${repoName}/stats/contributors`)
    if (response.status === 202 || response.status === 204 || !response.body) {
      await wait(400 * (attempt + 1))
      continue
    }

    if (response.status !== 200) {
      throw new Error(`${repoName} contributor stats returned HTTP ${response.status}`)
    }

    const contributors = JSON.parse(response.body)
    const author = contributors.find((entry) => entry.author?.login === USERNAME)
    return (author?.weeks ?? []).map((week) => ({ ...week, repo: repoName }))
  }

  return []
}

const BULK_IMPORT_ADDITIONS = 500_000

export function isBulkImportWeek(week) {
  return (week?.a ?? 0) >= BULK_IMPORT_ADDITIONS
}

export function describeOmissions(omitted) {
  if (omitted.length === 0) {
    return ""
  }

  const parts = omitted.map((week) => {
    const label = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(week.w * 1000))
    return `Excludes a ${label} ${week.repo} scaffold import (${formatNumber(week.a)} lines)`
  })
  return `${parts.join("; ")} so the monthly scale stays readable.`
}

export function aggregateMonthly(weeks) {
  const months = new Map()

  for (const week of weeks) {
    if (!week || (!week.a && !week.d && !week.c)) {
      continue
    }

    const date = new Date(week.w * 1000)
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
    const month = months.get(key) ?? { month: key, additions: 0, deletions: 0, commits: 0 }
    month.additions += week.a ?? 0
    month.deletions += week.d ?? 0
    month.commits += week.c ?? 0
    months.set(key, month)
  }

  return [...months.values()].sort((left, right) => left.month.localeCompare(right.month))
}

export async function collectLocHistory() {
  const repos = (await listPublicRepos()).filter((repo) => !isExcludedRepo(repo))
  const groups = await mapWithConcurrency(repos, 6, async (repo) => {
    try {
      return await fetchContributorWeeks(repo.name)
    } catch (error) {
      console.error(`skip ${repo.name}: ${error instanceof Error ? error.message : error}`)
      return { skipped: repo.name }
    }
  })
  const skipped = groups.filter((group) => group && !Array.isArray(group)).map((group) => group.skipped)
  const allWeeks = groups.filter(Array.isArray).flat()
  const omitted = allWeeks.filter((week) => isBulkImportWeek(week))
  const weeks = allWeeks.filter((week) => !isBulkImportWeek(week))

  const months = aggregateMonthly(weeks)
  if (months.length === 0) {
    throw new Error("No public line-history data could be collected.")
  }

  const totals = months.reduce(
    (summary, month) => {
      summary.additions += month.additions
      summary.deletions += month.deletions
      summary.commits += month.commits
      return summary
    },
    { additions: 0, deletions: 0, commits: 0 }
  )

  return {
    months,
    omission: describeOmissions(omitted),
    reposScanned: repos.length - skipped.length,
    skipped,
    through: months.at(-1).month,
    totals,
  }
}
