"use client"

import { useMemo, useState } from "react"
import { ConceptLab, type LabStep } from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  QualitativeRows,
  SegmentedChoice,
  TokenStrip,
  type QualitativeFit,
} from "@/components/blog/visuals/VisualPrimitives"

type InputForm = "table" | "engineered" | "raw"
type SignalShape = "additive" | "thresholds" | "unknown"
type Constraint = "audit" | "baseline" | "representation"
type ModelId = "linear" | "tree" | "forest" | "boosting" | "neural"

const steps: LabStep[] = [
  { label: "Input form", shortLabel: "Input" },
  { label: "Signal shape", shortLabel: "Signal" },
  { label: "Practical constraint", shortLabel: "Constraint" },
]

const inputChoices = [
  { id: "table", label: "Structured table" },
  { id: "engineered", label: "Engineered sequence" },
  { id: "raw", label: "Raw text, image, or audio" },
] as const

const signalChoices = [
  { id: "additive", label: "Mostly additive" },
  { id: "thresholds", label: "Threshold interactions" },
  { id: "unknown", label: "Unknown structure" },
] as const

const constraintChoices = [
  { id: "audit", label: "Easy to audit" },
  { id: "baseline", label: "Strong first baseline" },
  { id: "representation", label: "Learn representations" },
] as const

const models: { id: ModelId; label: string; note: string }[] = [
  {
    id: "linear",
    label: "Linear model",
    note: "Transparent baseline for broad additive effects and calibrated coefficients.",
  },
  {
    id: "tree",
    label: "Single tree",
    note: "Readable interaction prototype; usually brittle as the final model.",
  },
  {
    id: "forest",
    label: "Random forest",
    note: "Stable tree-ensemble baseline when local interactions matter.",
  },
  {
    id: "boosting",
    label: "Boosting / XGBoost",
    note: "High-value contender for structured features, thresholds, and missingness.",
  },
  {
    id: "neural",
    label: "Neural network",
    note: "Natural fit when useful representations must be learned from raw input.",
  },
]

export default function ModelSelectionMapVisual() {
  const [activeStep, setActiveStep] = useState(0)
  const [inputForm, setInputForm] = useState<InputForm>("table")
  const [signalShape, setSignalShape] = useState<SignalShape>("thresholds")
  const [constraint, setConstraint] = useState<Constraint>("baseline")
  const candidates = useMemo(
    () =>
      models.map((model) => ({
        label: model.label,
        fit: fitFor(model.id, inputForm, signalShape, constraint, activeStep),
        note: model.note,
      })),
    [activeStep, constraint, inputForm, signalShape],
  )

  const problemTokens = [
    { text: labelFor(inputChoices, inputForm), tone: "accent" as const },
    ...(activeStep >= 1
      ? [{ text: labelFor(signalChoices, signalShape), tone: "intervention" as const }]
      : []),
    ...(activeStep >= 2 ? [{ text: labelFor(constraintChoices, constraint) }] : []),
  ]

  return (
    <ConceptLab
      title="Choose a model by constraining the problem"
      description="Answer three questions. Each answer changes the qualitative candidate set without pretending that a heuristic is benchmark evidence."
      methodology="qualitative decision notebook"
      steps={steps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      insights={[
        {
          label: "Current read",
          body: summaryFor(inputForm, signalShape, constraint, activeStep),
          tone: "accent",
        },
        {
          label: "Decision boundary",
          body: "A candidate is not a winner. Data volume, target quality, latency, calibration, and held-out performance still decide what survives.",
        },
      ]}
      footer={
        <Annotation label="Next test" tone="intervention">
          Train the simplest viable baseline first, then compare every more flexible model on the same held-out split and operational constraints.
        </Annotation>
      }
      caption="A qualitative model-selection aid. It narrows reasonable starting points; it does not rank algorithms or predict benchmark performance."
    >
      <div className="space-y-8">
        <TokenStrip label="Problem statement so far" tokens={problemTokens} />
        <QuestionStep
          activeStep={activeStep}
          inputForm={inputForm}
          signalShape={signalShape}
          constraint={constraint}
          setInputForm={setInputForm}
          setSignalShape={setSignalShape}
          setConstraint={setConstraint}
        />
        <QualitativeRows label="Candidate set under these assumptions" rows={candidates} />
      </div>
    </ConceptLab>
  )
}

function QuestionStep({
  activeStep,
  inputForm,
  signalShape,
  constraint,
  setInputForm,
  setSignalShape,
  setConstraint,
}: {
  activeStep: number
  inputForm: InputForm
  signalShape: SignalShape
  constraint: Constraint
  setInputForm: (value: InputForm) => void
  setSignalShape: (value: SignalShape) => void
  setConstraint: (value: Constraint) => void
}) {
  const questions = [
    ["What does one example look like?", "Input form determines whether the model can use supplied features or must learn a representation."],
    ["What shape do you expect in the signal?", "This separates broad additive effects from local rules and interactions."],
    ["What must the first useful model optimize for?", "The practical constraint changes which viable family deserves the first experiment."],
  ] as const
  const [question, detail] = questions[activeStep]

  return (
    <section aria-labelledby="model-question" className="border-y border-[rgb(var(--lab-rule))] py-6">
      <p className="lab-kicker">Question {activeStep + 1} of {questions.length}</p>
      <h3 id="model-question" className="mt-2 text-lg font-semibold text-[rgb(var(--lab-ink))]">
        {question}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--lab-muted))]">{detail}</p>
      <div className="mt-5">
        {activeStep === 0 ? (
          <SegmentedChoice label={question} choices={inputChoices} value={inputForm} onChange={setInputForm} />
        ) : null}
        {activeStep === 1 ? (
          <SegmentedChoice label={question} choices={signalChoices} value={signalShape} onChange={setSignalShape} />
        ) : null}
        {activeStep === 2 ? (
          <SegmentedChoice label={question} choices={constraintChoices} value={constraint} onChange={setConstraint} />
        ) : null}
      </div>
    </section>
  )
}

function fitFor(
  model: ModelId,
  input: InputForm,
  signal: SignalShape,
  constraint: Constraint,
  activeStep: number,
): QualitativeFit {
  let fit: QualitativeFit

  if (input === "raw") fit = model === "neural" ? "strong" : "weak"
  else if (model === "forest" || model === "boosting") fit = "strong"
  else if (model === "neural") fit = "plausible"
  else fit = "plausible"

  if (activeStep >= 1 && input !== "raw") {
    if (signal === "additive") fit = model === "linear" ? "strong" : model === "tree" || model === "neural" ? "weak" : "plausible"
    if (signal === "thresholds") fit = model === "forest" || model === "boosting" ? "strong" : model === "linear" ? "weak" : "plausible"
  }

  if (activeStep >= 2) {
    if (constraint === "audit") {
      fit = input === "raw"
        ? model === "neural" ? "plausible" : "weak"
        : model === "linear" ? "strong" : model === "tree" ? "plausible" : "weak"
    }
    if (constraint === "representation") {
      fit = model === "neural" ? "strong" : input === "raw" ? "weak" : "plausible"
    }
  }

  return fit
}

function summaryFor(input: InputForm, signal: SignalShape, constraint: Constraint, activeStep: number) {
  if (activeStep === 0) {
    return input === "raw"
      ? "Raw inputs usually require representation learning before ordinary tabular models become useful."
      : "Supplied features keep transparent and tree-based baselines in play."
  }
  if (activeStep === 1) {
    if (input === "raw") return "The raw input still dominates the choice: learn a representation, then validate the task head."
    return signal === "additive"
      ? "An honest linear baseline can test whether extra flexibility is necessary."
      : signal === "thresholds"
        ? "Tree ensembles are natural contenders because they learn local rules and interactions."
        : "Keep several families alive until held-out evidence reveals the signal shape."
  }
  if (constraint === "audit") {
    return input === "raw"
      ? "This is a real tension: auditability may require engineered features or a separately interpretable representation."
      : "Prefer a transparent first model, even if a more flexible contender remains for comparison."
  }
  if (constraint === "representation") return "Representation learning is the job; neural models deserve the first serious experiment."
  return "Use the strongest simple baseline for this data form, then earn every increase in complexity."
}

function labelFor<T extends string>(choices: readonly { id: T; label: string }[], value: T) {
  return choices.find((choice) => choice.id === value)?.label ?? value
}
