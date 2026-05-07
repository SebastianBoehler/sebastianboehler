export const USERNAME = "SebastianBoehler"
export const LOOKBACK_MONTHS = 13
export const MAX_CONCURRENT_REQUESTS = 1
export const EXCLUDED_REPO_PATTERNS = [
  /^sebastianboehler$/i,
  /^technical-assessment/i,
  /^compute_atlas$/i,
  /^markettensor$/i,
  /^marketing/i,
  /^jurisflow$/i,
]

export function isExcludedRepo(repo) {
  if (repo.fork || repo.archived || !repo.default_branch) {
    return true
  }

  return EXCLUDED_REPO_PATTERNS.some((pattern) => pattern.test(repo.name))
}

export function startOfUtcMonth(value) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1))
}

export function addUtcMonths(value, months) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + months, 1))
}

export function earliestDate(...values) {
  return values.reduce((earliest, current) =>
    current.getTime() < earliest.getTime() ? current : earliest
  )
}

export async function mapWithConcurrency(items, limit, worker) {
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
