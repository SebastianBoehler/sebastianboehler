import { expect, test } from "bun:test"
import { join } from "node:path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { WritingPreview } from "../src/components/home/WritingPreview"

const root = join(import.meta.dir, "..")

async function source(path: string) {
  const file = Bun.file(join(root, path))
  return (await file.exists()) ? file.text() : ""
}

function oklchToRgb(value: string) {
  const match = value.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (!match) throw new Error(`Invalid OKLCH color: ${value}`)

  const [, lightness, chroma, hue] = match.map(Number)
  const radians = hue * Math.PI / 180
  const a = chroma * Math.cos(radians)
  const b = chroma * Math.sin(radians)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]

  return linear.map((channel) => {
    const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055
    return Math.round(Math.max(0, Math.min(1, encoded)) * 255)
  })
}

function apca(foreground: number[], background: number[]) {
  const luminance = (rgb: number[]) =>
    0.2126729 * (rgb[0] / 255) ** 2.4 + 0.7151522 * (rgb[1] / 255) ** 2.4 + 0.072175 * (rgb[2] / 255) ** 2.4
  const clamp = (value: number) => value > 0.022 ? value : value + (0.022 - value) ** 1.414
  const text = clamp(luminance(foreground))
  const canvas = clamp(luminance(background))

  if (canvas > text) {
    const contrast = (canvas ** 0.56 - text ** 0.57) * 1.14
    return contrast < 0.1 ? 0 : (contrast - 0.027) * 100
  }

  const contrast = (canvas ** 0.65 - text ** 0.62) * 1.14
  return contrast > -0.1 ? 0 : (contrast + 0.027) * 100
}

function darkToken(styles: string, name: string) {
  const block = styles.match(/\.dark\s*{([\s\S]*?)}/)?.[1] ?? ""
  return block.match(new RegExp(`${name}:\\s*(oklch\\([^;]+\\))`))?.[1] ?? ""
}

test("provides a focusable skip target", async () => {
  const layout = await source("src/app/layout.tsx")

  expect(layout).toContain('href="#main-content"')
  expect(layout).toContain('id="main-content"')
  expect(layout).toContain('tabIndex={-1}')
})

test("keeps browser zoom available", async () => {
  const layout = await source("src/app/layout.tsx")

  expect(layout).not.toContain("maximumScale")
})

test("keeps the theme action aligned with the pre-hydration document theme", async () => {
  const toggle = await source("src/components/site/ThemeToggle.tsx")
  const siteStyles = await source("src/components/site/site.css")

  expect(toggle).toContain("theme-toggle__to-dark")
  expect(toggle).toContain("theme-toggle__to-light")
  expect(toggle).not.toContain("nextTheme")
  expect(siteStyles).toMatch(/\.theme-toggle__to-light\s*{[^}]*display: none/)
  expect(siteStyles).toMatch(/\.dark \.theme-toggle__to-dark\s*{[^}]*display: none/)
  expect(siteStyles).toMatch(/\.dark \.theme-toggle__to-light\s*{[^}]*display: inline-grid/)
})

test("keeps dark secondary and primary-control text above the APCA QA floor", async () => {
  const styles = await source("src/app/globals.css")
  const canvas = oklchToRgb(darkToken(styles, "--canvas"))
  const muted = oklchToRgb(darkToken(styles, "--muted"))
  const accent = oklchToRgb(darkToken(styles, "--accent"))
  const onAccent = oklchToRgb(darkToken(styles, "--on-accent"))

  expect(Math.abs(apca(muted, canvas))).toBeGreaterThanOrEqual(75)
  expect(Math.abs(apca(onAccent, accent))).toBeGreaterThanOrEqual(75)
})

test("closes the mobile menu on selection or Escape and restores focus", async () => {
  const header = await source("src/components/site/SiteHeader.tsx")

  expect(header).toContain('event.key === "Escape"')
  expect(header).toContain("menuButtonRef.current?.focus()")
  expect(header).toContain(
    '<nav id="mobile-navigation" className="site-header__mobile-nav" aria-label="Mobile navigation" onClick={closeMenu}>',
  )
})

test("keeps compact footer links at least 44px wide", async () => {
  const siteStyles = await source("src/components/site/site.css")

  expect(siteStyles).toMatch(/\.site-footer__links a\s*{[^}]*min-width: 44px/)
})

test("keeps concept-lab controls at least 44px in both axes", async () => {
  const conceptLabStyles = await source("src/app/concept-lab.css")

  expect(conceptLabStyles).toMatch(/\.concept-lab button\s*{[^}]*min-width: 44px[^}]*min-height: 44px/)
  expect(conceptLabStyles).not.toContain("min-height: 2.5rem")
})

test("keeps recent essay title links at least 44px high", () => {
  const markup = renderToStaticMarkup(createElement(WritingPreview, {
    posts: [{
      slug: "target-test",
      title: "Measured essay target",
      description: "A representative one-line desktop essay description.",
      date: "2026-08-17",
      tags: [],
    }],
  }))

  expect(markup).toMatch(
    /<a(?=[^>]*href="\/blog\/target-test")(?=[^>]*class="[^"]*\bmin-h-11\b[^"]*")[^>]*>/,
  )
})
