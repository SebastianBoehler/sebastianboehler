"use client"

import { useId, type ReactNode } from "react"
import { Focus, RefreshCcw, RotateCcw, RotateCw } from "lucide-react"
import styles from "@/components/blog/LatentLandscapePlot.module.css"
import { canReplayLandscape } from "@/components/blog/latentLandscapeInteraction"
import type { LandscapeStage } from "@/components/blog/latentLandscapeModel"
import type { PromptFrameId } from "@/components/blog/latentSpaceData"
import { useLatentLandscapePlot } from "@/components/blog/useLatentLandscapePlot"

interface LatentLandscapePlotProps {
  frameId: PromptFrameId
  stage: LandscapeStage
}

export default function LatentLandscapePlot({ frameId, stage }: LatentLandscapePlotProps) {
  const instructionsId = useId()
  const landscape = useLatentLandscapePlot(frameId, stage)
  const replayVisible = landscape.reduceMotion !== null
    && canReplayLandscape(stage, landscape.reduceMotion)

  return (
    <div
      role="group"
      aria-label="Interactive representation landscape"
      aria-describedby={instructionsId}
      className={styles.root}
    >
      <div
        ref={landscape.plotRef}
        role="img"
        aria-label="3D representation landscape with a contextual-state trajectory"
        aria-describedby={instructionsId}
        aria-hidden={landscape.failed || undefined}
        className={styles.plot}
      />
      <p id={instructionsId} className="sr-only">
        Use the view controls or drag the landscape to rotate it.
      </p>
      {landscape.failed ? (
        <div role="alert" className={styles.failure}>3D landscape failed to load.</div>
      ) : (
        <>
          <div className={styles.badge}>Fixed representation map</div>
          <div role="group" aria-label="Landscape view controls" className={styles.cameraControls}>
            <CameraButton
              label="Rotate landscape left"
              disabled={!landscape.interactive}
              onClick={landscape.rotateLeft}
            ><RotateCcw aria-hidden="true" /></CameraButton>
            <CameraButton
              label="Rotate landscape right"
              disabled={!landscape.interactive}
              onClick={landscape.rotateRight}
            ><RotateCw aria-hidden="true" /></CameraButton>
            <CameraButton
              label="Reset landscape view"
              disabled={!landscape.interactive}
              onClick={landscape.resetView}
            ><Focus aria-hidden="true" /></CameraButton>
          </div>
          {replayVisible && (
            <button
              type="button"
              onClick={landscape.replay}
              aria-label="Replay contextual-state path animation"
              className={styles.replay}
            >
              <RefreshCcw aria-hidden="true" />
              Replay path
            </button>
          )}
          <span aria-hidden="true" className={styles.hint}>Drag or use view controls</span>
        </>
      )}
    </div>
  )
}

function CameraButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode
  disabled: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={styles.cameraButton}
    >
      {children}
    </button>
  )
}
