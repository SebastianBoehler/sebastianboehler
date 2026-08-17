"use client"

import { useEffect, useRef, useState } from "react"
import { RotateCcw } from "lucide-react"
import styles from "@/components/blog/LatentLandscapePlot.module.css"
import {
  createLandscapeFigure,
  landscapeTrace,
  routeTraceUpdate,
  type LandscapeStage,
} from "@/components/blog/latentLandscapeModel"
import { readLandscapeTheme } from "@/components/blog/latentLandscapeTheme"
import type { PromptFrameId } from "@/components/blog/latentSpaceData"

interface LatentLandscapePlotProps {
  frameId: PromptFrameId
  stage: LandscapeStage
}

export default function LatentLandscapePlot({ frameId, stage }: LatentLandscapePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [themeRevision, setThemeRevision] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeRevision((value) => value + 1))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

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
        const theme = readLandscapeTheme(plotNode)
        const figure = createLandscapeFigure(frameId, stage, initialProgress, theme)
        Plotly.purge(plotNode)
        await Plotly.newPlot(plotNode, figure.data, figure.layout, {
          displayModeBar: false,
          responsive: true,
          scrollZoom: false,
        })
        if (disposed) {
          Plotly.purge(plotNode)
          return
        }
        setFailed(false)

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
      } catch (error) {
        if (!disposed) {
          console.error("Unable to render the latent landscape", error)
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
  }, [frameId, replayKey, stage, themeRevision])

  return (
    <div className={styles.root}>
      <div
        ref={plotRef}
        role="img"
        aria-label="Interactive 3D representation landscape with an animated contextual-state trajectory"
        aria-hidden={failed || undefined}
        className={styles.plot}
      />
      {failed ? (
        <div role="alert" className={styles.failure}>3D landscape failed to load.</div>
      ) : (
        <>
          <div className={styles.badge}>Fixed representation map</div>
          <button
            type="button"
            onClick={() => setReplayKey((value) => value + 1)}
            aria-label="Replay contextual-state path animation"
            className={styles.replay}
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Replay path
          </button>
          <span aria-hidden="true" className={styles.hint}>Drag to rotate</span>
        </>
      )}
    </div>
  )
}
