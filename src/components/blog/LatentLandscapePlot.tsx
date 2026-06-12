"use client"

import { useEffect, useRef, useState } from "react"

const colors = {
  blue: "#1d4ed8",
  magenta: "#be185d",
}

export default function LatentLandscapePlot() {
  const plotRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let resizeObserver: ResizeObserver | undefined
    const plotNode = plotRef.current

    async function render() {
      try {
        const Plotly = (await import("plotly.js-dist-min")).default
        if (disposed || !plotNode) {
          return
        }

        const figure = createFigure()
        await Plotly.newPlot(plotNode, figure.data, figure.layout, {
          displayModeBar: false,
          responsive: true,
        })

        resizeObserver = new ResizeObserver(() => {
          if (plotNode) {
            Plotly.Plots.resize(plotNode)
          }
        })
        resizeObserver.observe(plotNode)
      } catch {
        if (!disposed) {
          setFailed(true)
        }
      }
    }

    render()

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      if (plotNode) {
        import("plotly.js-dist-min").then((module) => module.default.purge(plotNode))
      }
    }
  }, [])

  if (failed) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        3D landscape failed to load.
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div ref={plotRef} aria-label="Interactive 3D latent landscape with two prompt trajectories" className="absolute inset-0" />
    </div>
  )
}

function createFigure() {
  const xs = range(-3.2, 3.2, 52)
  const ys = range(-2.7, 2.7, 44)
  const z = ys.map((y) => xs.map((x) => energy(x, y)))
  const paths = [
    buildPath(
      [
        [-3.7, 2.2],
        [-2.75, 1.75],
        [-2.1, 1.26],
        [-1.55, 0.82],
        [-1.04, 0.42],
        [-0.52, 0.12],
        [0.2, -0.15],
      ],
      colors.blue,
    ),
    buildPath(
      [
        [3.65, 2.05],
        [2.72, 1.45],
        [2.14, 1.04],
        [1.62, 0.66],
        [1.14, 0.26],
        [0.68, -0.04],
        [0.2, -0.15],
      ],
      colors.magenta,
    ),
  ]

  return {
    data: [
      {
        type: "surface",
        x: xs,
        y: ys,
        z,
        colorscale: [
          [0, "#1f5fbf"],
          [0.24, "#40a6b8"],
          [0.5, "#d8d783"],
          [0.72, "#e99b47"],
          [1, "#b33b2e"],
        ],
        hoverinfo: "skip",
        lighting: { ambient: 0.92, diffuse: 0.52, specular: 0, roughness: 1, fresnel: 0 },
        lightposition: { x: 0, y: -500, z: 500 },
        opacity: 0.9,
        showscale: false,
      },
      ...paths.flatMap((path) => [
        {
          type: "scatter3d",
          mode: "lines",
          x: path.x,
          y: path.y,
          z: path.z,
          line: { color: path.color, width: 5.5 },
          hoverinfo: "skip",
          showlegend: false,
        },
        {
          type: "scatter3d",
          mode: "markers",
          x: [path.x[1], path.x[path.x.length - 1]],
          y: [path.y[1], path.y[path.y.length - 1]],
          z: [path.z[1], path.z[path.z.length - 1]],
          marker: { color: path.color, size: 5.5, line: { color: path.color, width: 0 } },
          hoverinfo: "skip",
          showlegend: false,
        },
      ]),
    ],
    layout: {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      scene: {
        aspectmode: "manual",
        aspectratio: { x: 1.55, y: 1.06, z: 0.42 },
        camera: {
          center: { x: 0, y: 0, z: -0.2 },
          eye: { x: 1.05, y: -1.28, z: 0.68 },
          projection: { type: "orthographic" },
        },
        xaxis: hiddenAxis([-3.05, 3.05]),
        yaxis: hiddenAxis([-2.5, 2.55]),
        zaxis: hiddenAxis([-2.1, 1.55]),
      },
      autosize: true,
      hovermode: false,
      dragmode: "turntable",
    },
  }
}

function hiddenAxis(range?: [number, number]) {
  return { range, visible: false, showgrid: false, zeroline: false, showticklabels: false, showspikes: false }
}

function buildPath(points: number[][], color: string) {
  const smoothed = catmullRom(points, 7)
  return {
    color,
    x: smoothed.map(([x]) => x),
    y: smoothed.map(([, y]) => y),
    z: smoothed.map(([x, y]) => energy(x, y) + 0.16),
  }
}

function energy(x: number, y: number) {
  const basin = -1.95 * Math.exp(-((x - 0.18) ** 2 / 0.92 + (y + 0.12) ** 2 / 0.62))
  const leftPeak = 1.2 * Math.exp(-((x + 2.25) ** 2 / 0.82 + (y - 1.58) ** 2 / 0.72))
  const rightPeak = 1.12 * Math.exp(-((x - 2.3) ** 2 / 0.84 + (y - 1.38) ** 2 / 0.78))
  const rearRidge = 0.68 * Math.exp(-((y - 2.1) ** 2) / 1.5)
  const waves = 0.18 * Math.sin(2.4 * x) * Math.cos(2.1 * y)
  return basin + leftPeak + rightPeak + rearRidge + waves
}

function range(min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, index) => min + (index / (count - 1)) * (max - min))
}

function catmullRom(points: number[][], samples: number) {
  const result: number[][] = []
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    for (let step = 0; step < samples; step += 1) {
      const t = step / samples
      const t2 = t * t
      const t3 = t2 * t
      result.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ])
    }
  }
  result.push(points[points.length - 1])
  return result
}
