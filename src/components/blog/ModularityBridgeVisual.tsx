"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"

type Lens = "structure" | "evidence" | "limits"

const lensChoices = [
  { id: "structure", label: "Structure" },
  { id: "evidence", label: "Evidence" },
  { id: "limits", label: "Limits" },
] as const

const comparisonRows: {
  label: string
  lens: Lens
  brain: string
  dense: string
  moe: string
}[] = [
  {
    label: "Unit of specialization",
    lens: "structure",
    brain: "Partly separable functional networks recruited by different cognitive demands.",
    dense: "Task-relevant MLP-unit populations inside one shared dense stack.",
    moe: "Parameter blocks called experts, selected by a learned router.",
  },
  {
    label: "How work is separated",
    lens: "structure",
    brain: "Activity is distributed, but some networks are recruited more reliably for particular functions.",
    dense: "No explicit router: specialization emerges as different tasks depend on overlapping unit populations.",
    moe: "The architecture explicitly routes each token through only part of the model capacity.",
  },
  {
    label: "Evidence in this comparison",
    lens: "evidence",
    brain: "Prior neuroscience literature motivates the four-domain comparison; it is not measured by the LLM experiment.",
    dense: "The paper measures attribution overlap and tests causal importance with targeted ablations.",
    moe: "Routing patterns can show expert use, but the paper's dense-model measurements do not establish MoE cognitive modules.",
  },
  {
    label: "Safe conclusion",
    lens: "limits",
    brain: "Functional specialization can coexist with substantial communication and shared processing.",
    dense: "Same-domain tasks share and depend on more of the same attributed units than cross-domain tasks.",
    moe: "Explicit routing creates capacity for specialization; an expert is not automatically a clean domain module.",
  },
  {
    label: "Not equivalent to",
    lens: "limits",
    brain: "A sealed box or a transformer component.",
    dense: "A single neuron, isolated circuit, or architecturally separate expert.",
    moe: "A brain region or a guaranteed language, physics, formal, or social module.",
  },
]

const lensCopy = {
  structure: "Keep the row labels fixed and compare what the specialized unit is and how work reaches it.",
  evidence: "Only the dense-model column contains measurements from the discussed paper. The other columns establish context and boundaries.",
  limits: "The shared idea is partial specialization under interference pressure—not anatomical or architectural equivalence.",
} as const

export default function ModularityBridgeVisual() {
  const [lens, setLens] = useState<Lens>("evidence")

  return (
    <ConceptLab
      title="Compare modularity without collapsing the analogy"
      description="The rows stay invariant across brains, dense LLMs, and mixture-of-experts models so similarities and non-equivalences remain visible together."
      methodology="paper evidence + analogy limits"
      headerActions={
        <SegmentedChoice
          label="Choose a comparison lens"
          choices={lensChoices}
          value={lens}
          onChange={setLens}
        />
      }
      insights={[
        { label: "Selected lens", body: lensCopy[lens], tone: "accent" },
        {
          label: "Reading rule",
          body: "Compare across one row at a time. Similar words in different columns do not imply the same mechanism or measurement.",
        },
      ]}
      footer={
        <Annotation label="Safe synthesis" tone="intervention">
          All three systems can separate work, but they do so with different units, routing mechanisms, and evidence standards.
        </Annotation>
      }
      caption="The dense-model values below come from the paper discussed in the article. Brain and MoE columns define the comparison boundary; they are not equivalent measurements."
    >
      <div className="space-y-8">
        <ComparisonTable lens={lens} />
        <DenseEvidence />
      </div>
    </ConceptLab>
  )
}

function ComparisonTable({ lens }: { lens: Lens }) {
  return (
    <div role="table" aria-label="Brain, dense LLM, and mixture-of-experts modularity comparison" className="border-t border-[rgb(var(--lab-rule))]">
      <div role="row" className="hidden grid-cols-[minmax(9rem,0.8fr)_repeat(3,minmax(0,1fr))] gap-5 border-b border-[rgb(var(--lab-rule))] py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-muted))] md:grid">
        <span role="columnheader">Question</span>
        <span role="columnheader">Brain</span>
        <span role="columnheader">Dense LLM</span>
        <span role="columnheader">MoE</span>
      </div>

      {comparisonRows.map((row) => {
        const active = row.lens === lens

        return (
          <div
            key={row.label}
            role="row"
            className="grid gap-4 border-b border-[rgb(var(--lab-rule))] py-5 md:grid-cols-[minmax(9rem,0.8fr)_repeat(3,minmax(0,1fr))] md:gap-5"
            style={active ? { backgroundColor: "rgb(var(--lab-accent) / 0.06)" } : undefined}
          >
            <strong role="rowheader" className="text-sm text-[rgb(var(--lab-ink))]">
              {row.label}
            </strong>
            <ComparisonCell label="Brain">{row.brain}</ComparisonCell>
            <ComparisonCell label="Dense LLM">{row.dense}</ComparisonCell>
            <ComparisonCell label="MoE">{row.moe}</ComparisonCell>
          </div>
        )
      })}
    </div>
  )
}

function ComparisonCell({ label, children }: { label: string; children: string }) {
  return (
    <span role="cell" className="text-sm leading-6 text-[rgb(var(--lab-muted))]">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-ink))] md:hidden">
        {label}
      </span>
      {children}
    </span>
  )
}

function DenseEvidence() {
  return (
    <section aria-labelledby="dense-evidence-heading" className="border-t border-[rgb(var(--lab-rule))] pt-6">
      <p className="lab-kicker">Measured in the dense-model study</p>
      <h3 id="dense-evidence-heading" className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
        Attribution overlap and causal ablation point in the same direction
      </h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--lab-muted))]">
        These values describe task-relevant unit populations in the dense models studied. They do not measure brain networks or MoE experts.
      </p>

      <dl className="mt-5 grid border-t border-[rgb(var(--lab-rule))] md:grid-cols-2">
        <div className="border-b border-[rgb(var(--lab-rule))] py-5 md:pr-6">
          <dt className="text-sm font-semibold text-[rgb(var(--lab-ink))]">Top-attributed unit overlap</dt>
          <dd className="mt-2 text-sm leading-6 text-[rgb(var(--lab-muted))]">
            Same-domain tasks shared <strong className="text-[rgb(var(--lab-ink))]">12.9%</strong>, compared with <strong className="text-[rgb(var(--lab-ink))]">3.0%</strong> across domains.
          </dd>
        </div>
        <div className="border-b border-[rgb(var(--lab-rule))] py-5 md:border-l md:pl-6">
          <dt className="text-sm font-semibold text-[rgb(var(--lab-ink))]">Performance loss after ablation</dt>
          <dd className="mt-2 text-sm leading-6 text-[rgb(var(--lab-muted))]">
            Within-domain ablation reduced performance by <strong className="text-[rgb(var(--lab-ink))]">25.9%</strong>, compared with <strong className="text-[rgb(var(--lab-ink))]">2.5%</strong> for cross-domain units.
          </dd>
        </div>
      </dl>
    </section>
  )
}
