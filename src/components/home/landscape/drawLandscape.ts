import { createContours, createDescent, createSurface, project, type Point } from "./landscapeModel"

const surface = createSurface()
const contours = createContours(surface)
const descent = createDescent()

export function drawLandscape(ctx: CanvasRenderingContext2D, elapsed: number, dark: boolean) {
  const angle = Math.sin(elapsed / 13000) * 0.085
  const cycle = elapsed % 22000
  const progress = Math.min(cycle / 17500, 1)
  const end = Math.max(1, Math.floor(progress * (descent.length - 1)))
  const fade = cycle > 21000 ? (22000 - cycle) / 1000 : Math.min(cycle / 650, 1)
  ctx.clearRect(0, 0, 1000, 520)

  const trace = (points: Point[]) => {
    ctx.beginPath()
    points.forEach((p, i) => {
      const screen = project(p, angle)
      if (i === 0) ctx.moveTo(screen.x, screen.y)
      else ctx.lineTo(screen.x, screen.y)
    })
  }

  ctx.strokeStyle = dark ? "#a1aa8738" : "#74795638"
  ctx.lineWidth = 0.7
  for (const segment of contours) { trace(segment); ctx.stroke() }

  const sorted = surface.map((cell) => ({
    ...cell,
    depth: project(cell.points[0], angle).depth,
  })).sort((a, b) => a.depth - b.depth)

  for (const cell of sorted) {
    const t = Math.min(1, Math.max(0, (cell.height - 0.5) / 2.35))
    // Plum in the valleys, warm limestone on the ridges.
    const low = dark ? [87, 77, 105] : [111, 99, 137]
    const high = dark ? [218, 206, 163] : [224, 207, 166]
    const rgb = low.map((value, i) => Math.round(value + (high[i] - value) * t))
    ctx.fillStyle = `rgb(${rgb.join(",")})`
    trace(cell.points)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = dark ? "#eee7cc12" : "#fff7e31a"
    ctx.lineWidth = 0.55
    ctx.stroke()
  }

  ctx.globalAlpha = fade
  trace(descent.slice(0, end + 1))
  ctx.strokeStyle = dark ? "#f4eccd" : "#fff9e4"
  ctx.lineWidth = 2
  ctx.lineJoin = "round"
  ctx.stroke()
  const marker = project(descent[end], angle)
  ctx.beginPath()
  ctx.arc(marker.x, marker.y, 5, 0, Math.PI * 2)
  ctx.fillStyle = "#fff9e4"
  ctx.shadowColor = "#efe4af"
  ctx.shadowBlur = 12
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.globalAlpha = 1

  ctx.fillStyle = dark ? "#b5bbaa" : "#626958"
  ctx.font = "11px ui-monospace, monospace"
  ctx.fillText("θ₁", 904, 349)
  ctx.fillText("θ₂", 72, 349)
}
