"use client"

import { useState } from "react"
import {
  ConceptLab,
  type LabInsight,
} from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  SegmentedChoice,
} from "@/components/blog/visuals/VisualPrimitives"

type BatchRegime = "full" | "mini" | "tiny"

const REGIMES = [
  { id: "full", label: "full batch" },
  { id: "mini", label: "mini-batch" },
  { id: "tiny", label: "tiny batch" },
] as const

const TRACES: Record<
  BatchRegime,
  {
    title: string
    setup: string
    drift: string
    noise: string
    tradeoff: string
    updates: readonly [string, string, string, string][]
  }
> = {
  full: {
    title: "Full-batch reference",
    setup:
      "Every update sees the whole training set, so each direction reflects the same average signal.",
    drift: "The updates closely follow the average downhill direction.",
    noise:
      "There is almost no variation caused by which examples happened to be sampled.",
    tradeoff:
      "The trace is easy to read, but every step requires a pass over all examples.",
    updates: [
      ["01", "whole dataset", "follows the average", "loss falls steadily"],
      ["02", "whole dataset", "follows the average", "loss falls steadily"],
      [
        "03",
        "whole dataset",
        "follows the average",
        "progress slows near a flat region",
      ],
      [
        "04",
        "whole dataset",
        "small downhill move",
        "settles into the nearby basin",
      ],
    ],
  },
  mini: {
    title: "Mini-batch training",
    setup:
      "Each update sees a different useful sample of the data, so the local direction changes around the same broad descent.",
    drift: "Across several updates, the average motion is still downhill.",
    noise:
      "Individual steps lean to either side because each batch contains a different mix of examples.",
    tradeoff:
      "The wobble buys cheaper updates and can help the optimizer move through shallow regions.",
    updates: [
      ["01", "batch A", "leans left of average", "local loss falls"],
      [
        "02",
        "batch B",
        "leans right of average",
        "global loss briefly wobbles",
      ],
      ["03", "batch C", "points downhill again", "global loss resumes falling"],
      ["04", "batch D", "crosses a shallow flat spot", "training keeps moving"],
    ],
  },
  tiny: {
    title: "Very small batches",
    setup:
      "Each update contains little evidence, so one unusual example can pull the direction far from the average.",
    drift:
      "A downhill tendency appears only after looking across many updates.",
    noise:
      "The step-to-step variation is large and can overpower the useful signal.",
    tradeoff:
      "Exploration increases, but so does the risk of unstable or wasteful motion.",
    updates: [
      ["01", "tiny batch A", "sharp move left", "improves this batch"],
      ["02", "tiny batch B", "reverses direction", "gives back some progress"],
      ["03", "tiny batch C", "large downhill move", "global loss falls"],
      [
        "04",
        "tiny batch D",
        "overshoots the basin",
        "another correction is needed",
      ],
    ],
  },
}

export default function TrainingDynamicsVisual() {
  const [regime, setRegime] = useState<BatchRegime>("mini")
  const active = TRACES[regime]
  const insights: LabInsight[] = [
    { label: "Downhill drift", body: active.drift, tone: "accent" },
    { label: "Batch noise", body: active.noise, tone: "intervention" },
    { label: "Tradeoff", body: active.tradeoff },
  ]

  return (
    <ConceptLab
      title="Why does SGD wobble if it still learns?"
      description="Change only how much data each update sees. The training rule stays the same; the trace reveals the difference between average drift and batch noise."
      methodology="Illustrative optimizer trace"
      headerActions={
        <SegmentedChoice
          label="Choose how much data each update sees"
          choices={REGIMES}
          value={regime}
          onChange={setRegime}
        />
      }
      insights={insights}
      caption="A qualitative training trace, not a measured optimization run. Mini-batch noise belongs to training dynamics; physical constraints are introduced separately later in the article."
    >
      <section>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {active.title}. {active.drift} {active.noise}
        </p>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start">
          <div>
            <p className="lab-kicker">Selected regime</p>
            <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
              {active.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--lab-muted))]">
              {active.setup}
            </p>
          </div>
          <Annotation label="Held fixed">
            Same model, objective, learning rule, and starting point. Only the
            examples available to each update change.
          </Annotation>
        </div>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Four consecutive updates for the selected batch regime
            </caption>
            <thead className="border-y border-[rgb(var(--lab-rule))] text-xs uppercase tracking-[0.04em] text-[rgb(var(--lab-muted))]">
              <tr>
                <th className="px-2 py-3 font-semibold" scope="col">
                  Update
                </th>
                <th className="px-2 py-3 font-semibold" scope="col">
                  Evidence used
                </th>
                <th className="px-2 py-3 font-semibold" scope="col">
                  Observed direction
                </th>
                <th className="px-2 py-3 font-semibold" scope="col">
                  What follows
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--lab-rule))]">
              {active.updates.map(([step, evidence, direction, result]) => (
                <tr key={step}>
                  <th
                    className="px-2 py-3 font-mono text-xs font-semibold text-[rgb(var(--lab-accent))]"
                    scope="row"
                  >
                    {step}
                  </th>
                  <td className="px-2 py-3 font-medium text-[rgb(var(--lab-ink))]">
                    {evidence}
                  </td>
                  <td className="px-2 py-3 text-[rgb(var(--lab-muted))]">
                    {direction}
                  </td>
                  <td className="px-2 py-3 text-[rgb(var(--lab-muted))]">
                    {result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ConceptLab>
  )
}
