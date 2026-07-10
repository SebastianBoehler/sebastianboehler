"use client"

import { useMemo, useState } from "react"

const steps = [
  { label: "try", x: 18, y: 44, note: "retrieve before rereading" },
  { label: "compare", x: 42, y: 22, note: "find the gap" },
  { label: "adjust", x: 67, y: 35, note: "repair the model" },
  { label: "sleep", x: 82, y: 58, note: "space and consolidate" },
] as const

export default function LearningFeedbackVisual() {
  const [retrieval, setRetrieval] = useState(62)
  const [feedback, setFeedback] = useState(68)
  const [spacing, setSpacing] = useState(54)
  const state = useMemo(() => modelLearning(retrieval, feedback, spacing), [retrieval, feedback, spacing])

  return (
    <figure className="concept-lab">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">The learning loop</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Strong learning is not input only. It is retrieval, feedback, adjustment, and spaced consolidation.
          </p>
        </div>
        <div className="grid gap-3">
          <Control id="retrieval-effort" label="retrieval effort" value={retrieval} onChange={setRetrieval} />
          <Control id="feedback-quality" label="feedback quality" value={feedback} onChange={setFeedback} />
          <Control id="spacing-delay" label="spacing delay" value={spacing} onChange={setSpacing} />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="lab-stage p-0">
          <svg viewBox="0 0 100 76" role="img" aria-label="Feedback loop for learning and memory consolidation" className="h-auto w-full">
            <rect width="100" height="76" className="fill-gray-50 dark:fill-gray-900" />
            <path d="M 18 44 C 24 18, 55 9, 67 35 S 92 45, 82 58 S 38 72, 18 44" fill="none" strokeWidth={1.2 + state.loopStrength * 2.2} strokeLinecap="round" className="stroke-gray-950 dark:stroke-white" opacity="0.82" />
            <path d={`M 18 44 C 37 ${61 - state.memory * 0.32}, 67 ${68 - state.memory * 0.2}, 90 ${64 - state.memory * 0.28}`} fill="none" stroke="#059669" strokeWidth="2" opacity="0.65" />
            <path d={`M 16 64 C 38 70, 58 ${72 - state.forgetting * 0.35}, 90 ${67 - state.forgetting * 0.15}`} fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.58" />
            {steps.map((step, index) => (
              <g key={step.label}>
                <circle cx={step.x} cy={step.y} r={5.1} fill={colorFor(index)} opacity="0.95" />
                <text x={step.x} y={step.label === "sleep" ? step.y + 8 : step.y + 11} textAnchor="middle" className="fill-gray-600 text-[3px] dark:fill-gray-300">{step.label}</text>
                <title>{step.note}</title>
              </g>
            ))}
            <text x="9" y="11" className="fill-gray-500 text-[3px] dark:fill-gray-300">attempt creates evidence</text>
            <text x="48" y="11" className="fill-gray-500 text-[3px] dark:fill-gray-300">feedback closes the gap</text>
            <text x="56" y="66" className="fill-emerald-700 text-[3px] dark:fill-emerald-300">memory trace</text>
            <text x="11" y="69" className="fill-red-700 text-[3px] dark:fill-red-300">forgetting curve</text>
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What improves?</h3>
          <div className="mt-4 space-y-3">
            <Metric label="memory strength" value={state.memory} color="#059669" />
            <Metric label="error signal" value={state.errorSignal} color="#f59e0b" />
            <Metric label="forgetting risk" value={state.forgetting} color="#dc2626" />
            <Metric label="transfer readiness" value={state.transfer} color="#2563eb" />
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Effort without feedback can repeat mistakes. Feedback without retrieval becomes passive. Spacing keeps the loop from collapsing into short-term familiarity.
          </p>
        </div>
      </div>

      <figcaption className="lab-caption text-sm leading-6 text-gray-600 dark:text-gray-400">
        Figure 1. A teaching model, not a biological measurement. It shows why a good study session should generate an answer, compare it, repair it, and return later.
      </figcaption>
    </figure>
  )
}

function Control({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label htmlFor={id} className="text-sm text-gray-600 dark:text-gray-400">
      <span className="flex justify-between">
        <span>{label}</span>
        <span>{value}%</span>
      </span>
      <input id={id} className="mt-2 w-full accent-gray-950 dark:accent-white" type="range" min="0" max="100" value={value} onInput={(event) => onChange(Number(event.currentTarget.value))} onChange={(event) => onChange(Number(event.currentTarget.value))} />
    </label>
  )
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function modelLearning(retrieval: number, feedback: number, spacing: number) {
  const effort = retrieval / 100
  const correction = feedback / 100
  const interval = spacing / 100
  const loopStrength = effort * 0.38 + correction * 0.36 + interval * 0.26
  const memory = clamp(Math.round((0.35 * effort + 0.38 * correction + 0.27 * interval) * 100))
  const errorSignal = clamp(Math.round((0.55 * effort + 0.45 * correction) * 100))
  const forgetting = clamp(Math.round(82 - spacing * 0.48 - retrieval * 0.18))
  const transfer = clamp(Math.round((0.45 * correction + 0.35 * effort + 0.2 * interval) * 100))
  return { loopStrength, memory, errorSignal, forgetting, transfer }
}

function colorFor(index: number) {
  return ["#2563eb", "#f59e0b", "#7c3aed", "#059669"][index]
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}
