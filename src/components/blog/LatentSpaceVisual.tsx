"use client"

import { useState } from "react"
import LatentLandscapePlot from "@/components/blog/LatentLandscapePlot"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  QualitativeRows,
  SegmentedChoice,
  TokenStrip,
} from "@/components/blog/visuals/VisualPrimitives"
import {
  latentSteps,
  promptFrames,
  type PromptFrame,
  type PromptFrameId,
} from "@/components/blog/latentSpaceData"

const stepNotes = [
  "Training organizes related language into reusable neighborhoods. A new prompt uses that map; it does not redraw it.",
  "The added framing changes the contextual endpoint produced from the same topic.",
  "That endpoint makes some continuation families fit better than others.",
  "Repeated answers can differ locally while remaining inside the same conditioned family.",
] as const

export default function LatentSpaceVisual() {
  const [step, setStep] = useState(0)
  const [frameId, setFrameId] = useState<PromptFrameId>("beginner")
  const frame = promptFrames.find((item) => item.id === frameId) ?? promptFrames[0]

  return (
    <ConceptLab
      title="The map stays fixed; the working state moves"
      description="Hold the topic constant and change only its framing. Follow what remains fixed, what moves, and where variation enters."
      methodology="Conceptual model · not measured embeddings"
      steps={latentSteps}
      activeStep={step}
      onStepChange={setStep}
      headerActions={
        <SegmentedChoice
          label="Prompt framing"
          choices={promptFrames}
          value={frameId}
          onChange={setFrameId}
        />
      }
      insights={[
        {
          label: "Manipulation",
          body: <>Only the phrase “{frame.modifier}” changes.</>,
          tone: "intervention",
        },
        {
          label: "Read this step",
          body: stepNotes[step],
          tone: "accent",
        },
      ]}
      caption="A teaching model of representation space. The labels describe qualitative compatibility, not coordinates or telemetry from a particular LLM."
    >
      <div className="space-y-6" aria-live="polite">
        <LatentLandscapePlot frameId={frameId} stage={step as 0 | 1 | 2 | 3} />
        <TokenStrip
          label="Prompt under inspection"
          tokens={frame.tokens.map((text) => ({
            text,
            tone: frame.modifier.includes(text) ? "intervention" : "default",
          }))}
        />
        <Stage step={step} frame={frame} />
      </div>
    </ConceptLab>
  )
}

function Stage({ step, frame }: { step: number; frame: PromptFrame }) {
  if (step === 0) {
    return (
      <ComparisonRows
        rows={[
          { label: "Model weights", baseline: "trained", changed: "unchanged" },
          { label: "Learned neighborhoods", baseline: "already organized", changed: "unchanged" },
          { label: "Prompt framing", baseline: "topic only", changed: frame.modifier },
        ]}
      />
    )
  }

  if (step === 1) {
    return (
      <>
        <QualitativeRows label="Where the contextual state now points" rows={frame.regions} />
        <div className="mt-6">
          <Annotation label="Endpoint" tone="intervention">
            The processed prompt now favors a {frame.endpoint}. This is a contextual state, not a new location learned by retraining.
          </Annotation>
        </div>
      </>
    )
  }

  if (step === 2) {
    return <QualitativeRows label="Compatible opening families" rows={frame.continuations} />
  }

  return (
    <>
      <TokenStrip
        label="Three plausible runs"
        tokens={frame.runFamily.map((text) => ({ text, tone: "accent" as const }))}
      />
      <div className="mt-6">
        <Annotation label="What the cloud means" tone="accent">
          These runs can choose different examples or wording without leaving the answer family established by the prompt.
        </Annotation>
      </div>
    </>
  )
}
