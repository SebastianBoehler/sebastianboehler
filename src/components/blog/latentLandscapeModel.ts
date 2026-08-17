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
import type { LandscapeTheme } from "@/components/blog/latentLandscapeTheme"

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

export function createLandscapeFigure(
  frameId: PromptFrameId,
  stage: LandscapeStage,
  progress: number,
  theme: LandscapeTheme,
) {
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
          x: { show: true, start: -3.2, end: 3.2, size: 0.32, color: theme.rule, width: 1 },
          y: { show: true, start: -2.7, end: 2.7, size: 0.3, color: theme.rule, width: 1 },
          z: { show: true, start: -1.8, end: 1.2, size: 0.22, color: theme.ruleSoft, width: 1, project: { z: true } },
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
          color: [theme.ink, ...destinations.map((item) => item === route ? theme.accent : theme.paper)],
          size: [5.4, ...destinations.map((item) => item === route ? 7.4 : 5.2)],
          line: { color: theme.ink, width: 1.5 },
          opacity: stage === 0 ? 1 : 0.82,
        },
        hoverinfo: "skip",
        showlegend: false,
      },
      pathTrace(path, theme.paper, 13),
      pathTrace(path, theme.accent, 7),
      {
        type: "scatter3d",
        mode: "markers",
        x: path.head ? [path.head[0]] : [],
        y: path.head ? [path.head[1]] : [],
        z: path.head ? [pointHeight(path.head, 0.18)] : [],
        marker: { color: theme.accent, size: 8.2, line: { color: theme.paper, width: 2.5 } },
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
        textfont: { color: theme.ink, size: 10, family: theme.fontFamily },
        marker: {
          color: theme.accent,
          size: stage === 2 ? 6.2 : 5.2,
          opacity: stage === 3 ? 0.82 : 0.94,
          line: { color: theme.paper, width: 1.5 },
        },
        hoverinfo: "skip",
        showlegend: false,
      },
    ],
    layout: {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: theme.paper,
      plot_bgcolor: theme.paper,
      scene: {
        aspectmode: "manual",
        aspectratio: { x: 1.48, y: 1.08, z: 0.66 },
        bgcolor: theme.paper,
        camera: {
          center: { x: 0, y: 0.03, z: -0.08 },
          eye: { x: 1.48, y: -1.62, z: 1.08 },
          projection: { type: "perspective" },
        },
        xaxis: groundAxis(),
        yaxis: groundAxis(),
        zaxis: { ...groundAxis(), range: [-2.2, 1.45], showbackground: true, backgroundcolor: theme.paper },
        annotations: [
          landscapeAnnotation(route.points[0], "A · shared topic", false, theme, true),
          ...destinations.map((item) => landscapeAnnotation(
            item.points[item.points.length - 1],
            item === route ? `B · ${item.destination}` : item.destination,
            item === route,
            theme,
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

function landscapeAnnotation(
  point: Point,
  text: string,
  active: boolean,
  theme: LandscapeTheme,
  isOrigin = false,
) {
  return {
    x: point[0],
    y: point[1],
    z: pointHeight(point, 0.22),
    text: `<b>${text}</b>`,
    showarrow: true,
    arrowcolor: active ? theme.accent : theme.muted,
    arrowwidth: 1.2,
    arrowhead: 0,
    ax: isOrigin ? 28 : active ? 34 : -18,
    ay: active ? -44 : -20,
    bgcolor: theme.paperOverlay,
    borderpad: 2,
    font: { color: theme.ink, size: active ? 11 : 10, family: theme.fontFamily },
    opacity: active ? 1 : 0.72,
  }
}
