export type Point = readonly [number, number]

export function latentHeight(x: number, y: number) {
  const bowl = 0.07 * (x * x + 0.7 * y * y)
  const centerRidge = 0.78 * gaussian(x, y, 0.05, 0.32, 0.62, 1.35)
  const rearRidge = 0.42 * gaussian(x, y, -1.9, 2.05, 2.2, 0.52)
  const beginner = -1.35 * gaussian(x, y, 2.02, -1.12, 0.58, 0.52)
  const formal = -1.18 * gaussian(x, y, 1.42, 1.38, 0.58, 0.55)
  const metaphor = -1.12 * gaussian(x, y, -0.78, 1.54, 0.66, 0.52)
  const topic = -0.64 * gaussian(x, y, -2.65, -1.72, 0.72, 0.62)
  const texture = 0.11 * Math.sin(2.15 * x - 0.3) * Math.cos(1.85 * y)
  return bowl + centerRidge + rearRidge + beginner + formal + metaphor + topic + texture - 0.05
}

export function pointHeight(point: Point, offset = 0.1) {
  return latentHeight(point[0], point[1]) + offset
}

export function range(min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, index) => min + (index / (count - 1)) * (max - min))
}

export function orbitPoints([cx, cy]: Point, count: number, radius: number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = -0.35 + (index / count) * Math.PI * 2
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]
  })
}

export function runCloud([cx, cy]: Point): Point[] {
  const spread = 1.3
  const offsets: Point[] = [
    [-0.32, -0.08], [-0.25, 0.16], [-0.18, -0.22], [-0.1, 0.05], [-0.04, 0.29],
    [0.05, -0.27], [0.11, 0.18], [0.17, -0.08], [0.23, 0.29], [0.28, 0.04],
    [0.35, -0.2], [0.39, 0.17], [-0.39, 0.27], [0.02, 0.4],
  ]
  return offsets.map(([x, y]) => [cx + x * spread, cy + y * spread])
}

export function smoothRoute(points: readonly Point[], samples: number): Point[] {
  const result: Point[] = []
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    for (let step = 0; step < samples; step += 1) {
      const t = step / samples
      const t2 = t * t
      const t3 = t2 * t
      result.push([catmull(p0[0], p1[0], p2[0], p3[0], t, t2, t3), catmull(p0[1], p1[1], p2[1], p3[1], t, t2, t3)])
    }
  }
  result.push(points[points.length - 1])
  return result
}

function gaussian(x: number, y: number, cx: number, cy: number, sx: number, sy: number) {
  return Math.exp(-((x - cx) ** 2 / sx + (y - cy) ** 2 / sy))
}

function catmull(p0: number, p1: number, p2: number, p3: number, t: number, t2: number, t3: number) {
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
}
