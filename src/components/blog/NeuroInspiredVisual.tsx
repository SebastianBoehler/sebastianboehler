"use client"

import { useState } from "react"

type View = "synapse" | "myelin" | "credit"

const views: { id: View; label: string }[] = [
  { id: "synapse", label: "synapse" },
  { id: "myelin", label: "myelin" },
  { id: "credit", label: "credit" },
]

export default function NeuroInspiredVisual() {
  const [view, setView] = useState<View>("synapse")
  const [practice, setPractice] = useState(62)
  const strength = practice / 100

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Learning changes useful pathways</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Practice does not copy a file into the brain. It changes synapses, timing, and feedback signals that make useful activity patterns easier to reuse.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <div className="flex rounded-md border border-gray-200 p-1 dark:border-gray-800">
            {views.map((item) => (
              <button
                key={item.id}
                className={`rounded px-3 py-1.5 text-sm transition ${
                  view === item.id
                    ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                    : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                }`}
                type="button"
                onClick={() => setView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label htmlFor="practice" className="w-full text-sm text-gray-600 dark:text-gray-400 sm:w-56">
            <span className="flex justify-between">
              <span>practice signal</span>
              <span>{practice}%</span>
            </span>
            <input
              id="practice"
              className="mt-2 w-full accent-gray-950 dark:accent-white"
              type="range"
              min="0"
              max="100"
              value={practice}
              onChange={(event) => setPractice(Number(event.currentTarget.value))}
              onInput={(event) => setPractice(Number(event.currentTarget.value))}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          <Pathway view={view} strength={strength} />
        </div>
        <Panel view={view} practice={practice} />
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A toy pathway, not a biological diagram. Synaptic strength is closest to an ML weight analogy; myelin is closer to timing, reliability, and efficiency.
      </figcaption>
    </figure>
  )
}

function Pathway({ view, strength }: { view: View; strength: number }) {
  const stroke = 2 + strength * 5
  const wrapOpacity = view === "myelin" ? 0.35 + strength * 0.55 : 0.16 + strength * 0.25
  const creditOpacity = view === "credit" ? 0.25 + strength * 0.55 : 0.12

  return (
    <svg viewBox="0 0 120 76" role="img" aria-label="Brain inspired learning pathway" className="h-auto w-full">
      <defs>
        <marker id="neuro-arrow" markerHeight="6" markerWidth="6" orient="auto" refX="5" refY="3">
          <path d="M 0 0 L 6 3 L 0 6 z" className="fill-gray-500 dark:fill-gray-300" />
        </marker>
      </defs>
      <rect width="120" height="76" className="fill-gray-50 dark:fill-gray-900" />
      <path d="M 14 38 C 27 20, 44 21, 57 35" fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.55" markerEnd="url(#neuro-arrow)" />
      <path d="M 63 41 C 78 55, 96 54, 108 36" fill="none" stroke="#64748b" strokeWidth="1.5" opacity="0.55" markerEnd="url(#neuro-arrow)" />

      {view === "myelin" ? (
        <>
          <MyelinWrap x={30} y={25} opacity={wrapOpacity} />
          <MyelinWrap x={37} y={24} opacity={wrapOpacity} />
          <MyelinWrap x={44} y={27} opacity={wrapOpacity} />
          <MyelinWrap x={80} y={51} opacity={wrapOpacity} />
          <MyelinWrap x={88} y={50} opacity={wrapOpacity} />
          <MyelinWrap x={96} y={45} opacity={wrapOpacity} />
        </>
      ) : null}

      <circle cx="14" cy="38" r="7" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" strokeWidth="1.2" />
      <circle cx="60" cy="38" r="8" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" strokeWidth="1.2" />
      <circle cx="108" cy="36" r="7" className="fill-white stroke-gray-300 dark:fill-gray-950 dark:stroke-gray-700" strokeWidth="1.2" />

      <path d="M 21 38 C 35 35, 45 35, 52 38" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth={stroke} opacity={0.72} />
      <path d="M 68 39 C 82 43, 94 42, 101 37" fill="none" stroke="#059669" strokeLinecap="round" strokeWidth={1.8 + strength * 3.5} opacity={0.7} />

      <path d="M 104 24 C 89 9, 49 9, 23 27" fill="none" stroke="#8b5cf6" strokeDasharray="3 2" strokeWidth="2" opacity={creditOpacity} />
      {view === "credit" ? <circle cx={78 - strength * 18} cy="14" r={2.4 + strength * 1.8} fill="#8b5cf6" opacity="0.85" /> : null}

      <text x="9" y="62" className="fill-gray-500 text-[4px] dark:fill-gray-300">cue</text>
      <text x="51" y="62" className="fill-gray-500 text-[4px] dark:fill-gray-300">hidden path</text>
      <text x="99" y="62" className="fill-gray-500 text-[4px] dark:fill-gray-300">action</text>
    </svg>
  )
}

function MyelinWrap({ x, y, opacity }: { x: number; y: number; opacity: number }) {
  return <ellipse cx={x} cy={y} rx="4.4" ry="2.2" fill="#f59e0b" opacity={opacity} transform={`rotate(-24 ${x} ${y})`} />
}

function Panel({ view, practice }: { view: View; practice: number }) {
  const copy = {
    synapse: "This is the closest biological analogy to a neural-network weight: repeated useful activity can strengthen or weaken synaptic influence.",
    myelin: "Myelin does not choose the output. It can make active axons transmit signals faster, more reliably, and with better timing.",
    credit: "The hard part is knowing which connection deserved the update. Brains use local activity plus global signals such as reward, attention, and error.",
  }[view]

  return (
    <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What changes?</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{copy}</p>
      <div className="mt-4 space-y-3 text-sm">
        <Metric label="synaptic gain" value={Math.min(96, 28 + Math.round(practice * 0.68))} color="#2563eb" />
        <Metric label="timing reliability" value={Math.min(94, 20 + Math.round(practice * 0.58))} color="#f59e0b" />
        <Metric label="credit signal" value={Math.min(90, 18 + Math.round(practice * 0.52))} color="#8b5cf6" />
      </div>
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
