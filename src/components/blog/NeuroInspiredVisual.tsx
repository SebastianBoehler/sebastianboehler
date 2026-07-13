"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  SegmentedChoice,
  TokenStrip,
} from "@/components/blog/visuals/VisualPrimitives"

type Mechanism = "synapse" | "myelin" | "credit"
type Intervention = "reduced" | "baseline" | "enhanced"

const mechanismChoices = [
  { id: "synapse", label: "Synapse" },
  { id: "myelin", label: "Myelin" },
  { id: "credit", label: "Credit signal" },
] as const

const mechanismCopy = {
  synapse: {
    title: "Connection influence",
    description: "Synaptic plasticity changes how strongly one neuron influences another. This is the narrowest useful bridge to an ML weight.",
    boundary: "A biological synapse is a living, timed, chemical structure—not a scalar stored in model memory.",
    interventions: [
      { id: "reduced", label: "Weakened" },
      { id: "baseline", label: "Baseline" },
      { id: "enhanced", label: "Strengthened" },
    ],
  },
  myelin: {
    title: "Conduction timing",
    description: "Myelin changes the speed, reliability, and synchronization of signals traveling along an axon.",
    boundary: "Myelin improves the communication channel; it does not decide which answer is correct or directly set synaptic influence.",
    interventions: [
      { id: "reduced", label: "Less insulation" },
      { id: "baseline", label: "Baseline" },
      { id: "enhanced", label: "More insulation" },
    ],
  },
  credit: {
    title: "Update eligibility",
    description: "Credit assignment links a later error, reward, or attention signal to the recent activity that should change.",
    boundary: "A global reward signal can gate learning, but it does not contain a full backpropagated gradient for every connection.",
    interventions: [
      { id: "reduced", label: "Diffuse feedback" },
      { id: "baseline", label: "Baseline" },
      { id: "enhanced", label: "Timely feedback" },
    ],
  },
} as const

export default function NeuroInspiredVisual() {
  const [mechanism, setMechanism] = useState<Mechanism>("synapse")
  const [intervention, setIntervention] = useState<Intervention>("enhanced")
  const active = mechanismCopy[mechanism]
  const rows = comparisonFor(mechanism, intervention)

  return (
    <ConceptLab
      title="Change one learning mechanism at a time"
      description="Hold the pathway fixed, intervene on one mechanism, and inspect which property changes—and which properties do not."
      methodology="mechanism comparison"
      headerActions={
        <SegmentedChoice
          label="Choose a biological mechanism"
          choices={mechanismChoices}
          value={mechanism}
          onChange={setMechanism}
        />
      }
      insights={[
        { label: active.title, body: active.description, tone: "accent" },
        { label: "Analogy boundary", body: active.boundary },
      ]}
      footer={
        <Annotation label="What the intervention isolates" tone="intervention">
          {interventionSummary(mechanism, intervention)}
        </Annotation>
      }
      caption="A qualitative mechanism comparison, not a biological simulation. Synaptic influence, conduction timing, and credit assignment solve different parts of learning."
    >
      <div className="space-y-8">
        <TokenStrip
          label="Path under inspection"
          tokens={pathTokens(mechanism)}
        />

        <section aria-labelledby="neuro-intervention" className="border-y border-[rgb(var(--lab-rule))] py-6">
          <p className="lab-kicker">Intervention</p>
          <h3 id="neuro-intervention" className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
            Change {active.title.toLowerCase()}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--lab-muted))]">
            The other two mechanisms remain at baseline so the causal distinction stays visible.
          </p>
          <div className="mt-5">
            <SegmentedChoice
              label={`Change ${active.title.toLowerCase()}`}
              choices={active.interventions}
              value={intervention}
              onChange={setIntervention}
            />
          </div>
        </section>

        <ComparisonRows rows={rows} />
      </div>
    </ConceptLab>
  )
}

function comparisonFor(mechanism: Mechanism, intervention: Intervention) {
  const changed = effectFor(mechanism, intervention)

  return [
    {
      label: "Connection influence",
      baseline: "Existing postsynaptic effect",
      changed: changed.influence,
    },
    {
      label: "Arrival timing",
      baseline: "Existing conduction speed and synchrony",
      changed: changed.timing,
    },
    {
      label: "Which activity updates",
      baseline: "Depends on recent local activity and feedback",
      changed: changed.eligibility,
    },
    {
      label: "Closest ML bridge",
      baseline: "One abstract learning pathway",
      changed: changed.bridge,
    },
  ]
}

function effectFor(mechanism: Mechanism, intervention: Intervention) {
  const noChange = "No direct change in this intervention"

  if (intervention === "baseline") {
    return {
      influence: "Held at baseline",
      timing: "Held at baseline",
      eligibility: "Held at baseline",
      bridge: "No mechanism has been perturbed",
    }
  }

  if (mechanism === "synapse") {
    return {
      influence: intervention === "enhanced" ? "Stronger postsynaptic effect" : "Weaker postsynaptic effect",
      timing: noChange,
      eligibility: "Not determined by connection strength alone",
      bridge: "Adjusting a connection weight, with important biological caveats",
    }
  }

  if (mechanism === "myelin") {
    return {
      influence: "Synaptic strength remains unchanged",
      timing: intervention === "enhanced" ? "Faster, more reliable, better synchronized arrival" : "Slower, less reliable, less synchronized arrival",
      eligibility: noChange,
      bridge: "Changing channel latency and reliability, not a model weight",
    }
  }

  return {
    influence: noChange,
    timing: "Axon conduction speed remains unchanged",
    eligibility: intervention === "enhanced" ? "Timely feedback better identifies recent eligible activity" : "Diffuse feedback leaves credit more ambiguous",
    bridge: "A reward or error signal gating which recent activity should update",
  }
}

function pathTokens(mechanism: Mechanism) {
  const tokens = {
    synapse: [
      { text: "cue" },
      { text: "synaptic influence", tone: "intervention" as const },
      { text: "downstream response", tone: "accent" as const },
    ],
    myelin: [
      { text: "cue" },
      { text: "axon conduction", tone: "intervention" as const },
      { text: "arrival timing", tone: "accent" as const },
    ],
    credit: [
      { text: "action" },
      { text: "reward / error", tone: "intervention" as const },
      { text: "eligible activity", tone: "accent" as const },
    ],
  }

  return tokens[mechanism]
}

function interventionSummary(mechanism: Mechanism, intervention: Intervention) {
  if (intervention === "baseline") return "Nothing changes yet. Choose either intervention to create a controlled comparison."
  if (mechanism === "synapse") return "Only the strength of influence changes; signal timing and credit assignment do not automatically improve with it."
  if (mechanism === "myelin") return "Only transmission quality changes; the connection does not become more correct or more deserving of an update."
  return "Only update eligibility changes; the pathway does not instantly become stronger or faster."
}
