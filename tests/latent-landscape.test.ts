import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import LatentLandscapePlot from "@/components/blog/LatentLandscapePlot"
import {
  canReplayLandscape,
  createLandscapeFigure,
  landscapeTrace,
  planLandscapeRender,
  resetLandscapeCamera,
  rotateLandscapeCamera,
} from "@/components/blog/latentLandscapeModel"
import type { LandscapeTheme } from "@/components/blog/latentLandscapeTheme"

const theme: LandscapeTheme = {
  paper: "rgb(250, 250, 250)",
  paperOverlay: "rgba(250, 250, 250, 0.9)",
  ink: "rgb(20, 20, 20)",
  muted: "rgb(90, 90, 90)",
  rule: "rgba(120, 120, 120, 0.8)",
  ruleSoft: "rgba(120, 120, 120, 0.55)",
  accent: "rgb(30, 80, 210)",
  fontFamily: "system-ui",
}

test("themes the latent landscape from the surrounding concept lab", () => {
  const figure = createLandscapeFigure("beginner", 2, 1, theme)
  const path = figure.data[landscapeTrace.path] as { line: { color: string } }
  const annotations = figure.layout.scene.annotations

  expect(figure.layout.paper_bgcolor).toBe(theme.paper)
  expect(figure.layout.scene.bgcolor).toBe(theme.paper)
  expect(path.line.color).toBe(theme.accent)
  expect(annotations[0].font.color).toBe(theme.ink)
  expect(annotations[1].arrowcolor).toBe(theme.accent)
})

test("theme refreshes preserve trajectory progress and the active camera", () => {
  const camera = {
    center: { x: 0.1, y: -0.2, z: 0.05 },
    eye: { x: -1.2, y: 1.6, z: 0.9 },
    up: { x: 0, y: 0, z: 1 },
    projection: { type: "perspective" as const },
  }
  const plan = planLandscapeRender({
    reason: "theme",
    stage: 2,
    progress: 0.47,
    camera,
    reduceMotion: false,
  })

  expect(plan).toEqual({ animate: false, progress: 0.47, camera })
})

test("reduced motion renders the completed path without offering replay", () => {
  const camera = {
    center: { x: 0, y: 0.03, z: -0.08 },
    eye: { x: 1.48, y: -1.62, z: 1.08 },
    up: { x: 0, y: 0, z: 1 },
    projection: { type: "perspective" as const },
  }
  const plan = planLandscapeRender({
    reason: "content",
    stage: 2,
    progress: 0,
    camera,
    reduceMotion: true,
  })

  expect(plan).toEqual({ animate: false, progress: 1, camera })
  expect(canReplayLandscape(2, true)).toBe(false)
})

test("rotates and resets the camera deterministically", () => {
  const camera = resetLandscapeCamera()
  const rotated = rotateLandscapeCamera(camera, Math.PI / 2)

  expect(rotated.eye.x).toBeCloseTo(1.62, 8)
  expect(rotated.eye.y).toBeCloseTo(1.48, 8)
  expect(rotated.eye.z).toBe(1.08)
  expect(resetLandscapeCamera()).toEqual(camera)
})

test("exposes named camera controls alongside concise instructions", () => {
  const markup = renderToStaticMarkup(createElement(LatentLandscapePlot, {
    frameId: "beginner",
    stage: 2,
  }))

  expect(markup).toContain('role="group"')
  expect(markup).toContain('aria-label="Rotate landscape left"')
  expect(markup).toContain('aria-label="Rotate landscape right"')
  expect(markup).toContain('aria-label="Reset landscape view"')
  expect(markup).toContain("Use the view controls or drag the landscape to rotate it.")
})

test("uses opaque overlays and 44px camera targets", async () => {
  const css = await Bun.file("src/components/blog/LatentLandscapePlot.module.css").text()
  const cameraButtonRule = css.match(/\.cameraButton\s*\{[^}]+\}/)?.[0] ?? ""
  const overlayRule = css.match(/\.badge,\s*\n\.replay,\s*\n\.cameraControls\s*\{[^}]+\}/)?.[0] ?? ""

  expect(css).not.toContain("backdrop-filter")
  expect(overlayRule).toContain("background: var(--lab-paper)")
  expect(overlayRule).not.toMatch(/transparent|color-mix/)
  expect(cameraButtonRule).toContain("width: 44px")
  expect(cameraButtonRule).toContain("height: 44px")
  expect(css).toContain("prefers-reduced-transparency: reduce")
  expect(css).toContain("forced-colors: active")
})

test("keeps replay absolutely anchored when keyboard focused", async () => {
  const css = await Bun.file("src/components/blog/LatentLandscapePlot.module.css").text()
  const replayFocusRule = css.match(/\.replay:focus-visible\s*\{[^}]+\}/)?.[0] ?? ""

  expect(replayFocusRule).not.toContain("position: relative")
  expect(replayFocusRule).toContain("z-index: 2")
})

test("stacks replay above the camera group at narrow viewport widths", async () => {
  const css = await Bun.file("src/components/blog/LatentLandscapePlot.module.css").text()
  const narrowRules = css.match(/@media \(max-width: 359px\) \{[\s\S]+/)?.[0] ?? ""
  const replayRule = narrowRules.match(/\.replay\s*\{[^}]+\}/)?.[0] ?? ""

  expect(replayRule).toContain("bottom: 4.75rem")
})
