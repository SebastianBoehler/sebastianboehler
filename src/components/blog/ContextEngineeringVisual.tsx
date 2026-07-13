"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"

type TaskId = "bugfix" | "research" | "data"
type Strategy = "selective" | "preload"
type Route = "always on" | "load now" | "hold back"

const TASKS: readonly {
  id: TaskId
  label: string
  prompt: string
  rationale: string
  sources: readonly { label: string; selective: Route }[]
}[] = [
  {
    id: "bugfix",
    label: "Repo bugfix",
    prompt: "Fix the failing parser test in this repository.",
    rationale: "The agent needs the repository contract, the failure, and the debugging workflow—not citation or plotting guidance.",
    sources: [
      { label: "Core safety rules", selective: "always on" },
      { label: "Repository instructions", selective: "load now" },
      { label: "Failing test output", selective: "load now" },
      { label: "Debugging workflow", selective: "load now" },
      { label: "Citation rules", selective: "hold back" },
      { label: "Plotting workflow", selective: "hold back" },
      { label: "Browser guidance", selective: "hold back" },
    ],
  },
  {
    id: "research",
    label: "Research answer",
    prompt: "Explain the current evidence and cite the primary sources.",
    rationale: "The working context should prioritize search quality, source notes, and citation discipline while leaving repository internals out.",
    sources: [
      { label: "Core safety rules", selective: "always on" },
      { label: "Search guidance", selective: "load now" },
      { label: "Citation workflow", selective: "load now" },
      { label: "Source notes", selective: "load now" },
      { label: "Repository instructions", selective: "hold back" },
      { label: "Plotting workflow", selective: "hold back" },
      { label: "Browser guidance", selective: "hold back" },
    ],
  },
  {
    id: "data",
    label: "Data workflow",
    prompt: "Analyze the supplied CSV and explain the chart.",
    rationale: "Local-file, spreadsheet, and plotting instructions matter now. Web research and repository-specific rules can wait.",
    sources: [
      { label: "Core safety rules", selective: "always on" },
      { label: "Local file contract", selective: "load now" },
      { label: "Spreadsheet workflow", selective: "load now" },
      { label: "Plotting guidance", selective: "load now" },
      { label: "Citation rules", selective: "hold back" },
      { label: "Repository instructions", selective: "hold back" },
      { label: "Browser guidance", selective: "hold back" },
    ],
  },
]

const taskChoices = TASKS.map(({ id, label }) => ({ id, label }))
const strategyChoices = [
  { id: "selective", label: "Route selectively" },
  { id: "preload", label: "Load everything" },
] as const

export default function ContextEngineeringVisual() {
  const [taskId, setTaskId] = useState<TaskId>("bugfix")
  const [strategy, setStrategy] = useState<Strategy>("selective")
  const task = TASKS.find((candidate) => candidate.id === taskId) ?? TASKS[0]
  const heldBack = strategy === "selective" ? task.sources.filter((source) => source.selective === "hold back").length : 0

  return (
    <ConceptLab
      title="Route context to the task"
      description="Keep the catalog fixed. Change the task or loading strategy and watch the working context change."
      methodology="qualitative routing model"
      insights={[
        {
          label: "What changed",
          tone: "intervention",
          body: strategy === "selective" ? "Only task-relevant sources enter working context." : "Every available source is loaded before the task begins.",
        },
        {
          label: "What stayed fixed",
          body: "The source catalog, core safety rules, and user request remain available in both strategies.",
        },
        {
          label: "Takeaway",
          tone: "accent",
          body: "Context engineering is deciding what must be active now—not collecting the largest possible prompt.",
        },
      ]}
      caption="Figure 1. A routing sketch, not a token-budget benchmark. The useful distinction is always active, relevant now, or available later."
    >
      <div className="space-y-7">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <SegmentedChoice label="Choose a task" choices={taskChoices} value={taskId} onChange={setTaskId} />
          <SegmentedChoice label="Choose a loading strategy" choices={strategyChoices} value={strategy} onChange={setStrategy} />
        </div>

        <Annotation label="User task" tone="intervention">
          <p className="font-medium text-[rgb(var(--lab-ink))]">{task.prompt}</p>
          <p className="mt-2">{task.rationale}</p>
        </Annotation>

        <section aria-label="Context routing decision">
          <div className="grid grid-cols-[minmax(0,1fr)_8rem] gap-4 border-y border-[rgb(var(--lab-rule))] py-2 text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-muted))]">
            <span>Context source</span>
            <span>Decision</span>
          </div>
          {task.sources.map((source) => {
            const route = routeFor(source.selective, strategy)
            return (
              <div
                key={source.label}
                className="grid min-h-12 grid-cols-[minmax(0,1fr)_8rem] items-center gap-4 border-b border-[rgb(var(--lab-rule))] text-sm"
              >
                <span className={route === "hold back" ? "text-[rgb(var(--lab-muted))]" : "font-medium"}>{source.label}</span>
                <span className={routeTone(route)}>{route}</span>
              </div>
            )
          })}
        </section>

        <p className="text-sm leading-6 text-[rgb(var(--lab-muted))]" aria-live="polite">
          {strategy === "selective"
            ? `${heldBack} unrelated sources remain discoverable without competing with the active task.`
            : "The task signal now competes with every unrelated instruction in the catalog."}
        </p>
      </div>
    </ConceptLab>
  )
}

function routeFor(route: Route, strategy: Strategy): Route {
  if (strategy === "preload" && route === "hold back") return "load now"
  return route
}

function routeTone(route: Route) {
  if (route === "always on") return "text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-ink))]"
  if (route === "load now") return "text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-accent))]"
  return "text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-muted))]"
}
