"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import {
  createLandscapeFigure,
  landscapeTrace,
  routeTraceUpdate,
  type LandscapeStage,
} from "@/components/blog/latentLandscapeModel"
import type { PromptFrameId } from "@/components/blog/latentSpaceData"

interface LatentLandscapePlotProps {
  frameId: PromptFrameId
  stage: LandscapeStage
}

export default function LatentLandscapePlot({ frameId, stage }: LatentLandscapePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    let disposed = false
    let animationFrame = 0
    let resizeObserver: ResizeObserver | undefined
    let plotly: typeof import("plotly.js-dist-min").default | undefined
    const plotNode = plotRef.current

    async function render() {
      try {
        const Plotly = (await import("plotly.js-dist-min")).default
        plotly = Plotly
        if (disposed || !plotNode) {
          return
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const animate = stage > 0 && !reduceMotion
        const initialProgress = stage === 0 || animate ? 0 : 1
        const figure = createLandscapeFigure(frameId, stage, initialProgress)
        Plotly.purge(plotNode)
        await Plotly.newPlot(plotNode, figure.data, figure.layout, {
          displayModeBar: false,
          responsive: true,
          scrollZoom: false,
        })

        resizeObserver = new ResizeObserver(() => {
          if (plotNode) {
            Plotly.Plots.resize(plotNode)
          }
        })
        resizeObserver.observe(plotNode)

        if (animate) {
          const startedAt = performance.now()
          let lastPaint = 0
          const duration = 4_200

          const draw = (now: number) => {
            if (disposed) {
              return
            }
            const elapsed = now - startedAt
            if (now - lastPaint >= 32 || elapsed >= duration) {
              const progress = Math.min(elapsed / duration, 1)
              const eased = 0.5 - Math.cos(Math.PI * progress) / 2
              const update = routeTraceUpdate(frameId, eased)
              Plotly.restyle(plotNode, update.line, [landscapeTrace.outline, landscapeTrace.path])
              Plotly.restyle(plotNode, update.head, [landscapeTrace.head])
              lastPaint = now
            }
            if (elapsed < duration) {
              animationFrame = requestAnimationFrame(draw)
            }
          }

          animationFrame = requestAnimationFrame(draw)
        }
      } catch {
        if (!disposed) {
          setFailed(true)
        }
      }
    }

    render()

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      if (plotNode && plotly) {
        plotly.purge(plotNode)
      }
    }
  }, [frameId, replayKey, stage])

  if (failed) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        3D landscape failed to load.
      </div>
    )
  }

  return (
    <div className="relative h-[390px] overflow-hidden rounded-[0.2rem] border border-[rgb(var(--lab-rule))] bg-[#f6f4ee] sm:h-[500px] lg:h-[570px]">
      <div
        ref={plotRef}
        aria-label="Interactive 3D representation landscape with an animated contextual-state trajectory"
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute left-4 top-4 rounded-sm bg-[#f6f4ee]/90 px-2.5 py-1.5 text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-slate-700 shadow-sm backdrop-blur-sm">
        Fixed representation map
      </div>
      <button
        type="button"
        onClick={() => setReplayKey((value) => value + 1)}
        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-sm border border-slate-300 bg-[#f6f4ee]/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
      >
        <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
        Replay path
      </button>
      <span className="pointer-events-none absolute bottom-5 left-4 text-[0.7rem] font-medium text-slate-600">
        Drag to rotate
      </span>
    </div>
  )
}
