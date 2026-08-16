import { expect, test } from "bun:test"
import { getContributionArc, parseContributionYear } from "../src/lib/github-contributions"

test("parses and orders contribution cells", () => {
  const html = [
    "<h2>12 contributions in 2026</h2>",
    '<td data-date="2026-01-01" data-level="2"></td>',
    '<td data-date="2026-01-02" data-level="4"></td>',
  ].join("")

  const contributions = parseContributionYear(html, 2026)

  expect(contributions.total).toBe(12)
  expect(contributions.cells).toMatchObject([
    { date: "2026-01-01", level: 2 },
    { date: "2026-01-02", level: 4 },
  ])
})

test("returns unavailable when GitHub fails", async () => {
  const state = await getContributionArc(async () => {
    throw new Error("offline")
  }, [2026])

  expect(state).toEqual({
    status: "unavailable",
    message: "GitHub activity is temporarily unavailable.",
  })
})
