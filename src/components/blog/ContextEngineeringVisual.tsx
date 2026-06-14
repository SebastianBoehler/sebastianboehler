"use client"

import { useMemo, useState } from "react"

const tasks = [
  {
    label: "repo bugfix",
    prompt: "Fix a failing test in this codebase.",
    loads: [
      ["bootstrap", 100, "#111827"],
      ["repo instructions", 88, "#2563eb"],
      ["debug skill", 76, "#7c3aed"],
      ["test output", 68, "#f59e0b"],
      ["memory", 34, "#059669"],
    ],
    note: "The agent needs the repo contract, the failing signal, and a workflow for debugging.",
  },
  {
    label: "research answer",
    prompt: "Explain the current evidence on a topic.",
    loads: [
      ["bootstrap", 100, "#111827"],
      ["search rules", 84, "#2563eb"],
      ["citation skill", 74, "#7c3aed"],
      ["source notes", 62, "#f59e0b"],
      ["repo files", 16, "#059669"],
    ],
    note: "The agent should route toward source quality, citation discipline, and synthesis.",
  },
  {
    label: "data workflow",
    prompt: "Analyze a CSV and create a chart.",
    loads: [
      ["bootstrap", 100, "#111827"],
      ["spreadsheet skill", 82, "#2563eb"],
      ["plotting skill", 72, "#7c3aed"],
      ["local files", 66, "#f59e0b"],
      ["web search", 10, "#059669"],
    ],
    note: "The agent should load the file workflow and plotting rules, not unrelated web context.",
  },
] as const

export default function ContextEngineeringVisual() {
  const [index, setIndex] = useState(0)
  const active = tasks[index]
  const total = useMemo(() => Math.round(active.loads.reduce((sum, [, value]) => sum + value, 0) / active.loads.length), [active])

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Context is routed in layers</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            The harness starts with a small map, then loads task-specific instructions, skills, memory, tools, and files only when they become relevant.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:w-[25rem]">
          {tasks.map((task, taskIndex) => (
            <button
              key={task.label}
              type="button"
              className={`rounded-md border px-3 py-2 text-sm font-medium ${
                index === taskIndex
                  ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                  : "border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              }`}
              onClick={() => setIndex(taskIndex)}
            >
              {task.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 100 76" role="img" aria-label="Agent context routing diagram" className="h-auto w-full">
            <defs>
              <marker id="context-arrow" markerHeight="5" markerWidth="5" orient="auto" refX="4" refY="2.5">
                <path d="M 0 0 L 5 2.5 L 0 5 z" className="fill-gray-400 dark:fill-gray-500" />
              </marker>
            </defs>
            <rect width="100" height="76" className="fill-gray-50 dark:fill-gray-900" />
            <Node x={12} y={36} label="user task" active />
            <Node x={36} y={18} label="bootstrap" />
            <Node x={36} y={54} label="router" active />
            <Node x={66} y={16} label="skills" />
            <Node x={66} y={36} label="memory" />
            <Node x={66} y={56} label="tools/files" />
            <Node x={89} y={36} label="working context" active />
            <Arrow from={[19, 36]} to={[28, 23]} />
            <Arrow from={[19, 36]} to={[28, 50]} />
            <Arrow from={[44, 54]} to={[58, 18]} />
            <Arrow from={[44, 54]} to={[58, 36]} />
            <Arrow from={[44, 54]} to={[58, 54]} />
            <Arrow from={[73, 16]} to={[82, 32]} />
            <Arrow from={[73, 36]} to={[81, 36]} />
            <Arrow from={[73, 56]} to={[82, 40]} />
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{active.prompt}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{active.note}</p>
          <div className="mt-4 space-y-3">
            {active.loads.map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Average context relevance: <span className="font-semibold text-gray-950 dark:text-white">{total}%</span>
          </p>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. A toy routing view. The percentages are illustrative: they show which context surfaces should become active for each task type.
      </figcaption>
    </figure>
  )
}

function Node({ x, y, label, active = false }: { x: number; y: number; label: string; active?: boolean }) {
  const width = Math.max(16, label.length * 1.45)

  return (
    <g>
      <rect x={x - width / 2} y={y - 6} width={width} height="12" rx="2" fill={active ? "#111827" : "#e5e7eb"} className={active ? "dark:fill-white" : "dark:fill-gray-800"} />
      <text x={x} y={y + 1} textAnchor="middle" className={active ? "fill-white text-[2.3px] dark:fill-gray-950" : "fill-gray-700 text-[2.3px] dark:fill-gray-200"}>{label}</text>
    </g>
  )
}

function Arrow({ from, to }: { from: readonly [number, number]; to: readonly [number, number] }) {
  return (
    <path d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} fill="none" markerEnd="url(#context-arrow)" strokeWidth="1" className="stroke-gray-400 dark:stroke-gray-500" />
  )
}
