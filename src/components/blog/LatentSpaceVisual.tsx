"use client"

import { useMemo, useState } from "react"

type PromptPoint = {
  label: string
  color: string
  center: [number, number]
  drift: [number, number]
}

type WordPoint = {
  label: string
  x: number
  y: number
  color: string
}

const steps = [
  {
    label: "Word clusters",
    title: "1. Similar words cluster",
    description: "Words used in similar contexts land near each other: pets, code, and finance form rough neighborhoods.",
  },
  {
    label: "Trajectories",
    title: "2. Prompts bend the path",
    description: "Changing the wording pulls the model state toward a different region and answer style.",
  },
  {
    label: "Conversation",
    title: "3. A chat keeps moving",
    description: "Each turn starts from the accumulated context, so the conversation traces a path through regions.",
  },
  {
    label: "Run clouds",
    title: "4. Repeated generations form clouds",
    description: "Sampling from the next-token distribution creates nearby but not identical outputs.",
  },
  {
    label: "Landscape",
    title: "5. Regions sit on a landscape",
    description: "The mesh is a simplified way to see basins of likely continuation, not a measured embedding.",
  },
] as const

const wordPoints: WordPoint[] = [
  { label: "cat", x: 18, y: 24, color: "#2563eb" },
  { label: "kitten", x: 24, y: 29, color: "#2563eb" },
  { label: "pet", x: 16, y: 34, color: "#2563eb" },
  { label: "compiler", x: 54, y: 18, color: "#059669" },
  { label: "runtime", x: 63, y: 24, color: "#059669" },
  { label: "function", x: 58, y: 33, color: "#059669" },
  { label: "bond", x: 75, y: 52, color: "#dc2626" },
  { label: "market", x: 83, y: 58, color: "#dc2626" },
  { label: "rate", x: 72, y: 63, color: "#dc2626" },
]

const prompts: PromptPoint[] = [
  { label: "beginner explainer", color: "#2563eb", center: [32, 42], drift: [15, -8] },
  { label: "geometric derivation", color: "#059669", center: [55, 30], drift: [-9, -12] },
  { label: "poetic metaphor", color: "#dc2626", center: [68, 58], drift: [8, 14] },
]

const conversationPath = [
  { label: "ask intuition", x: 27, y: 44 },
  { label: "add equations", x: 46, y: 34 },
  { label: "request code", x: 62, y: 25 },
  { label: "ask caveats", x: 72, y: 45 },
]

export default function LatentSpaceVisual() {
  const [temperature, setTemperature] = useState(42)
  const [step, setStep] = useState(0)
  const spread = 4 + temperature / 9
  const samples = useMemo(() => makeSamples(spread), [spread])
  const activeStep = steps[step]
  const showPaths = step >= 1
  const showConversation = step >= 2
  const showClouds = step >= 3
  const showMesh = step >= 4

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{activeStep.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            {activeStep.description}
          </p>
        </div>
        <label htmlFor="latent-space-spread" className="w-full text-sm text-gray-600 dark:text-gray-400 md:w-56">
          <span className="flex justify-between">
            <span>sampling spread</span>
            <span>{temperature}%</span>
          </span>
          <input
            id="latent-space-spread"
            className="mt-2 w-full accent-gray-950 dark:accent-white"
            type="range"
            min="0"
            max="100"
            value={temperature}
            onChange={(event) => setTemperature(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5" role="tablist" aria-label="Latent space explanation steps">
        {steps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={step === index}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              step === index
                ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
            onClick={() => setStep(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 100 78" role="img" aria-label="2D latent-space prompt clusters" className="h-auto w-full">
            <defs>
              <pattern id="latent-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.25" />
              </pattern>
            </defs>
            <rect width="100" height="78" className="fill-gray-50 text-gray-200 dark:fill-gray-950 dark:text-gray-800" />
            <rect width="100" height="78" fill="url(#latent-grid)" opacity="0.85" />
            {wordPoints.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="1.8" fill={point.color} opacity="0.85" />
                <text x={point.x + 2.5} y={point.y + 1} className="fill-gray-700 text-[2.7px] dark:fill-gray-300">
                  {point.label}
                </text>
              </g>
            ))}
            {showPaths &&
              prompts.map((prompt) => (
                <path
                  key={prompt.label}
                  d={`M ${prompt.center[0] - prompt.drift[0] * 0.45} ${prompt.center[1] - prompt.drift[1] * 0.45} C ${prompt.center[0] - 8} ${prompt.center[1] - 10}, ${prompt.center[0] + 8} ${prompt.center[1] + 10}, ${prompt.center[0]} ${prompt.center[1]}`}
                  fill="none"
                  stroke={prompt.color}
                  strokeDasharray="2 2"
                  strokeWidth="0.7"
                  opacity="0.7"
                />
              ))}
            {showClouds &&
              samples.map((point) => (
                <circle key={point.id} cx={point.x} cy={point.y} r="0.85" fill={point.color} opacity="0.42" />
              ))}
            {showConversation && (
              <g>
                <polyline
                  points={conversationPath.map((point) => `${point.x},${point.y}`).join(" ")}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {conversationPath.map((point, index) => (
                  <g key={point.label}>
                    <circle cx={point.x} cy={point.y} r="2" fill="#7c3aed" />
                    <text x={point.x + 2.8} y={point.y + (index % 2 === 0 ? -2.4 : 4)} className="fill-gray-950 text-[2.6px] dark:fill-white">
                      {index + 1}. {point.label}
                    </text>
                  </g>
                ))}
              </g>
            )}
            {prompts.map((prompt) => (
              <g key={`${prompt.label}-center`}>
                <circle cx={prompt.center[0]} cy={prompt.center[1]} r="2.2" fill={prompt.color} />
                <text x={prompt.center[0] + 3.5} y={prompt.center[1] - 2.8} className="fill-gray-950 text-[3px] dark:fill-white">
                  {prompt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Compressed mesh view</h3>
          <svg viewBox="0 0 112 94" role="img" aria-label="3D-style latent-space mesh" className="mt-3 h-auto w-full">
            {Array.from({ length: 9 }).map((_, row) =>
              Array.from({ length: 9 }).map((__, col) => {
                const x = 13 + col * 10 + row * 2.3
                const y = 72 - row * 6.2 - Math.sin((col + row + temperature / 18) * 0.9) * 5
                return <circle key={`${row}-${col}`} cx={x} cy={y} r="0.75" className="fill-gray-400 dark:fill-gray-600" opacity={showMesh ? 1 : 0.25} />
              }),
            )}
            {prompts.map((prompt) => {
              const x = 18 + prompt.center[0] * 0.78
              const y = 78 - prompt.center[1] * 0.55

              return (
                <g key={`${prompt.label}-mesh`}>
                  <line x1={x} y1={y + 12} x2={x} y2={y} stroke={prompt.color} strokeWidth="0.8" opacity={showMesh ? 0.8 : 0.25} />
                  <circle cx={x} cy={y} r={2.6 + temperature / 42} fill={prompt.color} opacity={showClouds ? 0.24 : 0.08} />
                  <circle cx={x} cy={y} r="1.9" fill={prompt.color} />
                </g>
              )
            })}
          </svg>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            The mesh is not a real embedding projection. It is a reading aid: nearby basins mean similar prompt pressure, while the purple path shows conversation drift.
          </p>
        </div>
      </div>
      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A compressed sketch of word clusters, prompt trajectories, conversation drift, and run clouds. The layout is illustrative: it shows the shape of the idea, not a measured embedding projection.
      </figcaption>
    </figure>
  )
}

function makeSamples(spread: number) {
  return prompts.flatMap((prompt, promptIndex) =>
    Array.from({ length: 38 }).map((_, index) => {
      const angle = seeded(promptIndex * 100 + index) * Math.PI * 2
      const radius = Math.sqrt(seeded(promptIndex * 180 + index * 7)) * spread

      return {
        id: `${prompt.label}-${index}`,
        color: prompt.color,
        x: clamp(prompt.center[0] + Math.cos(angle) * radius, 4, 96),
        y: clamp(prompt.center[1] + Math.sin(angle) * radius, 4, 74),
      }
    }),
  )
}

function seeded(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
