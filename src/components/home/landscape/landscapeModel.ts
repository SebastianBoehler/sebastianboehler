export type Point = { x: number; y: number; z: number }
export type Cell = { points: Point[]; height: number }

// An illustrative two-parameter objective, not measurements from a trained model.
export function loss(x: number, y: number) {
  return 1.15 + 0.13 * (x * x + y * y)
    + 0.48 * Math.sin(1.2 * x) * Math.cos(1.1 * y)
    - 0.9 * Math.exp(-((x - 0.6) ** 2 + (y - 0.2) ** 2) / 0.65)
}

export function gradient(x: number, y: number) {
  const basin = Math.exp(-((x - 0.6) ** 2 + (y - 0.2) ** 2) / 0.65)
  return {
    x: 0.26 * x + 0.576 * Math.cos(1.2 * x) * Math.cos(1.1 * y) + 1.8 / 0.65 * (x - 0.6) * basin,
    y: 0.26 * y - 0.528 * Math.sin(1.2 * x) * Math.sin(1.1 * y) + 1.8 / 0.65 * (y - 0.2) * basin,
  }
}

const point = (x: number, y: number): Point => ({ x, y, z: loss(x, y) })

export function createSurface(): Cell[] {
  const cells: Cell[] = []
  const step = 5 / 36
  for (let i = 0; i < 36; i++) {
    for (let j = 0; j < 36; j++) {
      const x = -2.5 + i * step
      const y = -2.5 + j * step
      const points = [point(x, y), point(x + step, y), point(x + step, y + step), point(x, y + step)]
      cells.push({ points, height: points.reduce((sum, p) => sum + p.z, 0) / 4 })
    }
  }
  return cells
}

export function createDescent(): Point[] {
  const points = [point(-1.8, -1.7)]
  for (let i = 0; i < 320; i++) {
    const current = points[points.length - 1]
    const g = gradient(current.x, current.y)
    points.push(point(current.x - 0.07 * g.x, current.y - 0.07 * g.y))
  }
  return points
}

export function project(p: Point, angle: number) {
  const x = p.x * Math.cos(angle) - p.y * Math.sin(angle)
  const y = p.x * Math.sin(angle) + p.y * Math.cos(angle)
  return { x: 500 + (x - y) * 83, y: 365 + (x + y) * 26 - p.z * 65, depth: x + y }
}

// Marching edges give real level-set contours on the floor beneath the surface.
export function createContours(cells: Cell[]) {
  const segments: Point[][] = []
  for (let level = 0.6; level < 2.9; level += 0.2) {
    for (const cell of cells) {
      const crossings: Point[] = []
      for (let i = 0; i < 4; i++) {
        const a = cell.points[i]
        const b = cell.points[(i + 1) % 4]
        if ((a.z < level) === (b.z < level)) continue
        const t = (level - a.z) / (b.z - a.z)
        crossings.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: -0.25 })
      }
      for (let i = 0; i + 1 < crossings.length; i += 2) segments.push(crossings.slice(i, i + 2))
    }
  }
  return segments
}
