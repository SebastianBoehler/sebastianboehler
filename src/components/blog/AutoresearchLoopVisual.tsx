"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"

type CandidateId = "metric-only" | "reproducible"
type StageState = "waiting" | "active" | "pass" | "fail" | "available"

const STEPS = [
  { label: "Hypothesis", shortLabel: "Idea" },
  { label: "Benchmark", shortLabel: "Run" },
  { label: "Reproduce", shortLabel: "Replay" },
  { label: "Review gate", shortLabel: "Gate" },
  { label: "Public reuse", shortLabel: "Reuse" },
] as const

const CANDIDATES = {
  "metric-only": {
    label: "Metric only",
    hypothesis: "Change the optimizer schedule to reach a better benchmark result.",
    evidence: "The first run improves, but its exact conditions and artifact trace are incomplete.",
    outcome: "The replay diverges, so review rejects the public claim.",
    takeaway: "A better first score is private evidence until another run can reproduce it.",
    accepted: false,
  },
  reproducible: {
    label: "Reproducible diff",
    hypothesis: "Change the optimizer schedule and preserve the full run contract.",
    evidence: "The benchmark improves and a clean replay follows the same trajectory.",
    outcome: "Review can inspect the diff, trace the lineage, and accept the result.",
    takeaway: "A reproducible diff becomes a public building block that later search can reuse.",
    accepted: true,
  },
} as const

const candidateChoices = (Object.entries(CANDIDATES) as [CandidateId, (typeof CANDIDATES)[CandidateId]][]).map(
  ([id, candidate]) => ({ id, label: candidate.label }),
)

export default function AutoresearchLoopVisual() {
  const [candidateId, setCandidateId] = useState<CandidateId>("reproducible")
  const [step, setStep] = useState(2)
  const candidate = CANDIDATES[candidateId]

  return (
    <ConceptLab
      title="Follow one experiment through the gate"
      description="Advance the evidence trail. A benchmark result becomes infrastructure only when the claim survives reproduction and review."
      methodology="publication-gate model"
      steps={STEPS}
      activeStep={step}
      onStepChange={setStep}
      headerActions={
        <SegmentedChoice
          label="Choose an evidence package"
          choices={candidateChoices}
          value={candidateId}
          onChange={(value) => {
            setCandidateId(value)
            setStep(0)
          }}
        />
      }
      insights={[
        {
          label: "What changed",
          tone: "intervention",
          body: candidate.accepted ? "The candidate includes a replayable run contract and lineage." : "The candidate carries a result without enough replay evidence.",
        },
        {
          label: "What stayed fixed",
          body: "The benchmark, review criteria, and publication gate are identical for both candidates.",
        },
        {
          label: "Takeaway",
          tone: "accent",
          body: candidate.takeaway,
        },
      ]}
      caption="Figure 1. The useful unit is not the score alone. It is the hypothesis, diff, benchmark, replay, review decision, and preserved provenance."
    >
      <div className="space-y-7">
        <Annotation label="Candidate hypothesis" tone="intervention">
          <p className="font-medium text-[rgb(var(--lab-ink))]">{candidate.hypothesis}</p>
        </Annotation>

        <ol className="border-t border-[rgb(var(--lab-rule))]" aria-label="Experiment evidence trail">
          {STEPS.map((stage, index) => {
            const state = stateFor(index, step, candidate.accepted)
            return (
              <li
                key={stage.label}
                className="grid min-h-16 grid-cols-[2rem_minmax(7rem,0.7fr)_minmax(0,1.4fr)_5.5rem] items-center gap-3 border-b border-[rgb(var(--lab-rule))] py-3 text-sm max-sm:grid-cols-[2rem_minmax(0,1fr)_5.5rem]"
              >
                <span className="font-mono text-xs text-[rgb(var(--lab-muted))]">0{index + 1}</span>
                <strong>{stage.label}</strong>
                <span className="text-[rgb(var(--lab-muted))] max-sm:col-span-3 max-sm:col-start-2">
                  {stageCopy(index, candidate.accepted, candidate.evidence, candidate.outcome)}
                </span>
                <span className={stateTone(state)} aria-current={index === step ? "step" : undefined}>
                  {state}
                </span>
              </li>
            )
          })}
        </ol>

        <div className="grid gap-4 border-l-2 border-[rgb(var(--lab-accent))] pl-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="lab-kicker">Public research graph</p>
            <p className="mt-2 text-sm leading-6 text-[rgb(var(--lab-muted))]" aria-live="polite">
              {step < 3
                ? "The candidate is still private while its evidence is tested."
                : candidate.accepted
                  ? "The accepted diff now has provenance and can be inspected, copied, or corrected."
                  : "The rejected claim stays out of the public frontier; its private trace can still guide the next hypothesis."}
            </p>
          </div>
          <span className="text-sm font-semibold text-[rgb(var(--lab-accent))]">
            {step >= 3 && candidate.accepted ? "Reusable evidence" : "No public node yet"}
          </span>
        </div>
      </div>
    </ConceptLab>
  )
}

function stateFor(index: number, step: number, accepted: boolean): StageState {
  if (index > step) return "waiting"
  if (!accepted && index >= 2) return "fail"
  if (index === 4) return "available"
  if (index === step) return "active"
  return "pass"
}

function stageCopy(index: number, accepted: boolean, evidence: string, outcome: string) {
  if (index === 0) return "Name one bounded change and preserve its parent run."
  if (index === 1) return evidence
  if (index === 2) return accepted ? "A clean replay follows the same result and behavior." : "A clean replay does not recover the claimed result."
  if (index === 3) return outcome
  return accepted ? "The accepted diff enters the graph with attribution." : "Nothing is published from this candidate."
}

function stateTone(state: StageState) {
  const base = "text-right text-xs font-semibold uppercase tracking-[0.04em]"
  if (state === "active") return `${base} text-[rgb(var(--lab-accent))]`
  if (state === "fail") return `${base} text-[rgb(var(--lab-intervention))]`
  if (state === "pass" || state === "available") return `${base} text-[rgb(var(--lab-ink))]`
  return `${base} text-[rgb(var(--lab-muted))]`
}
