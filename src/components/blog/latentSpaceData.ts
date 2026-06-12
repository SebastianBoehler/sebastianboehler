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

export type LandscapePath = {
  id: string
  color: string
  points: [number, number][]
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
    title: "4. Starting points shape lineages",
    description: "Different initial contexts begin in different regions, then each answer token changes the next state and traces a lineage across the landscape.",
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

export const landscapePaths: LandscapePath[] = [
  {
    id: "beginner",
    color: "#2563eb",
    points: [
      [18, 45],
      [28, 42],
      [38, 44],
      [48, 50],
      [58, 54],
    ],
  },
  {
    id: "technical",
    color: "#059669",
    points: [
      [38, 22],
      [47, 28],
      [55, 34],
      [64, 42],
      [72, 48],
    ],
  },
  {
    id: "metaphor",
    color: "#dc2626",
    points: [
      [77, 31],
      [69, 36],
      [61, 43],
      [53, 50],
      [45, 56],
    ],
  },
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
