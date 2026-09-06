import { expect, test } from "bun:test"
import { createDescent, createSurface, gradient, loss, project } from "../src/components/home/landscape/landscapeModel"

test("the analytic gradient matches the displayed loss surface", () => {
  for (const [x, y] of [[-1.8, -1.7], [0.6, 0.2], [2, -1], [-0.5, 1.5]]) {
    const epsilon = 1e-5
    const g = gradient(x, y)
    expect(g.x).toBeCloseTo((loss(x + epsilon, y) - loss(x - epsilon, y)) / (2 * epsilon), 7)
    expect(g.y).toBeCloseTo((loss(x, y + epsilon) - loss(x, y - epsilon)) / (2 * epsilon), 7)
  }
})

test("the animated descent stays on the surface and reduces loss to a stationary point", () => {
  const path = createDescent()
  for (let i = 1; i < path.length; i++) {
    expect(path[i].z).toBeCloseTo(loss(path[i].x, path[i].y), 10)
    expect(path[i].z).toBeLessThanOrEqual(path[i - 1].z + 1e-12)
  }
  const end = path[path.length - 1]
  const g = gradient(end.x, end.y)
  expect(Math.hypot(g.x, g.y)).toBeLessThan(1e-5)
  expect(end.z).toBeLessThan(path[0].z / 2)
})

test("the surface fits inside the canvas throughout the camera motion", () => {
  for (const angle of [-0.085, 0, 0.085]) {
    for (const cell of createSurface()) {
      for (const point of cell.points) {
        const screen = project(point, angle)
        expect(screen.x).toBeGreaterThan(20)
        expect(screen.x).toBeLessThan(980)
        expect(screen.y).toBeGreaterThan(25)
        expect(screen.y).toBeLessThan(490)
      }
    }
  }
})
