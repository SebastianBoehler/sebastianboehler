"use client"

import { useMemo, useState } from "react"
import VisualMetric from "@/components/blog/VisualMetric"

type Problem = "linear" | "tabular" | "media"

const problems: { id: Problem; label: string; description: string }[] = [
  { id: "tabular", label: "tabular", description: "Rows, columns, thresholds, missingness, and local interactions." },
  { id: "linear", label: "smooth", description: "Mostly additive signal where coefficients and calibration matter." },
  { id: "media", label: "raw media", description: "Text, images, audio, or sequences that need learned representations." },
]

const models = [
  {
    label: "linear",
    x: 13,
    y: 50,
    color: "#2563eb",
    scores: { linear: 92, tabular: 54, media: 18 },
    note: "A transparent baseline for broad additive effects.",
  },
  {
    label: "tree",
    x: 32,
    y: 34,
    color: "#0891b2",
    scores: { linear: 56, tabular: 72, media: 20 },
    note: "Readable rules and interactions, but one tree is brittle.",
  },
  {
    label: "forest",
    x: 50,
    y: 43,
    color: "#059669",
    scores: { linear: 62, tabular: 82, media: 23 },
    note: "Many noisy trees vote, which calms down overfitting.",
  },
  {
    label: "boosting",
    x: 68,
    y: 31,
    color: "#f59e0b",
    scores: { linear: 58, tabular: 91, media: 25 },
    note: "Each new tree repairs residual mistakes from the current model.",
  },
  {
    label: "XGBoost",
    x: 79,
    y: 21,
    color: "#dc2626",
    scores: { linear: 60, tabular: 96, media: 28 },
    note: "Boosting with regularization, sparse handling, and systems work.",
  },
  {
    label: "neural net",
    x: 90,
    y: 53,
    color: "#7c3aed",
    scores: { linear: 48, tabular: 62, media: 94 },
    note: "Most useful when the model must learn representations from raw input.",
  },
] as const

export default function ModelSelectionMapVisual() {
  const [problem, setProblem] = useState<Problem>("tabular")
  const activeProblem = problems.find((item) => item.id === problem) ?? problems[0]
  const ranked = useMemo(
    () => [...models].sort((a, b) => b.scores[problem] - a.scores[problem]).slice(0, 3),
    [problem],
  )

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Model choice is a map, not a ladder</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            The right family depends on the shape of the signal: smooth effects, rule-heavy tables, or raw inputs that need representation learning.
          </p>
        </div>
        <div className="flex rounded-md border border-gray-200 p-1 dark:border-gray-800">
          {problems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded px-3 py-1.5 text-sm transition ${
                problem === item.id
                  ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                  : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setProblem(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 110 76" role="img" aria-label="Map of machine learning model families" className="h-auto w-full">
            <defs>
              <marker id="model-map-arrow" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
                <path d="M 0 0 L 5 2.5 L 0 5 z" className="fill-gray-500 dark:fill-gray-300" />
              </marker>
            </defs>
            <rect width="110" height="76" className="fill-gray-50 dark:fill-gray-900" />
            <path d="M 10 61 L 101 61" fill="none" markerEnd="url(#model-map-arrow)" strokeWidth="1.1" className="stroke-gray-400 dark:stroke-gray-500" />
            <path d="M 10 61 L 10 11" fill="none" markerEnd="url(#model-map-arrow)" strokeWidth="1.1" className="stroke-gray-400 dark:stroke-gray-500" />
            <text x="15" y="69" className="fill-gray-500 text-[3px] dark:fill-gray-300">transparent baseline</text>
            <text x="68" y="69" className="fill-gray-500 text-[3px] dark:fill-gray-300">flexible learner</text>
            <text x="13" y="12" className="fill-gray-500 text-[3px] dark:fill-gray-300">interaction handling</text>
            <path d="M 14 49 C 27 31, 45 39, 58 35 S 78 18, 94 51" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
            {models.map((model) => {
              const score = model.scores[problem]
              const isTop = ranked.some((item) => item.label === model.label)
              const labelY = model.y > 46 ? model.y - 8 : model.y + 10.2

              return (
                <g key={model.label}>
                  <circle cx={model.x} cy={model.y} r={isTop ? 5.6 : 4.4} fill={model.color} opacity={0.35 + score / 155} />
                  <circle cx={model.x} cy={model.y} r={isTop ? 7.4 : 5.4} fill="none" stroke={model.color} strokeWidth={isTop ? 1.3 : 0.7} opacity={isTop ? 0.85 : 0.45} />
                  <text x={model.x} y={labelY} textAnchor="middle" className="fill-gray-700 text-[3px] dark:fill-gray-200">
                    {model.label}
                  </text>
                  <title>{model.note}</title>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{activeProblem.description}</h3>
          <div className="mt-4 space-y-3">
            {ranked.map((model) => (
              <VisualMetric key={model.label} label={model.label} value={model.scores[problem]} color={model.color} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
            XGBoost sits near the high-performance tabular corner: more flexible than a linear baseline, usually less representation-hungry than a neural net.
          </p>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A qualitative model-selection map. The scores are illustrative fit signals, not benchmark results.
      </figcaption>
    </figure>
  )
}
