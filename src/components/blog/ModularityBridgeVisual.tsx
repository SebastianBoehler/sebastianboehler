"use client"

import { useState } from "react"
import VisualMetric from "@/components/blog/VisualMetric"

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

export default function ModularityBridgeVisual() {
  const [view, setView] = useState<View>("dense")
  const active = views.find((item) => item.id === view) ?? views[0]

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
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
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 100 76" role="img" aria-label="Comparison of brain, dense LLM, and mixture of experts modularity" className="h-auto w-full">
            <rect width="100" height="76" className="fill-gray-50 dark:fill-gray-900" />
            {view === "brain" ? <BrainView /> : null}
            {view === "dense" ? <DenseView /> : null}
            {view === "moe" ? <MoeView /> : null}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{active.title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{active.copy}</p>
          <div className="mt-4 space-y-3">
            <VisualMetric label="within-domain overlap" value={64.5} color="#2563eb" displayValue="12.9%" />
            <VisualMetric label="cross-domain overlap" value={15} color="#94a3b8" displayValue="3.0%" />
            <VisualMetric label="within-domain ablation" value={64.8} color="#dc2626" displayValue="25.9%" />
            <VisualMetric label="cross-domain ablation" value={6.3} color="#94a3b8" displayValue="2.5%" />
          </div>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. The bars preserve the paper ratios visually by scaling overlap against 20% and ablation against 40%.
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
