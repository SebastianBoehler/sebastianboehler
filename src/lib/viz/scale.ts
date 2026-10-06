export interface LinearScale {
  (value: number): number
  invert(pixel: number): number
  readonly domain: readonly [number, number]
  readonly range: readonly [number, number]
  ticks(count?: number): number[]
}

export function linear(
  domain: readonly [number, number],
  range: readonly [number, number],
): LinearScale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0 || 1
  const scale = ((value: number) => r0 + ((value - d0) / span) * (r1 - r0)) as LinearScale
  scale.invert = (pixel: number) => d0 + ((pixel - r0) / (r1 - r0 || 1)) * span
  Object.defineProperty(scale, "domain", { value: domain })
  Object.defineProperty(scale, "range", { value: range })
  scale.ticks = (count = 5) => niceTicks(Math.min(d0, d1), Math.max(d0, d1), count)
  return scale
}

/** "Nice" tick values (1, 2, 5 x 10^k) covering [min, max] without leaving it. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!(max > min)) return [min]
  const rawStep = (max - min) / Math.max(1, count)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  const step = (residual >= Math.sqrt(50) ? 10 : residual >= Math.sqrt(10) ? 5 : residual >= Math.SQRT2 ? 2 : 1) * magnitude
  const first = Math.ceil(min / step - 1e-9) * step
  const ticks: number[] = []
  for (let value = first; value <= max + step * 1e-9; value += step) {
    ticks.push(Number(value.toPrecision(12)))
  }
  return ticks
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function extent(values: readonly number[], pad = 0): [number, number] {
  let lo = Infinity
  let hi = -Infinity
  for (const value of values) {
    if (value < lo) lo = value
    if (value > hi) hi = value
  }
  const span = hi - lo || 1
  return [lo - span * pad, hi + span * pad]
}

export function linePath(points: readonly (readonly [number, number])[]): string {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)},${round(y)}`)
    .join("")
}

export function areaPath(
  points: readonly (readonly [number, number])[],
  baselineY: number,
): string {
  if (points.length === 0) return ""
  const first = points[0]
  const last = points[points.length - 1]
  return `${linePath(points)}L${round(last[0])},${round(baselineY)}L${round(first[0])},${round(baselineY)}Z`
}

/** Right-continuous step path, for piecewise-constant functions such as trees. */
export function stepPath(points: readonly (readonly [number, number])[]): string {
  let d = ""
  points.forEach(([x, y], i) => {
    if (i === 0) d += `M${round(x)},${round(y)}`
    else {
      const previousY = points[i - 1][1]
      d += `L${round(x)},${round(previousY)}L${round(x)},${round(y)}`
    }
  })
  return d
}

export function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "–"
  const fixed = value.toFixed(digits)
  return fixed.replace(/\.?0+$/, "") || "0"
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
