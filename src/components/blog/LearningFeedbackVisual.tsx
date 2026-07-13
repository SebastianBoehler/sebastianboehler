"use client"

import { type ReactNode, useMemo, useState } from "react"
import {
  DELAY_CHOICES,
  DELAY_COPY,
  describeLearningPlan,
  FEEDBACK_CHOICES,
  FEEDBACK_COPY,
  RETRIEVAL_CHOICES,
  RETRIEVAL_COPY,
  type Feedback,
  type Retrieval,
  type ReturnDelay,
} from "@/components/blog/learningFeedbackModel"
import {
  ConceptLab,
  type LabInsight,
} from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  SegmentedChoice,
} from "@/components/blog/visuals/VisualPrimitives"

export default function LearningFeedbackVisual() {
  const [retrieval, setRetrieval] = useState<Retrieval>("recall")
  const [feedback, setFeedback] = useState<Feedback>("explain")
  const [returnDelay, setReturnDelay] = useState<ReturnDelay>("two-days")
  const retrievalCopy = RETRIEVAL_COPY[retrieval]
  const feedbackCopy = FEEDBACK_COPY[feedback]
  const delayCopy = DELAY_COPY[returnDelay]
  const plan = useMemo(
    () => describeLearningPlan(retrieval, feedback, returnDelay),
    [feedback, retrieval, returnDelay],
  )
  const insights: LabInsight[] = [
    {
      label: "Retrieval",
      body: retrievalCopy.insight,
      tone: retrieval === "recall" ? "accent" : "default",
    },
    {
      label: "Feedback",
      body: feedbackCopy.insight,
      tone: feedback === "explain" ? "intervention" : "default",
    },
    { label: "Spacing", body: delayCopy.insight },
  ]

  const comparisonRows = [
    {
      label: "What feels easy now?",
      baseline: "The page looks familiar while it is still visible.",
      changed:
        retrieval === "recall"
          ? "Producing an answer reveals what is actually available."
          : "The material becomes more familiar, but retrieval remains untested.",
    },
    {
      label: "What happens to errors?",
      baseline: "No prediction is made, so the gap stays hidden.",
      changed: feedbackCopy.purpose,
    },
    {
      label: "What does the return show?",
      baseline:
        "Forgetting is discovered only when the knowledge is needed later.",
      changed: delayCopy.purpose,
    },
  ]

  return (
    <ConceptLab
      title="Build a learning loop, not a study score"
      description="Choose a first move, a feedback response, and a return interval. The timeline shows what each decision makes observable without pretending to measure memory as a percentage."
      methodology="Qualitative study plan"
      insights={insights}
      caption="A teaching comparison, not a biological memory model. The useful evidence is whether the learner retrieves, receives actionable feedback, repairs the gap, and can retrieve again after a delay."
    >
      <fieldset>
        <legend className="lab-kicker">Plan the next study cycle</legend>
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          <ChoiceGroup label="First move">
            <SegmentedChoice
              label="Choose the first study move"
              choices={RETRIEVAL_CHOICES}
              value={retrieval}
              onChange={setRetrieval}
            />
          </ChoiceGroup>
          <ChoiceGroup label="After the attempt">
            <SegmentedChoice
              label="Choose the feedback type"
              choices={FEEDBACK_CHOICES}
              value={feedback}
              onChange={setFeedback}
            />
          </ChoiceGroup>
          <ChoiceGroup label="Return interval">
            <SegmentedChoice
              label="Choose when to return"
              choices={DELAY_CHOICES}
              value={returnDelay}
              onChange={setReturnDelay}
            />
          </ChoiceGroup>
        </div>
      </fieldset>

      <section className="mt-8">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {plan.label}. {plan.note}
        </p>
        <div className="flex flex-col gap-4 border-y border-[rgb(var(--lab-rule))] py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="lab-kicker">Study timeline</p>
            <h3 className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
              {plan.label}
            </h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-[rgb(var(--lab-muted))]">
            {plan.note}
          </p>
        </div>

        <ol className="divide-y divide-[rgb(var(--lab-rule))]">
          <TimelineStep
            index="01"
            when="Start"
            action="Study one worked example or explanation."
            purpose="Create an initial model of the idea."
          />
          <TimelineStep
            index="02"
            when="Before checking"
            action={retrievalCopy.action}
            purpose={retrievalCopy.purpose}
          />
          <TimelineStep
            index="03"
            when="After the attempt"
            action={feedbackCopy.action}
            purpose={feedbackCopy.purpose}
          />
          <TimelineStep
            index="04"
            when={delayCopy.label}
            action="Attempt the same idea again without looking first."
            purpose={delayCopy.purpose}
          />
        </ol>

        <div className="mt-7">
          <ComparisonRows rows={comparisonRows} />
        </div>

        <div className="mt-6">
          <Annotation label="Best next adjustment" tone={plan.tone}>
            {plan.adjustment}
          </Annotation>
        </div>
      </section>
    </ConceptLab>
  )
}

function ChoiceGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.04em] text-[rgb(var(--lab-muted))]">
        {label}
      </p>
      {children}
    </div>
  )
}

function TimelineStep({
  index,
  when,
  action,
  purpose,
}: {
  index: string
  when: string
  action: string
  purpose: string
}) {
  return (
    <li className="grid gap-2 py-4 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-semibold text-[rgb(var(--lab-accent))]">
        {index}
      </span>
      <strong className="text-sm text-[rgb(var(--lab-ink))]">{when}</strong>
      <span>
        <span className="block text-sm font-medium text-[rgb(var(--lab-ink))]">
          {action}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[rgb(var(--lab-muted))]">
          {purpose}
        </span>
      </span>
    </li>
  )
}
