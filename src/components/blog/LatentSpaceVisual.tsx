"use client"

import Image from "next/image"
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
    description: "Changing the wording changes the contextual state and shifts likely answer styles.",
  },
  {
    label: "Conversation",
    title: "3. A chat keeps moving",
    description: "Each turn is read with the accumulated context, so likely continuations keep shifting.",
  },
  {
    label: "Run clouds",
    title: "4. Repeated generations form clouds",
    description: "Sampling from the next-token distribution creates nearby but not identical outputs.",
  },
  {
    label: "Landscape",
    title: "5. Regions sit on a landscape",
    description: "The surface is an analogy: lower basins represent higher-probability continuation regions.",
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
  { label: "beginner explainer", color: "#2563eb", center: [34, 45], drift: [-18, 9] },
  { label: "geometric derivation", color: "#059669", center: [58, 27], drift: [-20, 4] },
  { label: "poetic metaphor", color: "#dc2626", center: [72, 56], drift: [-18, -5] },
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
  const showPrompts = step >= 1
  const showWordLabels = step === 0
  const showPromptLabels = step === 1
  const showConversationLabels = step === 2

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{activeStep.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            {activeStep.description}
          </p>
        </div>
        <label htmlFor="latent-space-spread" className={`w-full text-sm md:w-56 ${showClouds ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600"}`}>
          <span className="flex justify-between">
            <span>sampling spread</span>
            <span>{showClouds ? `${temperature}%` : "Run clouds"}</span>
          </span>
          <input
            id="latent-space-spread"
            className="mt-2 w-full accent-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:accent-white"
            type="range"
            min="0"
            max="100"
            value={temperature}
            disabled={!showClouds}
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
        <div
          className="relative aspect-[100/78] overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800"
        >
          <Image src="/blog/latent-space-projection.png" alt="Toy latent-space contour plot with word clusters and probability regions" fill sizes="(min-width: 1024px) 396px, 100vw" className="object-cover" />
          <svg
            viewBox="0 0 100 78"
            role="img"
            aria-label="2D latent-space prompt clusters"
            className="absolute inset-0 h-full w-full"
          >
            <rect width="100" height="78" fill="white" opacity="0.02" />
            {wordPoints.map((point) => (
              <g key={point.label}>
                <title>{point.label}</title>
                <circle cx={point.x} cy={point.y} r="1.8" fill={point.color} opacity="0.85" />
                {showWordLabels && (
                  <text
                    x={point.x + 2.5}
                    y={point.y + 1}
                    className="fill-gray-800 text-[3.1px] dark:fill-gray-200"
                    paintOrder="stroke"
                    stroke="white"
                    strokeWidth="0.55"
                  >
                    {point.label}
                  </text>
                )}
              </g>
            ))}
            {showPaths &&
              prompts.map((prompt) => (
                <g key={prompt.label}>
                  <title>{prompt.label}</title>
                  <path
                    d={`M ${prompt.center[0] + prompt.drift[0]} ${prompt.center[1] + prompt.drift[1]} C ${prompt.center[0] - 12} ${prompt.center[1] + prompt.drift[1] * 0.6}, ${prompt.center[0] - 8} ${prompt.center[1] - 6}, ${prompt.center[0]} ${prompt.center[1]}`}
                    fill="none"
                    stroke={prompt.color}
                    strokeWidth="1.1"
                    opacity="0.85"
                  />
                  <path
                    d={`M ${prompt.center[0] - 2.8} ${prompt.center[1] - 0.5} L ${prompt.center[0]} ${prompt.center[1]} L ${prompt.center[0] - 1.2} ${prompt.center[1] + 2.5}`}
                    fill="none"
                    stroke={prompt.color}
                    strokeLinecap="round"
                    strokeWidth="1"
                  />
                  <circle cx={prompt.center[0] + prompt.drift[0]} cy={prompt.center[1] + prompt.drift[1]} r="1.2" fill={prompt.color} opacity="0.55" />
                  {showPromptLabels && (
                    <text
                      x={prompt.center[0] + prompt.drift[0] - 2}
                      y={prompt.center[1] + prompt.drift[1] - 2.2}
                      className="fill-gray-700 text-[2.9px] dark:fill-gray-300"
                      paintOrder="stroke"
                      stroke="white"
                      strokeWidth="0.45"
                    >
                      start
                    </text>
                  )}
                </g>
              ))}
            {showClouds &&
              samples.map((point) => (
                <circle key={point.id} cx={point.x} cy={point.y} r="0.85" fill={point.color} opacity="0.42" />
              ))}
            {showConversation && (
              <g>
                <title>conversation path over turns</title>
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
                    {showConversationLabels && (
                      <text
                        x={point.x + 2.8}
                        y={point.y + (index % 2 === 0 ? -2.4 : 4)}
                        className="fill-gray-950 text-[3px] dark:fill-white"
                        paintOrder="stroke"
                        stroke="white"
                        strokeWidth="0.55"
                      >
                        {index + 1}. {point.label}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            )}
            {showPrompts &&
              prompts.map((prompt) => (
                <g key={`${prompt.label}-center`}>
                  <title>{prompt.label}</title>
                  <circle cx={prompt.center[0]} cy={prompt.center[1]} r="2.2" fill={prompt.color} />
                  {showPromptLabels && (
                    <text
                      x={prompt.center[0] + 3.5}
                      y={prompt.center[1] - 2.8}
                      className="fill-gray-950 text-[3.2px] dark:fill-white"
                      paintOrder="stroke"
                      stroke="white"
                      strokeWidth="0.55"
                    >
                      {prompt.label}
                    </text>
                  )}
                </g>
              ))}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Landscape view</h3>
          <div
            role="img"
            aria-label="Matplotlib 3D latent landscape surface"
            className={`relative mt-3 aspect-[88/62] overflow-hidden rounded-md border border-gray-100 transition-opacity dark:border-gray-800 ${
              showMesh ? "opacity-100" : "opacity-45"
            }`}
          >
            <Image src="/blog/latent-space-landscape.png" alt="3D toy energy landscape with colored prompt trajectories ending near probability basins" fill sizes="(min-width: 1024px) 282px, 100vw" className="object-cover" />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            This is not a real embedding projection or training-style optimization. It is a reading aid: lower basins mean higher-probability continuation regions, and colored paths show different prompt starts ending near different regions.
          </p>
        </div>
      </div>
      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A Matplotlib-generated toy projection with interactive overlays for word clusters, prompt-shifted states, conversation drift, and run clouds. It explains the geometry of the idea; it is not a measured embedding from a specific model.
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
