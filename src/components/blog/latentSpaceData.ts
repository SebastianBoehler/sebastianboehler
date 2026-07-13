export type PromptFrameId = "beginner" | "formal" | "metaphor"

export type Fit = "strong" | "plausible" | "weak"

export interface PromptFrame {
  id: PromptFrameId
  label: string
  modifier: string
  tokens: readonly string[]
  regions: readonly { label: string; fit: Fit; note: string }[]
  continuations: readonly { label: string; fit: Fit; note: string }[]
  runFamily: readonly string[]
  endpoint: string
}

export const latentSteps = [
  { label: "Learned map", shortLabel: "Map" },
  { label: "Contextual state", shortLabel: "State" },
  { label: "Likely continuations", shortLabel: "Options" },
  { label: "Repeated runs", shortLabel: "Runs" },
] as const

export const promptFrames: readonly PromptFrame[] = [
  {
    id: "beginner",
    label: "Beginner",
    modifier: "to a beginner",
    tokens: ["Explain", "latent", "space", "to", "a", "beginner"],
    endpoint: "plain-language explanation",
    regions: [
      { label: "examples", fit: "strong", note: "Concrete comparisons fit the audience cue." },
      { label: "definitions", fit: "plausible", note: "Technical terms still need a short definition." },
      { label: "derivations", fit: "weak", note: "Formal detail is not the requested starting point." },
    ],
    continuations: [
      { label: "Imagine a map…", fit: "strong", note: "Begins with an accessible analogy." },
      { label: "A latent space is…", fit: "plausible", note: "A concise definition also fits." },
      { label: "Let z be…", fit: "weak", note: "An equation-first answer conflicts with the cue." },
    ],
    runFamily: ["map analogy", "room analogy", "neighborhood example"],
  },
  {
    id: "formal",
    label: "Formal",
    modifier: "geometrically",
    tokens: ["Explain", "latent", "space", "geometrically"],
    endpoint: "mathematical explanation",
    regions: [
      { label: "derivations", fit: "strong", note: "The framing requests structure and notation." },
      { label: "definitions", fit: "plausible", note: "Terms still need to be established first." },
      { label: "examples", fit: "plausible", note: "Examples can support, but no longer lead." },
    ],
    continuations: [
      { label: "Let z be…", fit: "strong", note: "A coordinate-based opening fits the instruction." },
      { label: "A latent space is…", fit: "plausible", note: "A definition can introduce the notation." },
      { label: "Imagine a map…", fit: "weak", note: "A loose analogy underserves the requested rigor." },
    ],
    runFamily: ["vector derivation", "distance argument", "projection example"],
  },
  {
    id: "metaphor",
    label: "Metaphor",
    modifier: "as a metaphor",
    tokens: ["Explain", "latent", "space", "as", "a", "metaphor"],
    endpoint: "image-led explanation",
    regions: [
      { label: "imagery", fit: "strong", note: "The instruction privileges a memorable picture." },
      { label: "examples", fit: "plausible", note: "Concrete scenes can extend the metaphor." },
      { label: "derivations", fit: "weak", note: "Notation would interrupt the requested mode." },
    ],
    continuations: [
      { label: "Picture a landscape…", fit: "strong", note: "Starts inside the requested image." },
      { label: "Imagine a library…", fit: "plausible", note: "A second metaphor is also compatible." },
      { label: "Let z be…", fit: "weak", note: "Formal notation pulls away from the framing." },
    ],
    runFamily: ["landscape metaphor", "library metaphor", "constellation metaphor"],
  },
] as const
