"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { QualitativeRows } from "@/components/blog/visuals/VisualPrimitives"

const turns = [
  {
    label: "Ask for intuition",
    shortLabel: "Intuition",
    message: "Explain latent space intuitively.",
    carried: "The conversation now favors plain language and concrete examples.",
    tendencies: [
      { label: "analogy", fit: "strong", note: "Directly requested." },
      { label: "formalism", fit: "weak", note: "Not yet requested." },
      { label: "implementation", fit: "weak", note: "Outside the current scope." },
    ],
  },
  {
    label: "Request equations",
    shortLabel: "Equations",
    message: "Now make that mathematically precise.",
    carried: "The intuitive framing remains available, but the latest instruction raises the value of notation.",
    tendencies: [
      { label: "formalism", fit: "strong", note: "The latest turn asks for precision." },
      { label: "analogy", fit: "plausible", note: "Earlier context can still support the derivation." },
      { label: "implementation", fit: "weak", note: "Code is still not requested." },
    ],
  },
  {
    label: "Request code",
    shortLabel: "Code",
    message: "Show how this would look in code.",
    carried: "The response can reuse the earlier concept and notation while moving toward implementation.",
    tendencies: [
      { label: "implementation", fit: "strong", note: "The latest turn names the desired output." },
      { label: "formalism", fit: "plausible", note: "Prior notation can explain the code." },
      { label: "analogy", fit: "plausible", note: "Useful only where it clarifies an operation." },
    ],
  },
  {
    label: "Add caveats",
    shortLabel: "Caveats",
    message: "State where this analogy breaks down.",
    carried: "The subject remains the same, but the latest turn redirects attention toward uncertainty and boundaries.",
    tendencies: [
      { label: "limitations", fit: "strong", note: "Explicitly requested now." },
      { label: "implementation", fit: "plausible", note: "Earlier code may supply concrete caveats." },
      { label: "new analogy", fit: "weak", note: "Would distract from the boundary check." },
    ],
  },
] as const

export default function ConversationDriftVisual() {
  const [turnIndex, setTurnIndex] = useState(0)
  const current = turns[turnIndex]
  const visibleTurns = turns.slice(0, turnIndex + 1)

  return (
    <ConceptLab
      title="Each turn changes the next answer without erasing the earlier ones"
      description="Move the latest turn forward. The manipulated variable is the transcript prefix available to the next prediction."
      methodology="Conditioning trace · fixed example"
      steps={turns}
      activeStep={turnIndex}
      onStepChange={setTurnIndex}
      insights={[
        { label: "Latest instruction", body: current.message, tone: "intervention" },
        { label: "What remains in context", body: current.carried, tone: "accent" },
      ]}
      caption="The transcript creates inertia, not a locked route. A specific later instruction can preserve the topic while redirecting the answer family."
    >
      <div className="space-y-7" aria-live="polite">
        <section aria-labelledby="conversation-prefix-heading">
          <h3 id="conversation-prefix-heading" className="lab-kicker">Transcript available now</h3>
          <ol className="mt-3 divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
            {visibleTurns.map((turn, index) => (
              <li
                key={turn.label}
                className="grid gap-1 py-3 sm:grid-cols-[5rem_1fr] sm:gap-4"
                aria-current={index === turnIndex ? "step" : undefined}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  Turn {index + 1}
                </span>
                <span className={index === turnIndex ? "font-medium text-[rgb(var(--lab-accent))]" : "text-stone-700 dark:text-stone-300"}>
                  {turn.message}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <QualitativeRows label="Likely emphasis in the next answer" rows={current.tendencies} />
      </div>
    </ConceptLab>
  )
}
