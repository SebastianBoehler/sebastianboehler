import { expect, test } from "bun:test"
import {
  aggregateMonthly,
  describeOmissions,
  isBulkImportWeek,
} from "../scripts/lib/github-loc-history-data.mjs"
import { fillMonths, renderLocHistorySvg } from "../scripts/lib/github-loc-history-svg.mjs"

test("sums weekly additions, deletions, and commits into months", () => {
  const months = aggregateMonthly([
    { a: 10, c: 1, d: 2, w: Date.parse("2024-01-07T00:00:00Z") / 1000 },
    { a: 5, c: 2, d: 1, w: Date.parse("2024-01-21T00:00:00Z") / 1000 },
    { a: 0, c: 0, d: 0, w: Date.parse("2024-02-04T00:00:00Z") / 1000 },
    { a: 4, c: 1, d: 8, w: Date.parse("2024-03-03T00:00:00Z") / 1000 },
  ])

  expect(months).toEqual([
    { additions: 15, commits: 3, deletions: 3, month: "2024-01" },
    { additions: 4, commits: 1, deletions: 8, month: "2024-03" },
  ])
})

test("treats only huge single-week imports as scale outliers", () => {
  expect(isBulkImportWeek({ a: 500_000, c: 2, d: 10 })).toBe(true)
  expect(isBulkImportWeek({ a: 224_558, c: 7, d: 7 })).toBe(false)
  expect(
    describeOmissions([{ a: 1_040_748, repo: "remotion", w: Date.parse("2026-02-08T00:00:00Z") / 1000 }])
  ).toBe("Excludes a Feb 2026 remotion scaffold import (1,040,748 lines) so the monthly scale stays readable.")
  expect(describeOmissions([])).toBe("")
})

test("fills silent months so the histogram stays on a continuous axis", () => {
  expect(fillMonths([
    { additions: 1, commits: 1, deletions: 0, month: "2024-11" },
    { additions: 2, commits: 1, deletions: 1, month: "2025-01" },
  ]).map((month) => month.month)).toEqual(["2024-11", "2024-12", "2025-01"])
})

test("renders additions above the axis, deletions below it, and a commit line", () => {
  const svg = renderLocHistorySvg({
    months: [
      { additions: 100, commits: 2, deletions: 10, month: "2024-01" },
      { additions: 400, commits: 8, deletions: 40, month: "2024-02" },
    ],
    omission: "",
    reposScanned: 2,
    theme: "light",
    totals: { additions: 500, commits: 10, deletions: 50 },
  })

  const additions = [...svg.matchAll(/data-series="additions"[^>]*height="([\d.]+)"/g)].map((match) => Number(match[1]))
  const deletions = [...svg.matchAll(/data-series="deletions"[^>]*height="([\d.]+)"/g)].map((match) => Number(match[1]))
  expect(additions[1]).toBeGreaterThan(additions[0])
  expect(deletions[1]).toBeGreaterThan(deletions[0])
  expect(svg).toContain("Commits per month")
  expect(svg).toContain('stroke="#0969da"')
  expect(svg).toContain("+450 net lines")
})
