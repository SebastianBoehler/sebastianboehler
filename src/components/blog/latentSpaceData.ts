export type PromptPoint = {
  label: string
  color: string
  center: [number, number]
  drift: [number, number]
}

export type WordPoint = {
  label: string
  x: number
  y: number
  color: string
}

export const latentSteps = [
  {
    label: "Word clusters",
    title: "1. Similar words cluster",
    description: "Words used in similar contexts land near each other: pets, code, and finance form rough neighborhoods.",
  },
  {
    label: "Path",
    title: "2. Context draws a path",
    description: "A prompt or conversation updates the contextual state step by step; it can cross neighborhoods when the context changes enough.",
  },
  {
    label: "Run clouds",
    title: "3. Repeated generations form clouds",
    description: "Sampling from the next-token distribution creates nearby but not identical outputs around the conditioned region.",
  },
  {
    label: "Landscape",
    title: "4. Regions sit on a landscape",
    description: "The surface is an analogy: lower basins represent continuation regions that are easier for this context to fall into.",
  },
] as const

export const wordPoints: WordPoint[] = [
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

export const prompts: PromptPoint[] = [
  { label: "beginner explainer", color: "#2563eb", center: [34, 45], drift: [-18, 9] },
  { label: "geometric derivation", color: "#059669", center: [58, 27], drift: [-20, 4] },
  { label: "poetic metaphor", color: "#dc2626", center: [72, 56], drift: [-18, -5] },
]

export const conversationPath = [
  { label: "ask intuition", x: 24, y: 43 },
  { label: "add equations", x: 42, y: 33 },
  { label: "request code", x: 58, y: 25 },
  { label: "ask caveats", x: 72, y: 43 },
]

export function makeSamples(spread: number) {
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
