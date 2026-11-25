import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { About } from "../src/components/home/About"
import { Research } from "../src/components/home/Research"
import { NetworkingOverview } from "../src/components/home/NetworkingOverview"
import { education, experience, profile } from "../src/content/profile"
import { competitions, neuripsCompetitions, projects, publications } from "../src/content/work"

function isHttps(href: string) {
  try {
    return new URL(href).protocol === "https:"
  } catch {
    return false
  }
}

test("keeps verified competition results", () => {
  const byId = Object.fromEntries(competitions.map((item) => [item.id, item]))

  expect(byId.fusion.result).toContain("11th, cross-machine generalisation")
  expect(byId.fusion.result).toContain("18th, DIII-D")
  expect(byId.learn2design.result).toContain("13th of 110")
  expect(byId.agenthon.result).toStartWith("2nd of 63, Explainability track")
  expect(competitions[0].id).toBe("agenthon")
  expect(byId.eeg.result).toBe("11th in the sealed final (provisional pending audit) · 84.4% cell-mean balanced accuracy")
  expect(byId["start-hack"].result).toBe("1st of 12 teams in the QuantCo challenge")
  expect(neuripsCompetitions).toContain(byId.eeg)
  expect(neuripsCompetitions).not.toContain(byId["start-hack"])
})

test("keeps experience dates aligned with the CV", () => {
  expect(experience.find((item) => item.organization === "LI.FI")?.period).toBe("Jul 2022–Jul 2023")
  expect(experience[0].role).toBe("Research Assistant")
  expect(education.find((item) => item.role.startsWith("B.Sc."))?.period).toBe("Oct 2024–Dec 2025")
})

test("drops finished or stale entries", () => {
  const text = JSON.stringify({ profile, competitions, projects, publications })
  // No prize amounts until the award payment is verified.
  expect(text).not.toMatch(/prize|\$\s?\d/i)

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
    for (const placing of item.result.split(" · ")) expect(markup).toContain(placing)
  }
  expect(markup).toContain('<p class="entry__result">2nd of 63, Explainability track<span class="entry__result-rest">')
  expect(markup).toContain("<figcaption>")
})

test("renders experience and education from the authored timeline", () => {
  const markup = renderToStaticMarkup(createElement(About))

  for (const item of [...experience, ...education]) expect(markup).toContain(item.period)
})

test("networking overview keeps results qualified and HB Capital in the background", () => {
  const markup = renderToStaticMarkup(createElement(NetworkingOverview, { posts: [] }))

  expect(markup.indexOf("QuantCo challenge")).toBeLessThan(markup.indexOf("Agenthon"))
  expect(markup).toContain("provisional pending audit")
  expect(markup).toContain("Explainability track")
  expect(markup).toContain("Hardware policy tests next")
  expect(markup).not.toContain("HB Capital")
  expect(markup).toContain('href="/sebastian_boehler_cv.pdf"')
  expect(markup).toContain("mailto:contact@sebastian-boehler.com")
  expect(markup.match(/<h1\b/g)).toHaveLength(1)
})
