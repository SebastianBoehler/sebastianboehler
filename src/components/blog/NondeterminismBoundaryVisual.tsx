"use client"

import { useMemo, useState } from "react"

const runCount = 42
const start = { x: 49, y: 48 }
const basins = {
  stable: { x: 25, y: 24, color: "#2563eb", label: "same next token" },
  branch: { x: 77, y: 25, color: "#f59e0b", label: "alternate token" },
} as const

export default function NondeterminismBoundaryVisual() {
  const [noise, setNoise] = useState(42)
  const [margin, setMargin] = useState(20)
  const points = useMemo(() => makeRuns(noise, margin), [noise, margin])
  const branched = points.filter((point) => point.branch).length
  const stable = points.length - branched
  const branchRate = Math.round((branched / runCount) * 100)
  const boundary = boundaryFor(margin)

  return (
    <figure className="concept-lab">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Nondeterminism is a boundary effect</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Tiny numeric differences usually stay invisible. They matter most when two next-token choices are almost tied.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Control
            id="nondeterminism-noise"
            label="implementation-level noise"
            value={noise}
            onChange={setNoise}
          />
          <Control
            id="nondeterminism-margin"
            label="separation between top choices"
            value={margin}
            onChange={setMargin}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="lab-stage p-0">
          <svg viewBox="0 0 100 72" role="img" aria-label="Repeated runs near a decision boundary" className="h-auto w-full">
            <rect width="100" height="72" className="fill-gray-50 dark:fill-gray-900" />
            <ellipse cx={basins.stable.x} cy={basins.stable.y} rx="20" ry="12" fill={basins.stable.color} opacity="0.12" />
            <ellipse cx={basins.branch.x} cy={basins.branch.y} rx="18" ry="12" fill={basins.branch.color} opacity="0.16" />
            <path d={`M ${boundary} 10 C ${boundary - 9} 25, ${boundary + 10} 42, ${boundary - 2} 64`} fill="none" strokeWidth="1.4" strokeDasharray="3 3" className="stroke-gray-500 dark:stroke-gray-400" />
            <circle cx={start.x} cy={start.y} r={4 + noise * 0.11} fill="#64748b" opacity="0.08" />
            {points.map((point) => {
              const basin = point.branch ? basins.branch : basins.stable
              return (
                <g key={point.id}>
                  <path
                    d={`M ${point.x.toFixed(1)} ${point.y.toFixed(1)} Q ${(point.x + basin.x) / 2} ${Math.min(point.y, basin.y) - 6}, ${basin.x} ${basin.y}`}
                    fill="none"
                    stroke={basin.color}
                    strokeWidth="0.45"
                    opacity="0.22"
                  />
                  <circle cx={point.x} cy={point.y} r="1.25" fill={basin.color} opacity="0.82" />
                </g>
              )
            })}
            <circle cx={start.x} cy={start.y} r="2.8" fill="#111827" className="dark:fill-white" />
            <circle cx={basins.stable.x} cy={basins.stable.y} r="3" fill={basins.stable.color} />
            <circle cx={basins.branch.x} cy={basins.branch.y} r="3" fill={basins.branch.color} />
            <text x="8" y="12" className="fill-gray-500 text-[3px] dark:fill-gray-300">stable region</text>
            <text x="67" y="12" className="fill-gray-500 text-[3px] dark:fill-gray-300">branch region</text>
            <text x={boundary + 2} y="66" className="fill-gray-500 text-[3px] dark:fill-gray-300">decision boundary</text>
          </svg>
        </div>

        <div className="lab-insight py-1">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What to notice</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            The prompt does not jump anywhere arbitrary. The cloud is small. But if the cloud crosses the dashed boundary, a few runs pick the alternate continuation and then autoregression amplifies the branch.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Readout label="stable runs" value={stable} color={basins.stable.color} />
            <Readout label="branched runs" value={branched} color={basins.branch.color} />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-950 dark:text-white" aria-live="polite">
            In this toy run, {branchRate}% of samples cross the boundary.
          </p>
        </div>
      </div>

      <figcaption className="lab-caption text-sm leading-6 text-gray-600 dark:text-gray-400">
        Figure 4. A toy sketch of inference nondeterminism. The cloud represents tiny implementation-level perturbations; the dashed line represents a near-tie between plausible next tokens.
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
      <input
        id={id}
        className="mt-2 w-full accent-gray-950 dark:accent-white"
        type="range"
        min="0"
        max="100"
        value={value}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  )
}

function Readout({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
      <div className="text-2xl font-semibold text-gray-950 dark:text-white">{value}</div>
      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{label}</div>
      <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

function makeRuns(noise: number, margin: number) {
  const radius = 1.8 + noise * 0.14
  const boundary = boundaryFor(margin)

  return Array.from({ length: runCount }, (_, index) => {
    const angle = index * 2.39996
    const distance = radius * (0.28 + ((index * 37) % 71) / 100)
    const x = start.x + Math.cos(angle) * distance + Math.sin(index * 1.7) * 1.1
    const y = start.y + Math.sin(angle) * distance * 0.75
    return {
      id: index,
      x,
      y,
      branch: x > boundary,
    }
  })
}

function boundaryFor(margin: number) {
  return 49 + margin * 0.16
}
