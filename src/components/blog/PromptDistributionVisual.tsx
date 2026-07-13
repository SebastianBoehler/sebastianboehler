"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  QualitativeRows,
  SegmentedChoice,
  TokenStrip,
} from "@/components/blog/visuals/VisualPrimitives"

type Wording = "drive" | "ride"
type Fit = "strong" | "plausible" | "weak"

interface PromptScenario {
  id: Wording
  label: string
  tokens: readonly string[]
  changedTokens: readonly string[]
  cues: readonly { label: string; fit: Fit; note: string }[]
  candidates: readonly { label: string; fit: Fit; note: string }[]
  selected: string
  branch: readonly string[]
  lineage: string
}

const steps = [
  { label: "Prompt", shortLabel: "Prompt" },
  { label: "Context cues", shortLabel: "Cues" },
  { label: "Candidate fit", shortLabel: "Fit" },
  { label: "First token", shortLabel: "Token" },
  { label: "Branch", shortLabel: "Branch" },
] as const

const scenarios: readonly PromptScenario[] = [
  {
    id: "drive",
    label: "drove … in",
    tokens: ["I", "drove", "to", "work", "in", "my"],
    changedTokens: ["drove", "in"],
    cues: [
      { label: "drove", fit: "strong", note: "Activates a motor-vehicle reading." },
      { label: "in my", fit: "strong", note: "Favors something a person sits inside." },
      { label: "to work", fit: "plausible", note: "Supports an ordinary commute." },
    ],
    candidates: [
      { label: "car", fit: "strong", note: "Fits meaning, syntax, and the preposition." },
      { label: "vehicle", fit: "plausible", note: "Semantically compatible, but less idiomatic here." },
      { label: "bicycle", fit: "weak", note: "Related to commuting, but conflicts with “in my.”" },
    ],
    selected: "car",
    branch: ["I", "drove", "to", "work", "in", "my", "car"],
    lineage: "The next state now includes “car,” making vehicle-specific details easier to continue.",
  },
  {
    id: "ride",
    label: "rode … on",
    tokens: ["I", "rode", "to", "work", "on", "my"],
    changedTokens: ["rode", "on"],
    cues: [
      { label: "rode", fit: "strong", note: "Activates a rideable-transport reading." },
      { label: "on my", fit: "strong", note: "Favors something a person sits on." },
      { label: "to work", fit: "plausible", note: "Keeps the commute setting constant." },
    ],
    candidates: [
      { label: "bicycle", fit: "strong", note: "Fits meaning, syntax, and the preposition." },
      { label: "motorbike", fit: "plausible", note: "Another compatible rideable vehicle." },
      { label: "car", fit: "weak", note: "Semantically nearby, but conflicts with “on my.”" },
    ],
    selected: "bicycle",
    branch: ["I", "rode", "to", "work", "on", "my", "bicycle"],
    lineage: "The next state now includes “bicycle,” making cycling-specific details easier to continue.",
  },
]

const stepNotes = [
  "Start with the exact sequence the model receives.",
  "Attention and learned transformations make some words more useful for this prediction than others.",
  "The contextual state scores every possible next token; semantic proximity alone does not decide the winner.",
  "One compatible token is selected in this teaching trace and appended to the context.",
  "That first difference becomes input to the next prediction, so later text can diverge further.",
] as const

export default function PromptDistributionVisual() {
  const [step, setStep] = useState(0)
  const [wording, setWording] = useState<Wording>("drive")
  const scenario = scenarios.find((item) => item.id === wording) ?? scenarios[0]

  return (
    <ConceptLab
      title="From prompt to branch"
      description="Change only the verb and preposition, then scrub through the causal chain from text to a different continuation."
      methodology="Five-step causal trace · qualitative"
      steps={steps}
      activeStep={step}
      onStepChange={setStep}
      headerActions={
        <SegmentedChoice
          label="Prompt wording"
          choices={scenarios}
          value={wording}
          onChange={setWording}
        />
      }
      insights={[
        {
          label: "Causal variable",
          body: <>Swap “drove … in” for “rode … on.” The commute and sentence structure stay fixed.</>,
          tone: "intervention",
        },
        { label: "At this step", body: stepNotes[step], tone: "accent" },
      ]}
      caption="A qualitative next-token trace, not output captured from a specific model. It separates semantic neighborhood, contextual fit, token selection, and autoregressive branching."
    >
      <div aria-live="polite">
        <Stage step={step} scenario={scenario} />
      </div>
    </ConceptLab>
  )
}

function Stage({ step, scenario }: { step: number; scenario: PromptScenario }) {
  const promptTokens = scenario.tokens.map((text) => ({
    text,
    tone: scenario.changedTokens.includes(text) ? "intervention" as const : "default" as const,
  }))

  if (step === 0) {
    return <TokenStrip label="Exact prompt prefix" tokens={promptTokens} />
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <TokenStrip label="Exact prompt prefix" tokens={promptTokens} />
        <QualitativeRows label="Context cues for the blank" rows={scenario.cues} />
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <TokenStrip label="Prompt context held constant" tokens={promptTokens} />
        <QualitativeRows label="Candidate next-token compatibility" rows={scenario.candidates} />
        <Annotation label="What changed" tone="intervention">
          The highlighted wording changes which candidate best satisfies the sentence, even though the commute setting stays the same.
        </Annotation>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        <TokenStrip label="Prompt context held constant" tokens={promptTokens} />
        <QualitativeRows
          label="Candidate next-token compatibility"
          rows={scenario.candidates.map((candidate) => ({
            ...candidate,
            selected: candidate.label === scenario.selected,
          }))}
        />
        <Annotation label="Selected in this teaching trace" tone="accent">
          <strong className="text-stone-950 dark:text-white">{scenario.selected}</strong> is appended to the prompt. Selection happens from contextual scores, not by choosing the nearest word on a map.
        </Annotation>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TokenStrip
        label="Context for the next prediction"
        tokens={scenario.branch.map((text, index) => ({
          text,
          tone: index === scenario.branch.length - 1 ? "accent" as const : "default" as const,
        }))}
      />
      <Annotation label="Autoregressive consequence" tone="accent">
        {scenario.lineage}
      </Annotation>
      <ComparisonRows
        rows={[
          { label: "Wording", baseline: "drove … in", changed: "rode … on" },
          { label: "First token", baseline: "car", changed: "bicycle" },
          { label: "Next lineage", baseline: "vehicle details", changed: "cycling details" },
        ]}
      />
    </div>
  )
}
