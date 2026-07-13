"use client"

import { useState } from "react"
import {
  ConceptLab,
  type LabInsight,
} from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  SegmentedChoice,
} from "@/components/blog/visuals/VisualPrimitives"

type Inspection = "fit" | "law" | "rollout"

const INSPECTIONS = [
  { id: "fit", label: "observed fit" },
  { id: "law", label: "law residual" },
  { id: "rollout", label: "rollout" },
] as const

const COMPARISONS: Record<
  Inspection,
  {
    question: string
    note: string
    rows: readonly { label: string; baseline: string; changed: string }[]
  }
> = {
  fit: {
    question:
      "Does adding the law still let the model explain the observations?",
    note: "Both models see the same sparse, noisy readings. The guided model accepts a little less local flexibility in exchange for a more plausible shape between them.",
    rows: [
      {
        label: "At measured points",
        baseline: "Tracks the readings closely, including local noise.",
        changed: "Tracks the broad pattern without chasing every fluctuation.",
      },
      {
        label: "Between measurements",
        baseline: "The curve is chosen only by what reduces data error.",
        changed:
          "The curve must also remain compatible with the known dynamics.",
      },
      {
        label: "Fit error",
        baseline: "Small on the observed sample; uncertain away from it.",
        changed: "Still plausible on the sample, with less freedom to overfit.",
      },
    ],
  },
  law: {
    question:
      "What changes when violations of the known equation become costly?",
    note: "The intervention is one extra term in the training objective. It does not replace the data or guarantee a correct solution.",
    rows: [
      {
        label: "Law residual",
        baseline:
          "Not optimized; violations can remain hidden by a good local fit.",
        changed: "Explicitly penalized, so compatible solutions are preferred.",
      },
      {
        label: "Conservation behavior",
        baseline: "May create or destroy a quantity the real system preserves.",
        changed: "Is pushed toward trajectories that respect the encoded rule.",
      },
      {
        label: "Available solutions",
        baseline: "Any curve that fits the sample can compete.",
        changed: "Curves that violate the law become expensive.",
      },
    ],
  },
  rollout: {
    question:
      "Which fit remains plausible after the model predicts beyond the sample?",
    note: "A one-step fit can look convincing while repeated predictions accumulate structural error. The law is most useful when that structure is approximately correct.",
    rows: [
      {
        label: "First prediction",
        baseline: "Can look convincing near the training data.",
        changed: "Can look similarly convincing near the training data.",
      },
      {
        label: "Longer rollout",
        baseline:
          "Small unconstrained errors can compound into implausible motion.",
        changed: "The encoded structure resists some forms of drift.",
      },
      {
        label: "Failure mode",
        baseline: "Overfits noise or invents impossible states.",
        changed: "Can be confidently wrong when the supplied law is wrong.",
      },
    ],
  },
}

export default function PhysicsInformedVisual() {
  const [inspection, setInspection] = useState<Inspection>("fit")
  const active = COMPARISONS[inspection]
  const insights: LabInsight[] = [
    {
      label: "Held fixed",
      body: "Architecture, observations, optimizer, and evaluation window are identical for both models.",
    },
    {
      label: "Intervention",
      body: "The physics-guided model receives one additional penalty for violating a known equation or conservation rule.",
      tone: "intervention",
    },
    {
      label: "What this can prove",
      body: "Only a controlled evaluation can show whether the added rule improves generalization. The sketch explains the mechanism, not a benchmark result.",
      tone: "accent",
    },
  ]

  return (
    <ConceptLab
      title="What does a physics constraint actually change?"
      description="Compare two otherwise identical models. One minimizes data error alone; the other must also account for a known physical rule."
      methodology="Controlled counterfactual"
      headerActions={
        <SegmentedChoice
          label="Choose which part of the comparison to inspect"
          choices={INSPECTIONS}
          value={inspection}
          onChange={setInspection}
        />
      }
      insights={insights}
      caption="A qualitative counterfactual. The observations and model are held fixed; only the physics penalty changes. A misspecified law can make the guided model worse, not better."
      footer={
        <p className="text-sm leading-6 text-[rgb(var(--lab-muted))]">
          Read the columns as hypotheses to test: a physics term is valuable
          only when it reduces meaningful violations without destroying the fit
          that the data supports.
        </p>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Annotation label="Baseline · data only">
          Minimize mismatch with the observed readings. No penalty asks whether
          the learned shape obeys the system&apos;s law.
        </Annotation>
        <Annotation label="Changed · data plus law" tone="intervention">
          Minimize the same data mismatch, then add a penalty when the predicted
          state violates the encoded rule.
        </Annotation>
      </div>

      <section className="mt-7">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {active.question} {active.note}
        </p>
        <p className="lab-kicker">Inspection question</p>
        <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
          {active.question}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--lab-muted))]">
          {active.note}
        </p>
        <div className="mt-5">
          <ComparisonRows rows={active.rows} />
        </div>
      </section>
    </ConceptLab>
  )
}
