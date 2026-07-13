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

type Margin = "clear" | "near"

const margins = [
  { id: "clear", label: "Clear favorite" },
  { id: "near", label: "Near tie" },
] as const

const cases = {
  clear: {
    candidates: [
      { label: "car", fit: "strong", note: "Comfortably ahead for this context." },
      { label: "vehicle", fit: "weak", note: "Compatible in meaning, but not close to the winner." },
    ],
    runs: ["car", "car", "car", "car", "car", "car"],
    result: "The same token survives each tiny implementation-level perturbation.",
    lineage: "The generated answers remain in one continuation family.",
  },
  near: {
    candidates: [
      { label: "car", fit: "plausible", note: "Slightly favored in one numerical execution." },
      { label: "vehicle", fit: "plausible", note: "Close enough for a tiny perturbation to reverse the order." },
    ],
    runs: ["car", "vehicle", "car", "car", "vehicle", "car"],
    result: "The perturbation is still tiny, but some executions now cross the choice boundary.",
    lineage: "Once a different token is appended, later predictions receive different context and can diverge further.",
  },
} as const

export default function NondeterminismBoundaryVisual() {
  const [margin, setMargin] = useState<Margin>("clear")
  const active = cases[margin]

  return (
    <ConceptLab
      title="A tiny perturbation needs a near tie to become visible"
      description="Keep implementation-level noise small and change only the separation between the top two token choices."
      methodology="Boundary test · illustrative runs"
      headerActions={
        <SegmentedChoice
          label="Top-choice margin"
          choices={margins}
          value={margin}
          onChange={setMargin}
        />
      }
      insights={[
        {
          label: "Held constant",
          body: "The prompt, model weights, requested temperature, and small numerical perturbation do not change.",
        },
        {
          label: "Manipulation",
          body: margin === "clear"
            ? "One candidate has a clear margin over the alternative."
            : "The two leading candidates are nearly tied.",
          tone: "intervention",
        },
      ]}
      caption="An illustrative boundary test, not serving telemetry. Numerical variation changes the visible answer only when it is large enough relative to the candidate margin."
    >
      <div className="space-y-7" aria-live="polite">
        <QualitativeRows label="Candidate order before selection" rows={active.candidates} />

        <TokenStrip
          label="Repeated executions"
          tokens={active.runs.map((token) => ({
            text: token,
            tone: token === "vehicle" ? "intervention" as const : "accent" as const,
          }))}
        />

        <Annotation label="Observed pattern" tone={margin === "near" ? "intervention" : "accent"}>
          {active.result}
        </Annotation>

        <ComparisonRows
          rows={[
            { label: "Candidate margin", baseline: "clear", changed: "near tie" },
            { label: "First token", baseline: "consistent", changed: "can split" },
            { label: "Later answer", baseline: "one family", changed: "can branch" },
          ]}
        />

        <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">{active.lineage}</p>
      </div>
    </ConceptLab>
  )
}
