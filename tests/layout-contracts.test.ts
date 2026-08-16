import { expect, test } from "bun:test"
import { join } from "node:path"

const root = join(import.meta.dir, "..")

async function source(path: string) {
  const file = Bun.file(join(root, path))
  return (await file.exists()) ? file.text() : ""
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

test("closes the mobile menu on selection or Escape and restores focus", async () => {
  const header = await source("src/components/site/SiteHeader.tsx")

  expect(header).toContain('event.key === "Escape"')
  expect(header).toContain("menuButtonRef.current?.focus()")
  expect(header).toContain(
    '<nav id="mobile-navigation" className="site-header__mobile-nav" aria-label="Mobile navigation" onClick={closeMenu}>',
  )
})
