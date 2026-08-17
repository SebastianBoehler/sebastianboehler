import { expect, test } from "bun:test"
import { getContributionArc, parseContributionYear } from "../src/lib/github-contributions"

const validYear = (year = 2026) => [
  `<h2>12 contributions in ${year}</h2>`,
  `<td data-date="${year}-01-01" data-level="2"></td>`,
  `<td data-level="4" data-date="${year}-01-02"></td>`,
].join("")

const unavailable = {
  status: "unavailable",
  message: "GitHub activity is temporarily unavailable.",
} as const

test("parses and orders contribution cells", () => {
  const contributions = parseContributionYear(validYear(), 2026)

  expect(contributions.total).toBe(12)
  expect(contributions.cells).toMatchObject([
    { date: "2026-01-01", level: 2 },
    { date: "2026-01-02", level: 4 },
  ])
})

test("rejects malformed successful responses without the expected year structure", async () => {
  for (const html of [
    "<html><title>Challenge</title></html>",
    "<h2>12 contributions in 2025</h2><td data-date=\"2026-01-01\" data-level=\"2\"></td>",
    "<h2>12 contributions in 2026</h2>",
  ]) {
    expect(() => parseContributionYear(html, 2026)).toThrow()
    expect(await getContributionArc(async () => new Response(html), [2026])).toEqual(unavailable)
  }
})

test("rejects invalid contribution dates and levels", () => {
  for (const cell of [
    '<td data-date="2026-02-30" data-level="2"></td>',
    '<td data-date="2025-12-31" data-level="2"></td>',
    '<td data-date="2026-01-01" data-level="5"></td>',
    '<td data-date="2026-01-01" data-level="invalid"></td>',
  ]) {
    expect(() => parseContributionYear(`<h2>1 contribution in 2026</h2>${cell}`, 2026)).toThrow()
  }
})

test("normalizes the leap-year calendar through week 53", () => {
  const html = [
    "<h2>2 contributions in 2028</h2>",
    '<td data-date="2028-01-01" data-level="1"></td>',
    '<td data-date="2028-12-31" data-level="4"></td>',
  ].join("")

  expect(parseContributionYear(html, 2028).cells).toMatchObject([
    { date: "2028-01-01", week: 0, day: 6, level: 1 },
    { date: "2028-12-31", week: 53, day: 0, level: 4 },
  ])
})

test("returns unavailable when GitHub fails", async () => {
  const state = await getContributionArc(async () => {
    throw new Error("offline")
  }, [2026])

  expect(state).toEqual(unavailable)
})

test("returns unavailable for a non-OK GitHub response", async () => {
  const state = await getContributionArc(async () => new Response("Unavailable", { status: 503 }), [2026])

  expect(state).toEqual(unavailable)
})

test("returns unavailable when the bounded request signal has timed out", async () => {
  const timeout = AbortSignal.timeout
  let receivedSignal = false

  try {
    Reflect.set(AbortSignal, "timeout", () =>
      AbortSignal.abort(new DOMException("The request timed out.", "TimeoutError")))

    const state = await getContributionArc(async (_input, init) => {
      receivedSignal = init?.signal instanceof AbortSignal
      init?.signal?.throwIfAborted()
      return new Response(validYear())
    }, [2026])

    expect(receivedSignal).toBe(true)
    expect(state).toEqual(unavailable)
  } finally {
    Reflect.set(AbortSignal, "timeout", timeout)
  }
})
