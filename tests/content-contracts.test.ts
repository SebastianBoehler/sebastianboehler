import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { About } from "../src/components/home/About"
import { Research } from "../src/components/home/Research"
import { education, experience, profile } from "../src/content/profile"
import { competitions, projects, publications } from "../src/content/work"

function isHttps(href: string) {
  try {
    return new URL(href).protocol === "https:"
  } catch {
    return false
  }
}

test("keeps verified competition results", () => {
  const byId = Object.fromEntries(competitions.map((item) => [item.id, item]))

  expect(byId.fusion.result).toContain("16th of 46")
  expect(byId.fusion.result).toContain("19th of 58")
  expect(byId.learn2design.result).toContain("13th of 110")
  // The EEG/EMG final runs until 21 November; the site gives status only, no ranking.
  expect(byId.eeg.result).not.toMatch(/\d+(st|nd|rd|th) of/)
})

test("keeps experience dates aligned with the CV", () => {
  expect(experience.find((item) => item.organization === "LI.FI")?.period).toBe("Jul 2022–Jul 2023")
  expect(experience[0].role).toBe("Research Assistant")
  expect(education.find((item) => item.role.startsWith("B.Sc."))?.period).toBe("Oct 2024–Dec 2025")
})

test("drops finished or stale entries", () => {
  const text = JSON.stringify({ profile, competitions, projects, publications })

  expect(text).not.toContain("Agenthon")
  expect(text).not.toContain("in preparation")
  expect(text).not.toContain("FlightRL")
})

test("gives every entry at least one https link", () => {
  for (const item of [...competitions, ...projects, ...publications]) {
    expect(item.links.some((link) => isHttps(link.href))).toBe(true)
  }
})

test("ships every research figure it references", async () => {
  for (const item of competitions) {
    if (item.figure) expect(await Bun.file(`public${item.figure.src}`).exists()).toBeTrue()
  }
})

test("renders the competitions with results and figure captions", () => {
  const markup = renderToStaticMarkup(createElement(Research))

  for (const item of competitions) {
    expect(markup).toContain(item.name.replace("&", "&amp;"))
    expect(markup).toContain(item.result)
  }
  expect(markup).toContain("<figcaption>")
})

test("renders experience and education from the authored timeline", () => {
  const markup = renderToStaticMarkup(createElement(About))

  for (const item of [...experience, ...education]) expect(markup).toContain(item.period)
})
