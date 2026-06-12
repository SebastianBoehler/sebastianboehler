"use client"

import Image from "next/image"
import { useState } from "react"

const scenarios = [
  {
    label: "bare prompt",
    x: 34,
    y: 48,
    note: "The model knows the topic, but the answer style is still broad.",
    bars: [
      ["analogy", 32, "#2563eb"],
      ["definition", 25, "#7c3aed"],
      ["math", 18, "#059669"],
      ["code", 14, "#0891b2"],
      ["caveat", 11, "#dc2626"],
    ],
  },
  {
    label: "beginner context",
    x: 23,
    y: 35,
    note: "Context pulls probability toward examples and plain language.",
    bars: [
      ["analogy", 48, "#2563eb"],
      ["definition", 27, "#7c3aed"],
      ["math", 8, "#059669"],
      ["code", 7, "#0891b2"],
      ["caveat", 10, "#dc2626"],
    ],
  },
  {
    label: "skill context",
    x: 64,
    y: 27,
    note: "A skill narrows the region by adding task rules and local vocabulary.",
    bars: [
      ["procedure", 41, "#059669"],
      ["checklist", 24, "#0891b2"],
      ["code", 18, "#2563eb"],
      ["analogy", 6, "#7c3aed"],
      ["caveat", 11, "#dc2626"],
    ],
  },
  {
    label: "poetic context",
    x: 77,
    y: 57,
    note: "A different start point puts likely completions in another cluster.",
    bars: [
      ["metaphor", 45, "#dc2626"],
      ["analogy", 23, "#7c3aed"],
      ["definition", 14, "#2563eb"],
      ["math", 7, "#059669"],
      ["code", 11, "#0891b2"],
    ],
  },
] as const

export default function PromptDistributionVisual() {
  const [index, setIndex] = useState(0)
  const active = scenarios[index]

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Start point changes the distribution</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          The same broad topic can lead to different likely next moves once the prompt adds audience, task, or skill context.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Prompt context scenarios">
        {scenarios.map((scenario, scenarioIndex) => (
          <button
            key={scenario.label}
            type="button"
            role="tab"
            aria-selected={index === scenarioIndex}
            className={`rounded-md border px-3 py-2 text-sm font-medium ${
              index === scenarioIndex
                ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                : "border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
            onClick={() => setIndex(scenarioIndex)}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative aspect-[100/78] overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
          <Image src="/blog/latent-space-projection.png" alt="Toy latent-space contour plot used to show prompt start points" fill sizes="(min-width: 1024px) 323px, 100vw" className="object-cover" />
          <svg viewBox="0 0 100 78" className="absolute inset-0 h-full w-full" role="img" aria-label="Prompt start point moving through latent space">
            <path d={`M 34 48 C ${(34 + active.x) / 2} ${active.y + 10}, ${active.x - 8} ${active.y + 5}, ${active.x} ${active.y}`} fill="none" strokeWidth="1.2" strokeLinecap="round" className="stroke-gray-950 dark:stroke-white" />
            <circle cx="34" cy="48" r="2.4" className="fill-gray-950 dark:fill-white" />
            <circle cx={active.x} cy={active.y} r="3.2" fill="#f59e0b" strokeWidth="0.7" className="stroke-gray-950 dark:stroke-white" />
            <text x="37" y="47" className="fill-gray-950 stroke-white text-[3px] dark:fill-white dark:stroke-gray-950" paintOrder="stroke" strokeWidth="0.55">
              initial topic
            </text>
            <text x={active.x + 3.5} y={active.y - 2.5} className="fill-gray-950 stroke-white text-[3px] dark:fill-white dark:stroke-gray-950" paintOrder="stroke" strokeWidth="0.55">
              {active.label}
            </text>
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Likely next directions</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{active.note}</p>
          <div className="mt-4 space-y-3">
            {active.bars.map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 3. Context does not add a magic answer. It changes the model state, which changes the probability distribution over likely next moves. The percentages are illustrative, not measured from a model.
      </figcaption>
    </figure>
  )
}
