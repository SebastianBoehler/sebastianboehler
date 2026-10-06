"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { BarRows } from "@/components/blog/visuals/chart/BarRows"
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
    <div role="table" aria-label="Brain, dense LLM, and mixture-of-experts modularity comparison" className="border-t border-[var(--lab-rule)]">
      <div role="row" className="hidden grid-cols-[minmax(9rem,0.8fr)_repeat(3,minmax(0,1fr))] gap-5 border-b border-[var(--lab-rule)] py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--lab-muted)] md:grid">
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
            className="grid gap-4 border-b border-[var(--lab-rule)] py-5 md:grid-cols-[minmax(9rem,0.8fr)_repeat(3,minmax(0,1fr))] md:gap-5"
            style={active ? { backgroundColor: "color-mix(in oklch, var(--lab-accent) 6%, transparent)" } : undefined}
          >
            <strong role="rowheader" className="text-sm text-[var(--lab-ink)]">
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
    <span role="cell" className="text-sm leading-6 text-[var(--lab-muted)]">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.04em] text-[var(--lab-ink)] md:hidden">
        {label}
      </span>
      {children}
    </span>
  )
}

function DenseEvidence() {
  return (
    <section aria-labelledby="dense-evidence-heading" className="border-t border-[var(--lab-rule)] pt-6">
      <p className="lab-kicker">Measured in the dense-model study</p>
      <h3 id="dense-evidence-heading" className="mt-2 text-lg font-semibold text-[var(--lab-ink)]">
        Overlap, causal ablation, and the controls point the same way
      </h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
        Values are averages over six dense instruction-tuned models (24B to 123B parameters). They describe MLP-neuron populations in those models. They do not measure brain networks or MoE experts.
      </p>

      <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
        <div>
          <p className="lab-kicker">Shared top neurons (Jaccard overlap)</p>
          <BarRows
            label="Jaccard overlap of top attributed neurons, within versus across domains"
            max={20}
            unit="%"
            labelWidth="6.5rem"
            rows={[
              { label: "Same domain", value: 12.9, display: "12.9%", series: 1 },
              { label: "Different domain", value: 3.0, display: "3.0%", series: "ink" },
            ]}
          />
          <p className="mt-2 text-xs leading-5 text-[var(--lab-muted)]">
            Intersection over union of each task’s top 0.1% positively attributed neurons. Per model: 11.1–14.2% within, 2.3–3.5% across.
          </p>
        </div>
        <div>
          <p className="lab-kicker">Accuracy lost after ablation (points)</p>
          <BarRows
            label="Accuracy lost in percentage points after ablating a task's top neurons, within versus across domains"
            max={30}
            labelWidth="6.5rem"
            rows={[
              { label: "Same domain", value: 25.9, display: "25.9 pts", series: 1 },
              { label: "Different domain", value: 2.5, display: "2.5 pts", series: "ink" },
            ]}
          />
          <p className="mt-2 text-xs leading-5 text-[var(--lab-muted)]">
            Absolute drop in both-correct accuracy (chance 25%). Each neuron’s activation is replaced by its value on the alternative input. Per model the ratio is 6.1–12.3×.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="lab-kicker">Does it just track word similarity? Agreement with the four domains (ARI)</p>
          <BarRows
            label="Adjusted Rand index of the four-domain clustering, neuron overlap versus text-similarity baselines"
            max={1}
            labelWidth="11rem"
            rows={[
              { label: "Neuron overlap", value: 0.78, display: "0.78", series: 1 },
              { label: "SBERT sentence embeddings", value: 0.39, display: "0.39", series: "ink" },
              { label: "GloVe", value: 0.36, display: "0.36", series: "ink" },
              { label: "TF-IDF", value: 0.12, display: "0.12", series: "ink" },
              { label: "Qwen input-token embeddings", value: 0.04, display: "0.04", series: "ink" },
            ]}
          />
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-5 text-[var(--lab-muted)]">
        Preprint by Han, Andreas, Fedorenko and de Varda (MIT, 2026); not peer reviewed at the time of writing. Not shown: the ablation effect for the social domain is not statistically significant (p = 0.074 and 0.146 in the two tests reported), and the threshold-robustness check was run on one model.
      </p>
    </section>
  )
}
