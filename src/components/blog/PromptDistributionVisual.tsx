"use client"

import { useMemo, useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import {
  Annotation,
  ComparisonRows,
  QualitativeRows,
  SegmentedChoice,
  TokenStrip,
} from "@/components/blog/visuals/VisualPrimitives"
import { BarRows } from "@/components/blog/visuals/chart/BarRows"
import { Chart, ChartTable, XAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import { measuredModel, measuredPrompts, showToken } from "@/components/blog/data/measuredLogits"
import { mulberry32, sampleIndex } from "@/lib/viz/rng"
import { linear, formatNumber } from "@/lib/viz/scale"
import {
  effectiveChoices,
  fullEntropyBits,
  probabilityOfLogit,
  topProbabilities,
} from "@/lib/viz/tailSoftmax"

type Wording = "drive" | "ride"
type Fit = "strong" | "plausible" | "weak"

interface PromptScenario {
  id: Wording
  label: string
  tokens: readonly string[]
  changedTokens: readonly string[]
  cues: readonly { label: string; fit: Fit; note: string }[]
  /** Candidate words from the article that are shown even when they are not in the top 8. */
  named: readonly string[]
  lineage: string
  lineageShort: string
}

const steps = [
  { label: "Prompt", shortLabel: "Prompt" },
  { label: "Context cues", shortLabel: "Cues" },
  { label: "Scores", shortLabel: "Scores" },
  { label: "Probabilities", shortLabel: "Odds" },
  { label: "Branch", shortLabel: "Branch" },
] as const

const scenarios: readonly PromptScenario[] = [
  {
    id: "drive",
    label: "drove … in",
    tokens: ["I", "drove", "to", "work", "in", "my"],
    changedTokens: ["drove", "in"],
    cues: [
      { label: "drove", fit: "strong", note: "Activates a motor-vehicle reading." },
      { label: "in my", fit: "strong", note: "Favors something a person sits inside." },
      { label: "to work", fit: "plausible", note: "Supports an ordinary commute." },
    ],
    named: ["vehicle", "bicycle"],
    lineage: "The next state now includes “car,” making vehicle-specific details easier to continue.",
    lineageShort: "vehicle details",
  },
  {
    id: "ride",
    label: "rode … on",
    tokens: ["I", "rode", "to", "work", "on", "my"],
    changedTokens: ["rode", "on"],
    cues: [
      { label: "rode", fit: "strong", note: "Activates a rideable-transport reading." },
      { label: "on my", fit: "strong", note: "Favors something a person sits on." },
      { label: "to work", fit: "plausible", note: "Keeps the commute setting constant." },
    ],
    named: ["car"],
    lineage: "The next state now includes “bicycle,” making cycling-specific details easier to continue.",
    lineageShort: "cycling details",
  },
]

const stepNotes = [
  "Start with the exact sequence the model receives.",
  "Attention and learned transformations make some words more useful for this prediction than others. These labels are a qualitative summary, not measured attention weights.",
  "The final hidden state is scored against every token in the vocabulary. Those scores are logits. Only the differences between them matter.",
  "Softmax turns scores into probabilities. Temperature divides the scores first: low values concentrate the mass, high values push it into the long tail.",
  "One token is chosen and appended. The next prediction starts from a different prefix, so later text can diverge further.",
] as const

const SAMPLES = 24

export default function PromptDistributionVisual() {
  const [step, setStep] = useState(0)
  const [wording, setWording] = useState<Wording>("drive")
  const [temperature, setTemperature] = useState(1)
  const [drawSeed, setDrawSeed] = useState(1)
  const scenario = scenarios.find((item) => item.id === wording) ?? scenarios[0]

  return (
    <ConceptLab
      title="From prompt to branch"
      description="Change only the verb and preposition. These are the model’s real scores for the next word; follow them from scores to probabilities to a chosen token."
      methodology={`Measured scores · ${measuredModel.replace("Qwen/", "")}`}
      steps={steps}
      activeStep={step}
      onStepChange={setStep}
      headerActions={
        <SegmentedChoice
          label="Prompt wording"
          choices={scenarios}
          value={wording}
          onChange={setWording}
        />
      }
      insights={[
        {
          label: "Causal variable",
          body: <>Swap “drove … in” for “rode … on.” The commute and sentence structure stay fixed.</>,
          tone: "intervention",
        },
        { label: "At this step", body: stepNotes[step], tone: "accent" },
      ]}
      caption="Scores, probabilities and the 152k-token tail are measured from Qwen2.5-0.5B-Instruct (fp32, raw text, no chat template) by experiments/llm-nondeterminism/measure_logits.py. Probabilities at temperatures other than 1 are recomputed from those scores. A small model: other models rank the same words differently. The context-cue labels in step 2 are illustrative."
    >
      <div aria-live="polite">
        <Stage
          step={step}
          scenario={scenario}
          temperature={temperature}
          setTemperature={setTemperature}
          drawSeed={drawSeed}
          setDrawSeed={setDrawSeed}
        />
      </div>
    </ConceptLab>
  )
}

function useRows(scenario: PromptScenario) {
  return useMemo(() => {
    const { table, candidates } = measuredPrompts[scenario.id]
    const top = table.top.slice(0, 8).map((t) => ({ token: t.token, logit: t.logit, named: false }))
    const extras = scenario.named
      .map((word) => candidates.find((c) => c.word === word))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .filter((c) => !top.some((t) => t.token === c.first_token))
      .map((c) => ({ token: c.first_token, logit: c.logit, named: true }))
    const rows = [...top, ...extras].sort((a, b) => b.logit - a.logit)
    return { table, rows }
  }, [scenario])
}

function Stage({
  step,
  scenario,
  temperature,
  setTemperature,
  drawSeed,
  setDrawSeed,
}: {
  step: number
  scenario: PromptScenario
  temperature: number
  setTemperature: (value: number) => void
  drawSeed: number
  setDrawSeed: (value: number) => void
}) {
  const { table, rows } = useRows(scenario)
  const promptTokens = scenario.tokens.map((text) => ({
    text,
    tone: scenario.changedTokens.includes(text) ? ("intervention" as const) : ("default" as const),
  }))

  if (step === 0) {
    return (
      <div className="space-y-6">
        <TokenStrip label="Exact prompt prefix" tokens={promptTokens} />
        <p className="max-w-2xl text-sm leading-6 text-[var(--lab-muted)]">
          The model only continues text: its job is to say how likely each possible next token is after “{scenario.tokens.join(" ")}”.
        </p>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <TokenStrip label="Exact prompt prefix" tokens={promptTokens} />
        <QualitativeRows label="Context cues for the blank (illustrative)" rows={scenario.cues} />
      </div>
    )
  }

  const leader = rows[0]
  const runnerUp = rows[1]
  const gap = leader.logit - runnerUp.logit

  if (step === 2) {
    const lo = Math.floor(Math.min(...rows.map((r) => r.logit)) - 1)
    const hi = Math.ceil(leader.logit + 1)
    const rowHeight = 30
    const height = rows.length * rowHeight + 54
    return (
      <div className="space-y-6">
        <TokenStrip label="Prompt context held constant" tokens={promptTokens} />
        <div>
          <p className="lab-kicker">Score for each possible next token (logit)</p>
          <Chart
            label={`Real next-token scores after "${scenario.tokens.join(" ")}". Highest: ${showToken(leader.token)} at ${leader.logit.toFixed(1)}; second: ${showToken(runnerUp.token)} at ${runnerUp.logit.toFixed(1)}; gap ${gap.toFixed(2)}.`}
            height={height}
            margin={{ top: 8, right: 24, bottom: 38, left: 92 }}
          >
            {({ width }) => {
              const sx = linear([lo, hi], [0, width])
              return (
                <>
                  <XAxis scale={sx} y={rows.length * rowHeight} format={(v) => String(v)} label="score (logit): only differences matter" grid gridHeight={rows.length * rowHeight} />
                  {rows.map((row, i) => (
                    <g key={row.token} transform={`translate(0,${i * rowHeight + rowHeight / 2})`}>
                      <line className="viz-grid" x1={0} x2={width} y1={0} y2={0} />
                      <text className={i === 0 ? "viz-text-strong" : "viz-text"} x={-10} dy="0.32em" textAnchor="end">
                        {showToken(row.token)}
                      </text>
                      <circle
                        className={`viz-dot ${i === 0 ? "viz-fill-1" : row.named ? "viz-fill-2" : "viz-fill-muted"}`}
                        cx={sx(row.logit)}
                        cy={0}
                        r={i === 0 ? 6 : 5}
                      />
                      <text className="viz-text" x={sx(row.logit) + 11} dy="0.32em">
                        {row.logit.toFixed(1)}
                      </text>
                    </g>
                  ))}
                </>
              )
            }}
          </Chart>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-[var(--lab-muted)]">
            Blue: highest score. Orange: a word from the article that is not among the eight highest. Scores are shown for the top eight tokens of {table.vocabSize.toLocaleString("en-US")}.
          </p>
        </div>

        <Annotation label="From score gap to odds" tone="intervention">
          “{showToken(leader.token)}” beats “{showToken(runnerUp.token)}” by <strong className="text-[var(--lab-ink)]">{gap.toFixed(2)}</strong> logits, so at temperature 1 it is e<sup>{gap.toFixed(2)}</sup> ≈{" "}
          <strong className="text-[var(--lab-ink)]">{formatNumber(Math.exp(gap), 1)}×</strong> as likely. A gap this size is{" "}
          {gap > 2 ? "decisive." : gap > 0.7 ? "clear but not overwhelming." : "a near tie: small changes could reorder them."}
        </Annotation>
        <ChartTable
          caption="Real next-token scores"
          columns={["Token", "Score (logit)"]}
          rows={rows.map((r) => [showToken(r.token), r.logit.toFixed(3)])}
        />
      </div>
    )
  }

  const probs = topProbabilities(table, temperature)
  const shown = rows.map((row) => {
    const topIndex = table.top.findIndex((t) => t.token === row.token)
    const p = topIndex >= 0 ? probs[topIndex] : probabilityOfLogit(table, row.logit, temperature)
    return { ...row, p }
  })
  const shownMass = shown.reduce((sum, r) => sum + r.p, 0)
  const otherMass = Math.max(0, 1 - shownMass)
  const entropy = fullEntropyBits(table, temperature)
  const choices = effectiveChoices(table, temperature)
  const pct = (v: number) => (v >= 0.1 ? `${(v * 100).toFixed(0)}%` : v >= 0.001 ? `${(v * 100).toFixed(1)}%` : v > 0 ? "<0.1%" : "0%")

  if (step === 3) {
    const rng = mulberry32(drawSeed * 7919 + Math.round(temperature * 100))
    const top64 = topProbabilities(table, temperature)
    const tailMass = Math.max(0, 1 - top64.reduce((a, b) => a + b, 0))
    const draws = Array.from({ length: SAMPLES }, () => {
      const index = sampleIndex(rng, [...top64, tailMass])
      if (index >= table.top.length) return "(other)"
      const token = table.top[index].token
      return rows.some((r) => r.token === token) ? showToken(token) : "(other)"
    })
    return (
      <div className="space-y-6">
        <Slider
          label="Temperature"
          value={temperature}
          min={0}
          max={2}
          step={0.05}
          onChange={setTemperature}
          format={(v) => (v === 0 ? "0 (always the top token)" : v.toFixed(2))}
          hint="Scores are divided by this number before softmax: p ∝ exp(score / T)."
        />

        <p className="sr-only" aria-live="polite">
          At temperature {temperature.toFixed(2)}, “{showToken(leader.token)}” has probability {pct(shown[0].p)}; all tokens outside the list share {pct(otherMass)}.
        </p>

        <div>
          <p className="lab-kicker">Probability of each next token</p>
          <BarRows
            label={`Next-token probabilities at temperature ${temperature.toFixed(2)}`}
            max={1}
            labelWidth="11rem"
            rows={[
              ...shown.map((r, i) => ({
                label: showToken(r.token),
                value: r.p,
                display: pct(r.p),
                series: (i === 0 ? 1 : r.named ? 2 : "ink") as 1 | 2 | "ink",
              })),
              {
                label: `all other tokens (${(table.vocabSize - shown.length).toLocaleString("en-US")})`,
                value: otherMass,
                display: pct(otherMass),
                series: "ink" as const,
              },
            ]}
          />
        </div>

        <dl className="lab-readout">
          <div>
            <dt>Top token</dt>
            <dd>{pct(shown[0].p)}</dd>
          </div>
          <div>
            <dt>Entropy</dt>
            <dd>{entropy.toFixed(2)} bits</dd>
          </div>
          <div>
            <dt>Effective choices</dt>
            <dd>{choices < 10 ? choices.toFixed(1) : Math.round(choices).toLocaleString("en-US")}</dd>
          </div>
        </dl>

        <div>
          <TokenStrip
            label={`${SAMPLES} independent draws at this temperature`}
            tokens={draws.map((text) => ({
              text,
              tone: text === showToken(leader.token) ? ("accent" as const) : text === "(other)" ? ("default" as const) : ("intervention" as const),
            }))}
          />
          <button
            type="button"
            className="mt-3 rounded border border-[var(--lab-rule)] px-3 text-sm font-semibold text-[var(--lab-ink)] hover:bg-[color-mix(in_oklch,var(--lab-ink)_5%,transparent)]"
            onClick={() => setDrawSeed(drawSeed + 1)}
          >
            Draw again
          </button>
        </div>

        <Annotation label="Same shape as a Boltzmann distribution" tone="accent">
          Softmax with temperature is p ∝ exp(−E / T) with energy E = −score. That is the one place the physics analogy is exact. Raise T and the long tail gains mass; at T = 0 only the top token survives.
        </Annotation>

        <ChartTable
          caption="Next-token probabilities at the selected temperature"
          columns={["Token", "Probability"]}
          rows={[...shown.map((r) => [showToken(r.token), `${(r.p * 100).toFixed(2)}%`]), ["all other tokens", `${(otherMass * 100).toFixed(2)}%`]]}
        />
      </div>
    )
  }

  // step 4: the branch, compared across both wordings with greedy choice
  const chosen = showToken(leader.token)
  const drive = measuredPrompts.drive
  const ride = measuredPrompts.ride
  const first = (t: { table: typeof drive.table }) => t.table.top[0]
  const second = (t: { table: typeof drive.table }) => t.table.top[1]
  const p1 = (t: { table: typeof drive.table }) => topProbabilities(t.table, 1)
  return (
    <div className="space-y-6">
      <TokenStrip
        label="Context for the next prediction (greedy choice)"
        tokens={[
          ...scenario.tokens.map((text) => ({ text, tone: "default" as const })),
          { text: chosen, tone: "accent" as const },
        ]}
      />
      <Annotation label="Autoregressive consequence" tone="accent">
        {scenario.lineage}
      </Annotation>
      <ComparisonRows
        rows={[
          { label: "Wording", baseline: "drove … in", changed: "rode … on" },
          {
            label: "Top token (probability)",
            baseline: `${showToken(first(drive).token)} (${pct(p1(drive)[0])})`,
            changed: `${showToken(first(ride).token)} (${pct(p1(ride)[0])})`,
          },
          {
            label: "Runner-up (probability)",
            baseline: `${showToken(second(drive).token)} (${pct(p1(drive)[1])})`,
            changed: `${showToken(second(ride).token)} (${pct(p1(ride)[1])})`,
          },
          { label: "Next lineage", baseline: "vehicle details", changed: "cycling details" },
        ]}
      />
      <p className="max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
        Notice the right-hand case: “{showToken(first(ride).token)}” and “{showToken(second(ride).token)}” are close. Which one is appended depends on the decoding rule and, as the later figure shows, sometimes on numerical noise.
      </p>
    </div>
  )
}
