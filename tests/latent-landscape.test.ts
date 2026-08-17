import { expect, test } from "bun:test"
import {
  createLandscapeFigure,
  landscapeTrace,
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
