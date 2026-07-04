"use client"

import { useState } from "react"
import VisualMetric from "@/components/blog/VisualMetric"

type Stage = "search" | "gate" | "compound"

const stages: { id: Stage; label: string; title: string; copy: string; metrics: [string, number, string][] }[] = [
  {
    id: "search",
    label: "search",
    title: "Private trial-and-error",
    copy: "Most experiments should stay local: generate hypotheses, patch code, run the benchmark, and keep only useful evidence.",
    metrics: [
      ["experiment throughput", 88, "#2563eb"],
      ["public noise", 18, "#dc2626"],
      ["local memory", 72, "#059669"],
    ],
  },
  {
    id: "gate",
    label: "gate",
    title: "Review keeps the commons usable",
    copy: "A submission becomes useful only when the metric, artifact rules, attribution, and reproducibility story survive review.",
    metrics: [
      ["benchmark pressure", 94, "#f59e0b"],
      ["review load", 66, "#dc2626"],
      ["reproducibility", 78, "#059669"],
    ],
  },
  {
    id: "compound",
    label: "compound",
    title: "Public diffs compound",
    copy: "Accepted ideas become reusable research parts. The next searcher can inspect, copy, correct, and recombine them.",
    metrics: [
      ["reuse value", 92, "#059669"],
      ["frontier movement", 84, "#7c3aed"],
      ["attribution need", 76, "#f59e0b"],
    ],
  },
]

const nodes = [
  { id: "hypothesis", label: "hypothesis", x: 16, y: 23 },
  { id: "patch", label: "patch", x: 39, y: 15 },
  { id: "benchmark", label: "benchmark", x: 63, y: 23 },
  { id: "review", label: "review", x: 78, y: 45 },
  { id: "PR graph", label: "PR graph", x: 52, y: 58 },
  { id: "reuse", label: "reuse", x: 24, y: 49 },
] as const

export default function AutoresearchLoopVisual() {
  const [stage, setStage] = useState<Stage>("compound")
  const active = stages.find((item) => item.id === stage) ?? stages[0]
  const activeNodeIds = {
    search: ["hypothesis", "patch", "benchmark"],
    gate: ["benchmark", "review"],
    compound: ["review", "PR graph", "reuse"],
  }[stage]

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">The benchmark turns search into infrastructure</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Autoresearch is not just an agent writing code. It is a loop where private experiments, benchmark pressure, and public diffs reinforce each other.
          </p>
        </div>
        <div className="flex rounded-md border border-gray-200 p-1 dark:border-gray-800">
          {stages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded px-3 py-1.5 text-sm transition ${
                stage === item.id
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setStage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 100 76" role="img" aria-label="Distributed autoresearch loop" className="h-auto w-full">
            <defs>
              <marker id="autoresearch-arrow" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
                <path d="M 0 0 L 5 2.5 L 0 5 z" className="fill-gray-500 dark:fill-gray-300" />
              </marker>
            </defs>
            <rect width="100" height="76" className="fill-gray-50 dark:fill-gray-900" />
            <path d="M 18 23 C 25 12, 50 7, 62 22 S 86 33, 78 45 S 57 66, 37 56 S 15 45, 16 23" fill="none" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#autoresearch-arrow)" className="stroke-gray-400 dark:stroke-gray-500" />
            <path d="M 21 49 C 13 39, 10 30, 16 23" fill="none" strokeWidth="1.5" markerEnd="url(#autoresearch-arrow)" className="stroke-gray-400 dark:stroke-gray-500" />
            <rect x="36" y="31" width="28" height="12" rx="2.5" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" />
            <text x="50" y="38.4" textAnchor="middle" className="fill-gray-700 text-[3.2px] dark:fill-gray-200">hard metric</text>
            {nodes.map((node) => (
              <LoopNode key={node.id} node={node} active={activeNodeIds.includes(node.id)} />
            ))}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{active.title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{active.copy}</p>
          <div className="mt-4 space-y-3">
            {active.metrics.map(([label, value, color]) => (
              <VisualMetric key={label} label={label} value={value} color={color} />
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. The useful unit is the whole loop: benchmark, patch, score, review, public diff, and reuse.
      </figcaption>
    </figure>
  )
}

function LoopNode({ node, active }: { node: (typeof nodes)[number]; active: boolean }) {
  const width = Math.max(15, node.label.length * 1.35)

  return (
    <g>
      <rect
        x={node.x - width / 2}
        y={node.y - 5.5}
        width={width}
        height="11"
        rx="2"
        fill={active ? "#111827" : "#e5e7eb"}
        className={active ? "dark:fill-white" : "dark:fill-gray-800"}
      />
      <text x={node.x} y={node.y + 1} textAnchor="middle" className={active ? "fill-white text-[2.8px] dark:fill-gray-950" : "fill-gray-700 text-[2.8px] dark:fill-gray-200"}>
        {node.label}
      </text>
    </g>
  )
}
