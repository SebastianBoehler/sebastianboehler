"use client"

import { useMemo, useState } from "react"

type Mode = "constraint" | "energy" | "flow"

const modes: { id: Mode; label: string }[] = [
  { id: "constraint", label: "constraint" },
  { id: "energy", label: "energy" },
  { id: "flow", label: "flow" },
]

const data = [
  [7, 47],
  [16, 30],
  [25, 19],
  [35, 24],
  [45, 43],
  [55, 59],
  [66, 56],
  [76, 38],
  [87, 20],
  [94, 26],
] as const

export default function PhysicsInformedVisual() {
  const [mode, setMode] = useState<Mode>("constraint")
  const [physicsWeight, setPhysicsWeight] = useState(58)
  const blend = physicsWeight / 100
  const curve = useMemo(() => makeCurve(blend), [blend])
  const dataOnly = useMemo(() => makeCurve(0), [])
  const physicsOnly = useMemo(() => makeCurve(1), [])

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Physics changes the search space</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Move between three views: laws as training constraints, energy basins as stable outcomes, and flow fields as learned dynamics.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <div className="flex rounded-md border border-gray-200 p-1 dark:border-gray-800">
            {modes.map((item) => (
              <button
                key={item.id}
                className={`rounded px-3 py-1.5 text-sm transition ${
                  mode === item.id
                    ? "bg-gray-950 text-white dark:bg-white dark:text-gray-950"
                    : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                }`}
                type="button"
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label htmlFor="physics-weight" className="w-full text-sm text-gray-600 dark:text-gray-400 sm:w-56">
            <span className="flex justify-between">
              <span>physics weight</span>
              <span>{physicsWeight}%</span>
            </span>
            <input
              id="physics-weight"
              className="mt-2 w-full accent-gray-950 dark:accent-white"
              type="range"
              min="0"
              max="100"
              value={physicsWeight}
              onChange={(event) => setPhysicsWeight(Number(event.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
          {mode === "constraint" ? <ConstraintView curve={curve} dataOnly={dataOnly} physicsOnly={physicsOnly} /> : null}
          {mode === "energy" ? <EnergyView blend={blend} /> : null}
          {mode === "flow" ? <FlowView blend={blend} /> : null}
        </div>
        <Explanation mode={mode} physicsWeight={physicsWeight} />
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A toy model of physics-guided learning. Data still matters, but laws, symmetries, conservation rules, or simulators make some solutions easier to reach than others.
      </figcaption>
    </figure>
  )
}

function ConstraintView({
  curve,
  dataOnly,
  physicsOnly,
}: {
  curve: readonly (readonly [number, number])[]
  dataOnly: readonly (readonly [number, number])[]
  physicsOnly: readonly (readonly [number, number])[]
}) {
  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Physics constraint changes a fitted model curve" className="h-auto w-full">
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      <path d="M 8 60 H 96 M 8 8 V 60" fill="none" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.8" />
      <path d={toPath(dataOnly)} fill="none" stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1.1" />
      <path d={toPath(physicsOnly)} fill="none" stroke="#059669" strokeDasharray="4 2" strokeWidth="1.1" opacity="0.6" />
      <path d={toPath(curve)} fill="none" stroke="#111827" strokeWidth="1.8" className="dark:stroke-white" />
      {data.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" fill="#2563eb" opacity="0.85" />
      ))}
      <text x="10" y="12" className="fill-gray-500 text-[3px]">noisy observations</text>
      <text x="53" y="13" className="fill-gray-500 text-[3px]">law-shaped solution</text>
    </svg>
  )
}

function EnergyView({ blend }: { blend: number }) {
  const paths = [
    `M 15 17 C ${29 + blend * 9} ${20 + blend * 8}, ${38 + blend * 13} ${36 + blend * 7}, 50 47`,
    `M 86 14 C ${73 - blend * 10} ${22 + blend * 7}, ${66 - blend * 13} ${36 + blend * 7}, 50 47`,
    `M 28 61 C ${35 + blend * 4} ${55 - blend * 2}, ${42 + blend * 6} ${50 - blend * 1}, 50 47`,
  ]

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Energy landscape with trajectories settling into a basin" className="h-auto w-full">
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      {[40, 31, 23, 15].map((radius, index) => (
        <ellipse
          key={radius}
          cx="50"
          cy="47"
          rx={radius}
          ry={radius * 0.42}
          fill="none"
          stroke={index === 3 ? "#111827" : "#cbd5e1"}
          strokeWidth={index === 3 ? 1.3 : 0.9}
          opacity={0.9 - index * 0.12}
          className={index === 3 ? "dark:stroke-white" : "dark:stroke-gray-700"}
        />
      ))}
      <ellipse cx="50" cy="47" rx="7" ry="3.6" fill="#111827" className="dark:fill-white" opacity="0.9" />
      {paths.map((path, index) => (
        <path key={path} d={path} fill="none" stroke={["#2563eb", "#dc2626", "#059669"][index]} strokeWidth="1.7" strokeLinecap="round" />
      ))}
      {[
        [15, 17],
        [86, 14],
        [28, 61],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#f59e0b" />
      ))}
      <text x="8" y="10" className="fill-gray-500 text-[3px]">higher energy</text>
      <text x="55" y="51" className="fill-gray-500 text-[3px]">stable basin</text>
    </svg>
  )
}

function FlowView({ blend }: { blend: number }) {
  const arrows = Array.from({ length: 24 }).map((_, index) => {
    const x = 14 + (index % 6) * 14
    const y = 14 + Math.floor(index / 6) * 12
    const dx = Math.cos((x + y) / 18) * (2 + blend * 4)
    const dy = Math.sin((x - y) / 16) * (2 + blend * 4)
    return [x, y, x + dx, y + dy] as const
  })

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Vector field showing learned dynamics over time" className="h-auto w-full">
      <defs>
        <marker id="arrow-head" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
          <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#64748b" />
        </marker>
      </defs>
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      {arrows.map(([x1, y1, x2, y2]) => (
        <path key={`${x1}-${y1}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow-head)" opacity="0.75" />
      ))}
      <path d="M 12 56 C 28 38, 35 44, 43 31 S 65 17, 84 25" fill="none" stroke="#111827" strokeWidth="2" className="dark:stroke-white" />
      <circle cx="12" cy="56" r="2.5" fill="#2563eb" />
      <circle cx="84" cy="25" r="2.5" fill="#059669" />
      <text x="9" y="63" className="fill-gray-500 text-[3px]">state now</text>
      <text x="76" y="20" className="fill-gray-500 text-[3px]">state later</text>
    </svg>
  )
}

function Explanation({ mode, physicsWeight }: { mode: Mode; physicsWeight: number }) {
  const text = {
    constraint: "The model fits observations, but the physics term penalizes curves that violate the expected law.",
    energy: "A lower-energy basin is an outcome the system tends to settle into. In some models this is literal; for LLMs it is mostly a useful analogy.",
    flow: "A flow view asks how the state changes over time. Neural ODEs learn this change rule instead of stacking only discrete layers.",
  }[mode]

  return (
    <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What changed?</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
      <div className="mt-4 space-y-3 text-sm">
        <Metric label="data pressure" value={100 - physicsWeight} color="#2563eb" />
        <Metric label="physics pressure" value={physicsWeight} color="#059669" />
        <Metric label="degrees of freedom" value={Math.max(8, 90 - Math.round(physicsWeight * 0.72))} color="#dc2626" />
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

function makeCurve(blend: number) {
  return Array.from({ length: 34 }).map((_, index) => {
    const x = 7 + index * 2.65
    const physics = 40 - Math.sin((x - 8) / 10) * 19
    const wiggle = physics + Math.sin(x / 2.7) * 7 + Math.cos(x / 5) * 4
    return [x, wiggle * (1 - blend) + physics * blend] as const
  })
}

function toPath(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
}
