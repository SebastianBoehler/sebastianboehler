import { promptFrames, type PromptFrameId } from "@/components/blog/latentSpaceData"
import {
  latentHeight,
  orbitPoints,
  pointHeight,
  range,
  runCloud,
  smoothRoute,
  type Point,
} from "@/components/blog/latentLandscapeGeometry"

export type LandscapeStage = 0 | 1 | 2 | 3

interface Route {
  destination: string
  points: readonly Point[]
}

export const landscapeTrace = {
  outline: 2,
  path: 3,
  head: 4,
} as const

const routes: Record<PromptFrameId, Route> = {
  beginner: {
    destination: "plain language",
    points: [
      [-2.65, -1.72],
      [-2.1, -1.25],
      [-1.45, -0.75],
      [-0.78, -0.3],
      [-0.02, -0.18],
      [0.72, -0.42],
      [1.4, -0.78],
      [2.02, -1.12],
    ],
  },
  formal: {
    destination: "formal structure",
    points: [
      [-2.65, -1.72],
      [-2.1, -1.25],
      [-1.45, -0.75],
      [-0.78, -0.3],
      [-0.02, -0.18],
      [0.55, 0.22],
      [0.92, 0.78],
      [1.42, 1.38],
    ],
  },
  metaphor: {
    destination: "image-led",
    points: [
      [-2.65, -1.72],
      [-2.1, -1.25],
      [-1.45, -0.75],
      [-0.78, -0.3],
      [-0.02, -0.18],
      [-0.15, 0.42],
      [-0.45, 0.98],
      [-0.78, 1.54],
    ],
  },
}

const routeColors: Record<PromptFrameId, string> = {
  beginner: "#f43f4f",
  formal: "#f43f4f",
  metaphor: "#f43f4f",
}

export function createLandscapeFigure(frameId: PromptFrameId, stage: LandscapeStage, progress: number) {
  const xs = range(-3.25, 3.25, 58)
  const ys = range(-2.75, 2.75, 50)
  const z = ys.map((y) => xs.map((x) => latentHeight(x, y)))
  const route = routes[frameId]
  const frame = promptFrames.find((item) => item.id === frameId) ?? promptFrames[0]
  const destinations = Object.values(routes)
  const path = revealRoute(frameId, progress)
  const endpoint = route.points[route.points.length - 1]
  const optionPoints = stage === 2 ? orbitPoints(endpoint, 3, 0.22) : []
  const runPoints = stage === 3 ? runCloud(endpoint) : []
  const contextualPoints = [...optionPoints, ...runPoints]

  return {
    data: [
      {
        type: "surface",
        x: xs,
        y: ys,
        z,
        cmin: -1.05,
        cmax: 1.16,
        colorscale: [
          [0, "#163b6d"],
          [0.2, "#277c98"],
          [0.42, "#62ba9d"],
          [0.63, "#e4d34f"],
          [0.82, "#f28e2b"],
          [1, "#c9432f"],
        ],
        contours: {
          x: { show: true, start: -3.2, end: 3.2, size: 0.32, color: "rgba(13, 26, 35, .54)", width: 1 },
          y: { show: true, start: -2.7, end: 2.7, size: 0.3, color: "rgba(13, 26, 35, .54)", width: 1 },
          z: { show: true, start: -1.8, end: 1.2, size: 0.22, color: "rgba(18, 36, 50, .42)", width: 1, project: { z: true } },
        },
        hoverinfo: "skip",
        lighting: { ambient: 0.65, diffuse: 0.82, specular: 0.12, roughness: 0.8, fresnel: 0.1 },
        lightposition: { x: -180, y: -260, z: 420 },
        showscale: false,
      },
      {
        type: "scatter3d",
        mode: "markers",
        x: [route.points[0][0], ...destinations.map((item) => item.points[item.points.length - 1][0])],
        y: [route.points[0][1], ...destinations.map((item) => item.points[item.points.length - 1][1])],
        z: [pointHeight(route.points[0], 0.2), ...destinations.map((item) => pointHeight(item.points[item.points.length - 1], 0.2))],
        marker: {
          color: ["#172033", ...destinations.map((item) => item === route ? routeColors[frameId] : "#ffffff")],
          size: [5.4, ...destinations.map((item) => item === route ? 7.4 : 5.2)],
          line: { color: "#172033", width: 1.5 },
          opacity: stage === 0 ? 1 : 0.82,
        },
        hoverinfo: "skip",
        showlegend: false,
      },
      pathTrace(path, "#fffdf7", 13),
      pathTrace(path, routeColors[frameId], 7),
      {
        type: "scatter3d",
        mode: "markers",
        x: path.head ? [path.head[0]] : [],
        y: path.head ? [path.head[1]] : [],
        z: path.head ? [pointHeight(path.head, 0.18)] : [],
        marker: { color: routeColors[frameId], size: 8.2, line: { color: "#fffdf7", width: 2.5 } },
        hoverinfo: "skip",
        showlegend: false,
      },
      {
        type: "scatter3d",
        mode: stage === 2 ? "markers+text" : "markers",
        x: contextualPoints.map(([x]) => x),
        y: contextualPoints.map(([, y]) => y),
        z: contextualPoints.map((point) => pointHeight(point, 0.28)),
        text: stage === 2 ? frame.continuations.map((item) => item.label) : undefined,
        textposition: "top center",
        textfont: { color: "#172033", size: 10, family: "ui-sans-serif, system-ui, sans-serif" },
        marker: {
          color: routeColors[frameId],
          size: stage === 2 ? 6.2 : 5.2,
          opacity: stage === 3 ? 0.82 : 0.94,
          line: { color: "#fffdf7", width: 1.5 },
        },
        hoverinfo: "skip",
        showlegend: false,
      },
    ],
    layout: {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: "#f6f4ee",
      plot_bgcolor: "#f6f4ee",
      scene: {
        aspectmode: "manual",
        aspectratio: { x: 1.48, y: 1.08, z: 0.66 },
        bgcolor: "#f6f4ee",
        camera: {
          center: { x: 0, y: 0.03, z: -0.08 },
          eye: { x: 1.48, y: -1.62, z: 1.08 },
          projection: { type: "perspective" },
        },
        xaxis: groundAxis(),
        yaxis: groundAxis(),
        zaxis: { ...groundAxis(), range: [-2.2, 1.45], showbackground: true, backgroundcolor: "#f6f4ee" },
        annotations: [
          landscapeAnnotation(route.points[0], "A · shared topic", false),
          ...destinations.map((item) => landscapeAnnotation(
            item.points[item.points.length - 1],
            item === route ? `B · ${item.destination}` : item.destination,
            item === route,
          )),
        ],
      },
      autosize: true,
      hovermode: false,
      dragmode: "turntable",
      showlegend: false,
    },
  }
}

export function routeTraceUpdate(frameId: PromptFrameId, progress: number) {
  const path = revealRoute(frameId, progress)
  const line = { x: [path.x], y: [path.y], z: [path.z] }
  const head = path.head
    ? { x: [[path.head[0]]], y: [[path.head[1]]], z: [[pointHeight(path.head, 0.18)]] }
    : { x: [[]], y: [[]], z: [[]] }
  return { line, head }
}

function pathTrace(path: ReturnType<typeof revealRoute>, color: string, width: number) {
  return {
    type: "scatter3d",
    mode: "lines",
    x: path.x,
    y: path.y,
    z: path.z,
    line: { color, width },
    hoverinfo: "skip",
    showlegend: false,
  }
}

function revealRoute(frameId: PromptFrameId, progress: number) {
  const route = smoothRoute(routes[frameId].points, 12)
  const visibleCount = Math.max(0, Math.ceil(route.length * progress))
  const visible = route.slice(0, visibleCount)
  return {
    x: visible.map(([x]) => x),
    y: visible.map(([, y]) => y),
    z: visible.map((point) => pointHeight(point, 0.12)),
    head: visible.at(-1),
  }
}

function groundAxis() {
  return {
    showgrid: false,
    zeroline: false,
    showline: false,
    showticklabels: false,
    showspikes: false,
    ticks: "",
    title: { text: "" },
  }
}

function landscapeAnnotation(point: Point, text: string, active: boolean) {
  return {
    x: point[0],
    y: point[1],
    z: pointHeight(point, 0.22),
    text: `<b>${text}</b>`,
    showarrow: true,
    arrowcolor: active ? "#f43f4f" : "#475569",
    arrowwidth: 1.2,
    arrowhead: 0,
    ax: active ? 34 : -18,
    ay: active ? -44 : -20,
    bgcolor: "rgba(246, 244, 238, .88)",
    borderpad: 2,
    font: { color: "#172033", size: active ? 11 : 10, family: "ui-sans-serif, system-ui, sans-serif" },
    opacity: active ? 1 : 0.72,
  }
}
