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
  const updatePhysicsWeight = (value: string) => setPhysicsWeight(Number(value))
  const curve = useMemo(() => makeCurve(blend), [blend])
  const dataOnly = useMemo(() => makeCurve(0), [])
  const physicsOnly = useMemo(() => makeCurve(1), [])

  return (
    <figure className="concept-lab">
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
              onInput={(event) => updatePhysicsWeight(event.currentTarget.value)}
              onChange={(event) => updatePhysicsWeight(event.currentTarget.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="lab-stage">
          {mode === "constraint" ? <ConstraintView curve={curve} dataOnly={dataOnly} physicsOnly={physicsOnly} /> : null}
          {mode === "energy" ? <EnergyView blend={blend} /> : null}
          {mode === "flow" ? <FlowView blend={blend} /> : null}
        </div>
        <Explanation mode={mode} physicsWeight={physicsWeight} />
      </div>

      <figcaption className="lab-caption text-sm leading-6 text-gray-600 dark:text-gray-400">
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
      <path d={toPath(dataOnly)} fill="none" strokeDasharray="2 2" strokeWidth="1.1" className="stroke-slate-400 dark:stroke-slate-500" />
      <path d={toPath(physicsOnly)} fill="none" stroke="#059669" strokeDasharray="4 2" strokeWidth="1.1" opacity="0.6" />
      <path d={toPath(curve)} fill="none" strokeWidth="1.8" className="stroke-gray-950 dark:stroke-white" />
      {data.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" fill="#2563eb" opacity="0.85" />
      ))}
      <text x="10" y="12" className="fill-gray-500 text-[3px] dark:fill-gray-300">noisy observations</text>
      <text x="53" y="13" className="fill-gray-500 text-[3px] dark:fill-gray-300">law-shaped solution</text>
      <g transform="translate(12 64)">
        <path d="M 0 0 H 7" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.2" strokeDasharray="2 2" />
        <text x="9" y="1.1" className="fill-gray-500 text-[2.6px] dark:fill-gray-300">data only</text>
        <path d="M 32 0 H 39" stroke="#059669" strokeWidth="1.2" strokeDasharray="4 2" />
        <text x="41" y="1.1" className="fill-gray-500 text-[2.6px] dark:fill-gray-300">physical prior</text>
        <path d="M 69 0 H 76" className="stroke-gray-950 dark:stroke-white" strokeWidth="1.7" />
        <text x="78" y="1.1" className="fill-gray-500 text-[2.6px] dark:fill-gray-300">blend</text>
      </g>
    </svg>
  )
}

function EnergyView({ blend }: { blend: number }) {
  const activePath = `M 15 18 C ${28 + blend * 8} ${21 + blend * 18}, ${38 + blend * 9} ${35 + blend * 6}, 50 47`

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
          strokeWidth={index === 3 ? 1.3 : 0.9}
          opacity={0.9 - index * 0.12}
          className={index === 3 ? "stroke-gray-950 dark:stroke-white" : "stroke-slate-300 dark:stroke-gray-700"}
        />
      ))}
      <path d="M 27 20 C 37 28, 40 41, 48 52" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" opacity={0.14 + blend * 0.24} />
      <ellipse cx="50" cy="47" rx="7" ry="3.6" className="fill-gray-950 dark:fill-white" opacity="0.9" />
      <path d="M 15 18 L 50 47" fill="none" stroke="#64748b" strokeDasharray="2 2" strokeWidth="1.5" opacity="0.7" />
      <path d={activePath} fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="15" cy="18" r="2.4" fill="#f59e0b" />
      <circle cx="50" cy="47" r="2.6" fill="#059669" />
      <text x="8" y="10" className="fill-gray-500 text-[3px] dark:fill-gray-300">same objective</text>
      <text x="54" y="55" className="fill-gray-500 text-[3px] dark:fill-gray-300">low-loss basin</text>
    </svg>
  )
}

function FlowView({ blend }: { blend: number }) {
  const arrows = Array.from({ length: 24 }).map((_, index) => {
    const x = 14 + (index % 6) * 14
    const y = 14 + Math.floor(index / 6) * 12
    const [dx, dy] = flowAt(x, y, blend)
    return [x, y, x + dx, y + dy] as const
  })
  const trajectory = makeFlowTrajectory(blend)

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Vector field showing learned dynamics over time" className="h-auto w-full">
      <defs>
        <marker id="arrow-head" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
          <path d="M 0 0 L 5 2.5 L 0 5 z" className="fill-slate-500 dark:fill-slate-300" />
        </marker>
      </defs>
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      {arrows.map(([x1, y1, x2, y2]) => (
        <path key={`${x1}-${y1}`} d={`M ${x1} ${y1} L ${x2} ${y2}`} strokeWidth="1" markerEnd="url(#arrow-head)" opacity="0.75" className="stroke-slate-500 dark:stroke-slate-300" />
      ))}
      <path d={toSmoothPath(trajectory)} fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="stroke-gray-950 dark:stroke-white" />
      {trajectory.filter((_, index) => index % 4 === 0).map(([x, y], index) => (
        <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r={index === 0 ? 2.5 : 1.3} fill={index === 0 ? "#2563eb" : "#64748b"} opacity={index === 0 ? 1 : 0.82} />
      ))}
      <circle cx={trajectory[trajectory.length - 1][0]} cy={trajectory[trajectory.length - 1][1]} r="2.5" fill="#059669" />
      <text x="9" y="63" className="fill-gray-500 text-[3px] dark:fill-gray-300">state now</text>
      <text x="72" y="20" className="fill-gray-500 text-[3px] dark:fill-gray-300">state later</text>
    </svg>
  )
}

function Explanation({ mode, physicsWeight }: { mode: Mode; physicsWeight: number }) {
  const text = {
    constraint: "The model fits observations, but the physics term penalizes curves that violate the expected law.",
    energy: "The dashed shortcut is reward-only search. Stronger physics pressure bends the live path around violations while keeping the same low-loss target.",
    flow: "The arrows are the learned change rule. The black path now follows that rule, so stronger physics pressure visibly redirects the state trajectory.",
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

function makeFlowTrajectory(blend: number) {
  const points: [number, number][] = [[12, 56]]

  for (let index = 0; index < 22; index += 1) {
    const [x, y] = points[index]
    const [dx, dy] = flowAt(x, y, blend)
    points.push([clamp(x + dx * 1.2, 8, 92), clamp(y + dy * 1.2, 8, 62)])
  }

  return points
}

function flowAt(x: number, y: number, blend: number) {
  const dataDx = (32 - x) * 0.06 + Math.sin(y / 8) * 1.35
  const dataDy = (18 - y) * 0.075 + Math.cos(x / 10) * 0.85
  const targetDx = (84 - x) * 0.082
  const targetDy = (25 - y) * 0.082
  const damping = 0.82 + blend * 0.22

  return [
    (dataDx * (1 - blend) + targetDx * blend) * damping,
    (dataDy * (1 - blend) + targetDy * blend) * damping,
  ] as const
}

function toPath(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
}

function toSmoothPath(points: readonly (readonly [number, number])[]) {
  const [start, ...rest] = points
  const path = rest.slice(0, -1).reduce((currentPath, [x, y], index) => {
    const [nextX, nextY] = rest[index + 1]
    const midX = ((x + nextX) / 2).toFixed(1)
    const midY = ((y + nextY) / 2).toFixed(1)
    return `${currentPath} Q ${x.toFixed(1)} ${y.toFixed(1)} ${midX} ${midY}`
  }, `M ${start[0].toFixed(1)} ${start[1].toFixed(1)}`)
  const [endX, endY] = rest[rest.length - 1]

  return `${path} T ${endX.toFixed(1)} ${endY.toFixed(1)}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
