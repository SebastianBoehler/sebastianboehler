"use client"

import { useState } from "react"

type View = "brain" | "dense" | "moe"

const views: { id: View; label: string; title: string; copy: string }[] = [
  {
    id: "brain",
    label: "brain",
    title: "Functional networks",
    copy: "Brain systems are not sealed boxes, but language, social reasoning, formal demand, and physical reasoning repeatedly recruit partly separable networks.",
  },
  {
    id: "dense",
    label: "dense LLM",
    title: "Implicit unit populations",
    copy: "The paper looks inside dense models and finds task-relevant MLP units that overlap more within a cognitive domain than across domains.",
  },
  {
    id: "moe",
    label: "MoE",
    title: "Architectural routing",
    copy: "Mixture-of-experts models make routing explicit, but an expert is not automatically a clean cognitive module.",
  },
]

const domains = [
  { label: "language", color: "#2563eb", x: 24, y: 19 },
  { label: "formal", color: "#7c3aed", x: 72, y: 18 },
  { label: "physical", color: "#f59e0b", x: 28, y: 57 },
  { label: "social", color: "#059669", x: 76, y: 55 },
] as const

const evidence = {
  brain: {
    label: "What the comparison preserves",
    items: [
      "Specialization is functional: different tasks repeatedly recruit partly separate networks.",
      "The systems still share information; modularity is not isolation.",
      "The useful claim is a pressure against interference, not that a brain region equals an LLM unit.",
    ],
  },
  dense: {
    label: "What the paper actually measures",
    items: [
      "Tasks in the same domain shared 12.9% of their top-attributed units, compared with 3.0% across domains.",
      "Ablating within-domain units reduced task performance by 25.9%, compared with 2.5% for cross-domain units.",
      "Those are population-level patterns, not four neatly separated boxes inside a model.",
    ],
  },
  moe: {
    label: "What explicit routing does—and does not—show",
    items: [
      "A router can direct tokens to different experts, which makes specialization architectural.",
      "An expert can still be reused across many skills and domains.",
      "Routing alone does not establish a clean cognitive module; it only creates capacity for one.",
    ],
  },
} as const

export default function ModularityBridgeVisual() {
  const [view, setView] = useState<View>("dense")
  const active = views.find((item) => item.id === view) ?? views[0]
  const activeEvidence = evidence[view]

  return (
    <figure className="concept-lab">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Three kinds of modularity</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            The comparison is not one-to-one. Brains, dense LLMs, and MoE models separate work in different ways, under a shared pressure to reduce interference.
          </p>
        </div>
        <div className="flex rounded-md border border-gray-200 p-1 dark:border-gray-800">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded px-3 py-1.5 text-sm transition ${
                view === item.id
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="lab-stage">
          <svg viewBox="0 0 100 76" role="img" aria-label="Comparison of brain, dense LLM, and mixture of experts modularity" className="h-auto w-full">
            <rect width="100" height="76" className="fill-gray-50 dark:fill-gray-900" />
            {view === "brain" ? <BrainView /> : null}
            {view === "dense" ? <DenseView /> : null}
            {view === "moe" ? <MoeView /> : null}
          </svg>
        </div>

        <div className="lab-insight py-1">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{active.title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{active.copy}</p>
          <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{activeEvidence.label}</h4>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {activeEvidence.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <figcaption className="lab-caption text-sm leading-6 text-gray-600 dark:text-gray-400">
        Figure 1. The dense-model view is grounded in the paper&apos;s attribution and ablation results. The brain and MoE views show the analogy boundaries, not equivalent measurements.
      </figcaption>
    </figure>
  )
}

function BrainView() {
  return (
    <g>
      <path d="M 20 36 C 13 19, 27 8, 45 12 C 56 3, 75 9, 80 25 C 94 31, 87 59, 68 62 C 55 72, 34 68, 29 58 C 17 58, 10 48, 20 36" fill="#e5e7eb" className="dark:fill-gray-800" />
      <circle cx="50" cy="38" r="9" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" strokeWidth="1.2" />
      <text x="50" y="39.5" textAnchor="middle" className="fill-gray-700 text-[3px] dark:fill-gray-200">shared</text>
      {domains.map((domain) => (
        <g key={domain.label}>
          <path d={`M ${domain.x} ${domain.y} L 50 38`} stroke={domain.color} strokeWidth="1.2" opacity="0.55" />
          <circle cx={domain.x} cy={domain.y} r="6.2" fill={domain.color} opacity="0.85" />
          <text x={domain.x} y={domain.y + 11} textAnchor="middle" className="fill-gray-600 text-[3px] dark:fill-gray-300">
            {domain.label}
          </text>
        </g>
      ))}
    </g>
  )
}

function DenseView() {
  return (
    <g>
      <rect x="18" y="12" width="64" height="48" rx="4" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" strokeWidth="1.2" />
      <text x="50" y="68" textAnchor="middle" className="fill-gray-500 text-[3px] dark:fill-gray-300">one dense stack, different important unit populations</text>
      {domains.map((domain, domainIndex) =>
        Array.from({ length: 9 }).map((_, index) => {
          const x = 25 + ((index * 13 + domainIndex * 9) % 50)
          const y = 20 + ((index * 7 + domainIndex * 11) % 30)

          return <circle key={`${domain.label}-${index}`} cx={x} cy={y} r={index < 3 ? 2.4 : 1.6} fill={domain.color} opacity={index < 3 ? 0.82 : 0.32} />
        }),
      )}
      {domains.map((domain, index) => (
        <text key={domain.label} x={22 + index * 18} y="9" className="fill-gray-500 text-[2.8px] dark:fill-gray-300">
          {domain.label}
        </text>
      ))}
    </g>
  )
}

function MoeView() {
  return (
    <g>
      <rect x="8" y="32" width="18" height="12" rx="2" className="fill-gray-950 dark:fill-white" />
      <text x="17" y="39.5" textAnchor="middle" className="fill-white text-[3px] dark:fill-gray-950">router</text>
      {domains.map((domain, index) => {
        const x = 42 + (index % 2) * 29
        const y = 16 + Math.floor(index / 2) * 34

        return (
          <g key={domain.label}>
            <path d={`M 26 ${38} C 34 ${28 + index * 4}, ${x - 6} ${y + 6}, ${x} ${y + 6}`} fill="none" stroke={domain.color} strokeWidth="1.2" opacity="0.7" />
            <rect x={x} y={y} width="21" height="14" rx="2.5" fill={domain.color} opacity="0.82" />
            <text x={x + 10.5} y={y + 8.5} textAnchor="middle" className="fill-white text-[3px]">
              expert
            </text>
            <text x={x + 10.5} y={y + 20} textAnchor="middle" className="fill-gray-500 text-[3px] dark:fill-gray-300">
              {domain.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}
