"use client"

import { useEffect, useRef, useState, type MutableRefObject } from "react"
import {
  canReplayLandscape,
  cloneLandscapeCamera,
  planLandscapeRender,
  resetLandscapeCamera,
  rotateLandscapeCamera,
  type LandscapeCamera,
} from "@/components/blog/latentLandscapeInteraction"
import {
  createLandscapeFigure,
  landscapeTrace,
  routeTraceUpdate,
  type LandscapeStage,
} from "@/components/blog/latentLandscapeModel"
import { readLandscapeTheme } from "@/components/blog/latentLandscapeTheme"
import type { PromptFrameId } from "@/components/blog/latentSpaceData"

type PlotlyApi = typeof import("plotly.js-dist-min").default
type PlotNode = HTMLDivElement & {
  _fullLayout?: { scene?: { camera?: LandscapeCamera } }
  on?: (event: string, listener: () => void) => void
  removeListener?: (event: string, listener: () => void) => void
}

interface PlotRuntime {
  animationFrame: number
  camera: LandscapeCamera
  contentRevision: number
  disposed: boolean
  node: PlotNode | null
  plotted: boolean
  plotly?: PlotlyApi
  progress: number
  queue: Promise<void>
  relayoutListener?: () => void
}

interface RenderSnapshot {
  frameId: PromptFrameId
  reduceMotion: boolean | null
  stage: LandscapeStage
}

interface ContentInputs extends RenderSnapshot {
  reduceMotion: boolean
  replayKey: number
}

const plotConfig = {
  displayModeBar: false,
  responsive: true,
  scrollZoom: false,
}

export function useLatentLandscapePlot(frameId: PromptFrameId, stage: LandscapeStage) {
  const plotRef = useRef<HTMLDivElement>(null)
  const runtimeRef = useRef<PlotRuntime | null>(null)
  const latestRef = useRef<RenderSnapshot>({ frameId, reduceMotion: null, stage })
  const previousContentRef = useRef<ContentInputs | null>(null)
  const [failed, setFailed] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [runtimeRevision, setRuntimeRevision] = useState(0)

  if (!runtimeRef.current) runtimeRef.current = createRuntime()
  latestRef.current = { frameId, reduceMotion, stage }

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(query.matches)
    updatePreference()
    query.addEventListener("change", updatePreference)
    return () => query.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    const runtime = runtimeRef.current!
    const plotNode = plotRef.current as PlotNode | null
    runtime.node = plotNode
    runtime.disposed = false
    const resizeObserver = new ResizeObserver(() => {
      if (runtime.plotted && runtime.node && runtime.plotly) {
        runtime.plotly.Plots.resize(runtime.node)
      }
    })
    const reportFailure = (error: unknown) => fail(runtime, error, setFailed, setInteractive)
    const themeObserver = new MutationObserver(() => {
      enqueueThemeRender(runtime, latestRef, reportFailure)
    })

    if (plotNode) resizeObserver.observe(plotNode)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    import("plotly.js-dist-min")
      .then(({ default: Plotly }) => {
        if (!runtime.disposed) {
          runtime.plotly = Plotly
          setRuntimeRevision((value) => value + 1)
        }
      })
      .catch(reportFailure)

    return () => {
      runtime.disposed = true
      runtime.contentRevision += 1
      cancelAnimationFrame(runtime.animationFrame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      if (runtime.node && runtime.relayoutListener) {
        runtime.node.removeListener?.("plotly_relayout", runtime.relayoutListener)
      }
      if (runtime.node && runtime.plotly) runtime.plotly.purge(runtime.node)
      runtime.plotted = false
      runtime.relayoutListener = undefined
    }
  }, [])

  useEffect(() => {
    const runtime = runtimeRef.current!
    if (!runtime.node || !runtime.plotly || reduceMotion === null) return
    const inputs = { frameId, reduceMotion, replayKey, stage }
    const reason = renderReason(previousContentRef.current, inputs)
    previousContentRef.current = inputs
    cancelAnimationFrame(runtime.animationFrame)
    const revision = ++runtime.contentRevision
    runtime.queue = runtime.queue
      .then(() => renderContent(runtime, inputs, reason, revision))
      .then(() => {
        if (!runtime.disposed && revision === runtime.contentRevision) {
          setFailed(false)
          setInteractive(true)
        }
      })
      .catch((error) => fail(runtime, error, setFailed, setInteractive))
  }, [frameId, reduceMotion, replayKey, runtimeRevision, stage])

  const updateCamera = (radians: number | null) => {
    const runtime = runtimeRef.current!
    if (!interactive || !runtime.node || !runtime.plotly) return
    const current = readLiveCamera(runtime) ?? runtime.camera
    const next = radians === null ? resetLandscapeCamera() : rotateLandscapeCamera(current, radians)
    runtime.camera = cloneLandscapeCamera(next)
    Promise.resolve(runtime.plotly.relayout(runtime.node, { "scene.camera": next }))
      .catch((error) => fail(runtime, error, setFailed, setInteractive, "update the landscape camera"))
  }

  return {
    failed,
    interactive,
    plotRef,
    reduceMotion,
    replay: () => {
      if (reduceMotion !== null && canReplayLandscape(stage, reduceMotion)) {
        setReplayKey((value) => value + 1)
      }
    },
    resetView: () => updateCamera(null),
    rotateLeft: () => updateCamera(-Math.PI / 12),
    rotateRight: () => updateCamera(Math.PI / 12),
  }
}

function createRuntime(): PlotRuntime {
  return {
    animationFrame: 0,
    camera: resetLandscapeCamera(),
    contentRevision: 0,
    disposed: false,
    node: null,
    plotted: false,
    progress: 0,
    queue: Promise.resolve(),
  }
}

function renderReason(previous: ContentInputs | null, current: ContentInputs) {
  if (previous && previous.frameId === current.frameId && previous.stage === current.stage
    && previous.replayKey === current.replayKey) return "preference" as const
  return previous && previous.replayKey !== current.replayKey ? "replay" as const : "content" as const
}

async function renderContent(
  runtime: PlotRuntime,
  snapshot: ContentInputs,
  reason: "content" | "preference" | "replay",
  revision: number,
) {
  if (!runtime.node || !runtime.plotly || runtime.disposed || revision !== runtime.contentRevision) return
  runtime.camera = readLiveCamera(runtime) ?? runtime.camera
  const plan = planLandscapeRender({ ...snapshot, reason, progress: runtime.progress, camera: runtime.camera })
  runtime.progress = plan.progress
  const figure = createLandscapeFigure(
    snapshot.frameId,
    snapshot.stage,
    plan.progress,
    readLandscapeTheme(runtime.node),
    cloneLandscapeCamera(plan.camera),
  )

  if (runtime.plotted) {
    await runtime.plotly.react(runtime.node, figure.data, figure.layout, plotConfig)
  } else {
    await runtime.plotly.newPlot(runtime.node, figure.data, figure.layout, plotConfig)
    runtime.plotted = true
    attachCameraListener(runtime)
  }
  if (plan.animate && revision === runtime.contentRevision && !runtime.disposed) {
    animateRoute(runtime, snapshot.frameId, revision)
  }
}

function enqueueThemeRender(
  runtime: PlotRuntime,
  latestRef: MutableRefObject<RenderSnapshot>,
  reportFailure: (error: unknown) => void,
) {
  runtime.queue = runtime.queue
    .then(async () => {
      const snapshot = latestRef.current
      if (runtime.disposed || !runtime.plotted || !runtime.node || !runtime.plotly
        || snapshot.reduceMotion === null) return
      runtime.camera = readLiveCamera(runtime) ?? runtime.camera
      const plan = planLandscapeRender({
        ...snapshot,
        reason: "theme",
        progress: runtime.progress,
        camera: runtime.camera,
        reduceMotion: snapshot.reduceMotion,
      })
      const figure = createLandscapeFigure(
        snapshot.frameId,
        snapshot.stage,
        plan.progress,
        readLandscapeTheme(runtime.node),
        cloneLandscapeCamera(plan.camera),
      )
      await runtime.plotly.react(runtime.node, figure.data, figure.layout, plotConfig)
    })
    .catch(reportFailure)
}

function animateRoute(runtime: PlotRuntime, frameId: PromptFrameId, revision: number) {
  const startedAt = performance.now()
  let lastPaint = 0
  const duration = 4_200
  const draw = (now: number) => {
    if (runtime.disposed || revision !== runtime.contentRevision || !runtime.node || !runtime.plotly) return
    const elapsed = now - startedAt
    if (now - lastPaint >= 32 || elapsed >= duration) {
      const linearProgress = Math.min(elapsed / duration, 1)
      runtime.progress = 0.5 - Math.cos(Math.PI * linearProgress) / 2
      const update = routeTraceUpdate(frameId, runtime.progress)
      runtime.plotly.restyle(runtime.node, update.line, [landscapeTrace.outline, landscapeTrace.path])
      runtime.plotly.restyle(runtime.node, update.head, [landscapeTrace.head])
      lastPaint = now
    }
    if (elapsed < duration) runtime.animationFrame = requestAnimationFrame(draw)
  }
  runtime.animationFrame = requestAnimationFrame(draw)
}

function attachCameraListener(runtime: PlotRuntime) {
  if (!runtime.node || runtime.relayoutListener) return
  runtime.relayoutListener = () => {
    const camera = readLiveCamera(runtime)
    if (camera) runtime.camera = camera
  }
  runtime.node.on?.("plotly_relayout", runtime.relayoutListener)
}

function readLiveCamera(runtime: PlotRuntime) {
  const camera = runtime.node?._fullLayout?.scene?.camera
  return camera ? cloneLandscapeCamera(camera) : null
}

function fail(
  runtime: PlotRuntime,
  error: unknown,
  setFailed: (failed: boolean) => void,
  setInteractive: (interactive: boolean) => void,
  action = "render the latent landscape",
) {
  if (!runtime.disposed) {
    console.error(`Unable to ${action}`, error)
    setFailed(true)
    setInteractive(false)
  }
}
