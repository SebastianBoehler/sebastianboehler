import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { ContributionArc } from "../src/components/home/ContributionArc"
import { profile, timeline } from "../src/content/profile"
import { selectedWork } from "../src/content/work"

test("publishes the approved positioning and verified dates", () => {
  expect(profile.hero).toBe("I build AI systems from the environment up.")
  expect(profile.primaryAction.label).toBe("Discuss a collaboration")
  expect(timeline.find((item) => item.organization === "LI.FI")?.period).toBe("Jul 2022–Jul 2023")
})

test("keeps execution and deployment boundaries explicit", () => {
  expect(selectedWork).toHaveLength(4)
  expect(selectedWork.find((item) => item.id === "flightrl")?.boundary).toContain("not live-control authority")
  expect(selectedWork.find((item) => item.id === "hb-capital")?.boundary).toContain("no trading authority")
})

test("keeps every selected work claim attached to evidence, a boundary, and a valid link", () => {
  for (const item of selectedWork) {
    expect(item.evidence.trim().length).toBeGreaterThan(0)
    expect(item.boundary.trim().length).toBeGreaterThan(0)
    expect(item.links.some((link) => {
      try {
        return new URL(link.href).protocol === "https:"
      } catch {
        return false
      }
    })).toBe(true)
  }
})

test("announces a singular contribution grammatically", () => {
  const markup = renderToStaticMarkup(createElement(ContributionArc, {
    state: { status: "ready", years: [{ year: 2018, total: 1, cells: [] }] },
  }))

  expect(markup).toContain("1 contribution")
  expect(markup).not.toContain("1 contributions")
})
