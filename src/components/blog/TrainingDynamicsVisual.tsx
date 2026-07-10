"use client"

import { useMemo, useState } from "react"

type Mode = "batch" | "cloud" | "rl"

const modes: { id: Mode; label: string }[] = [
  { id: "batch", label: "batch" },
  { id: "cloud", label: "cloud" },
  { id: "rl", label: "RL" },
]

export default function TrainingDynamicsVisual() {
  const [mode, setMode] = useState<Mode>("batch")
  const [noise, setNoise] = useState(48)
  const heat = noise / 100
  const updateNoise = (value: string) => setNoise(Number(value))

  return (
    <figure className="concept-lab">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Training is drift plus shake</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Full-batch descent is the clean myth. Mini-batches add useful noise, and physics can constrain where learning is allowed to move.
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
          <label htmlFor="sgd-noise" className="w-full text-sm text-gray-600 dark:text-gray-400 sm:w-56">
            <span className="flex justify-between">
              <span>mini-batch heat</span>
              <span>{noise}%</span>
            </span>
            <input
              id="sgd-noise"
              className="mt-2 w-full accent-gray-950 dark:accent-white"
              type="range"
              min="0"
              max="100"
              value={noise}
              onInput={(event) => updateNoise(event.currentTarget.value)}
              onChange={(event) => updateNoise(event.currentTarget.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="lab-stage">
          {mode === "batch" ? <BatchView heat={heat} /> : null}
          {mode === "cloud" ? <CloudView heat={heat} /> : null}
          {mode === "rl" ? <RlView heat={heat} /> : null}
        </div>
        <Explanation mode={mode} noise={noise} />
      </div>

      <figcaption className="lab-caption text-sm leading-6 text-gray-600 dark:text-gray-400">
        Figure 2. A simplified training-dynamics view: gradients create drift, mini-batches create shake, and physical constraints can turn a huge action space into a smaller plausible one.
      </figcaption>
    </figure>
  )
}

function BatchView({ heat }: { heat: number }) {
  const jagged = useMemo(() => makeJaggedPath(heat), [heat])

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Full batch descent compared with noisy mini-batch descent" className="h-auto w-full">
      <defs>
        <marker id="training-arrow-head" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
          <path d="M 0 0 L 5 2.5 L 0 5 z" className="fill-slate-500 dark:fill-slate-300" />
        </marker>
      </defs>
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      {[42, 32, 22, 13, 5].map((radius) => (
        <ellipse key={radius} cx="76" cy="55" rx={radius} ry={radius * 0.45} fill="none" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.8" />
      ))}
      <path d="M 13 13 C 28 20, 44 30, 59 41 S 74 52, 76 55" fill="none" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 2" />
      <path d={jagged} fill="none" stroke="#2563eb" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 72.2 52.6 L 75.2 54.4" fill="none" stroke="#2563eb" strokeWidth="1.9" strokeLinecap="round" markerEnd="url(#training-arrow-head)" />
      <circle cx="13" cy="13" r="2.5" fill="#f59e0b" />
      <circle cx="76" cy="55" r="3" className="fill-gray-950 dark:fill-white" />
      <text x="10" y="9" className="fill-gray-500 text-[3px] dark:fill-gray-300">start</text>
      <text x="70" y="63" className="fill-gray-500 text-[3px] dark:fill-gray-300">low loss</text>
    </svg>
  )
}

function CloudView({ heat }: { heat: number }) {
  const points = useMemo(() => makeCloud(heat), [heat])

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Cloud of SGD states under gradient drift and mini-batch heat" className="h-auto w-full">
      <defs>
        <marker id="cloud-arrow-head" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
          <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#059669" />
        </marker>
      </defs>
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      <path d="M 12 16 C 29 13, 43 20, 55 32 S 74 49, 88 53" fill="none" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="10" strokeLinecap="round" opacity="0.35" />
      {points.map(([x, y, opacity], index) => (
        <circle key={index} cx={x} cy={y} r="1.8" fill="#2563eb" opacity={opacity} />
      ))}
      <path d="M 18 18 L 34 27 M 37 28 L 53 38 M 57 39 L 73 49" stroke="#059669" strokeWidth="1.5" markerEnd="url(#cloud-arrow-head)" />
      <text x="11" y="11" className="fill-gray-500 text-[3px] dark:fill-gray-300">early drift</text>
      <text x="62" y="60" className="fill-gray-500 text-[3px] dark:fill-gray-300">stationary cloud</text>
    </svg>
  )
}

function RlView({ heat }: { heat: number }) {
  const loosePath = `M 11 55 C ${25 + heat * 8} ${13 - heat * 7}, ${42 - heat * 8} ${67}, 58 27 S 80 18, 89 45`

  return (
    <svg viewBox="0 0 100 70" role="img" aria-label="Physics constrained reinforcement learning action space" className="h-auto w-full">
      <rect width="100" height="70" className="fill-gray-50 dark:fill-gray-900" />
      <path d="M 9 47 C 23 38, 35 35, 48 36 S 72 44, 91 31" fill="none" strokeWidth="15" strokeLinecap="round" opacity="0.55" className="stroke-slate-300 dark:stroke-slate-700" />
      <path d={loosePath} fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="3 2" />
      <path d="M 11 55 C 24 45, 35 43, 47 44 S 73 51, 89 40" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="11" cy="55" r="2.5" fill="#f59e0b" />
      <circle cx="89" cy="40" r="2.5" fill="#059669" />
      <text x="10" y="14" className="fill-gray-500 text-[3px] dark:fill-gray-300">unconstrained trial</text>
      <text x="48" y="62" className="fill-gray-500 text-[3px] dark:fill-gray-300">physics corridor</text>
    </svg>
  )
}

function Explanation({ mode, noise }: { mode: Mode; noise: number }) {
  const text = {
    batch: "Full-batch descent points smoothly downhill. Mini-batch SGD uses partial data, so the direction is cheaper but noisy.",
    cloud: "After fast early progress, it can be better to track a cloud of possible states than one exact point.",
    rl: "For physical agents, gravity, joints, motors, and contact rules reduce the number of impossible actions the policy must try.",
  }[mode]

  return (
    <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What to notice</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
      <div className="mt-4 space-y-3 text-sm">
        <Metric label="gradient drift" value={Math.max(16, 100 - Math.round(noise * 0.55))} color="#059669" />
        <Metric label="thermal shake" value={noise} color="#2563eb" />
        <Metric label="constraint help" value={mode === "rl" ? 76 : 42} color="#dc2626" />
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

function makeJaggedPath(heat: number) {
  return Array.from({ length: 11 })
    .map((_, index) => {
      const t = index / 10
      if (index === 10) {
        return "L 72.2 52.6"
      }

      const taper = 1 - t * 0.72
      const x = 13 + t * 59.2 + Math.sin(index * 1.7) * heat * 3.1 * taper
      const y = 13 + t * 39.6 + Math.cos(index * 2.1) * heat * 4.2 * taper
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

function makeCloud(heat: number) {
  return Array.from({ length: 34 }).map((_, index) => {
    const t = index / 33
    const centerX = 16 + t * 68
    const centerY = 18 + t * 35
    const spread = 2 + heat * 8
    return [
      centerX + Math.sin(index * 2.3) * spread,
      centerY + Math.cos(index * 1.9) * spread * 0.7,
      0.35 + t * 0.55,
    ] as const
  })
}
