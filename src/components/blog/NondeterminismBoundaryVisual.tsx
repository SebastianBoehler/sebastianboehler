"use client"

import { useMemo, useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import {
  measuredGeneration,
  measuredModel,
  measuredNoise,
  measuredPrompts,
  showToken,
} from "@/components/blog/data/measuredLogits"
import {
  decide,
  divergenceCurve,
  flipProbability,
  makeRunDraws,
  samplingRunnerUpProbability,
  stepReaching,
} from "@/lib/viz/logitNoise"
import { mulberry32 } from "@/lib/viz/rng"
import { areaPath, formatNumber, linear, linePath } from "@/lib/viz/scale"

const steps = [
  { label: "One decision", shortLabel: "Decision" },
  { label: "A whole answer", shortLabel: "Answer" },
] as const

const RUNS = 100
const drive = measuredPrompts.drive.table.top
const ride = measuredPrompts.ride.table.top
const nearTie = [...measuredGeneration.nearTies].sort((a, b) => a.gap - b.gap)[4]
const PRESETS = [
  {
    id: "clear",
    label: `car vs ${showToken(drive[1].token)}`,
    gap: drive[0].logit - drive[1].logit,
    detail: "“I drove to work in my …”",
  },
  {
    id: "close",
    label: `${showToken(ride[0].token)} vs ${showToken(ride[1].token)}`,
    gap: ride[0].logit - ride[1].logit,
    detail: "“I rode to work on my …”: a real 43% vs 29% call, yet still far from reversible at this noise.",
  },
  {
    id: "tie",
    label: `${showToken(nearTie.leader)} vs ${showToken(nearTie.runner_up)}`,
    gap: nearTie.gap,
    detail: `a near tie from the generated answer, token ${nearTie.step}: “…${nearTie.context.replace(/\n/g, " ").trim()}”.`,
  },
] as const

type PresetId = (typeof PRESETS)[number]["id"]

export default function NondeterminismBoundaryVisual() {
  const [step, setStep] = useState(0)
  const [preset, setPreset] = useState<PresetId>("tie")
  const [gap, setGap] = useState<number>(PRESETS[2].gap)
  const [sigma, setSigma] = useState(Math.round(measuredNoise.logitStd * 100) / 100)
  const [temperature, setTemperature] = useState(0)
  const [seed, setSeed] = useState(1)

  const selectPreset = (id: PresetId) => {
    setPreset(id)
    setGap(PRESETS.find((p) => p.id === id)?.gap ?? gap)
  }

  return (
    <ConceptLab
      title="A tiny perturbation needs a near tie to become visible"
      description="Numerical noise only matters where two top tokens are almost level. Test one decision, then see how often a real answer contains such a decision."
      methodology={`Monte Carlo on measured scores · ${measuredModel.replace("Qwen/", "")}`}
      steps={steps}
      activeStep={step}
      onStepChange={setStep}
      insights={[
        {
          label: "Held constant",
          body: "The prompt, the model weights and the size of the numerical perturbation. Only the gap between the two leading scores (and, in step 1, the temperature) changes.",
        },
        {
          label: step === 0 ? "Manipulation" : "Reading the plot",
          tone: "intervention",
          body:
            step === 0
              ? "Gap and noise are in logit units, the same units as the scores in the previous figure. Each of 100 executions adds its own random noise to both scores."
              : "Each dot is one position in a real greedy answer. Orange dots have a gap smaller than the noise scale, so a perturbation can reverse them. The curve shows the chance an execution has already left the greedy path.",
        },
        {
          label: "Where the noise size comes from",
          body: `Measured here: running the same tokens in bf16 instead of fp32 shifts the leading logits by about ${measuredNoise.logitStd.toFixed(2)} (standard deviation, 99th percentile ${measuredNoise.logitP99.toFixed(2)}). That is reduced-precision noise. On this CPU, batch size 1 and batch size 7 gave bit-identical results, so batch-dependent kernels were not the source here; on GPU serving stacks they can be.`,
        },
      ]}
      caption={`Scores and gaps are measured from ${measuredModel} (fp32 greedy decoding, one prompt). The noise is simulated as independent Gaussian perturbations on the two leading logits with the standard deviation you choose; real serving noise is not exactly Gaussian. Step 2 uses an exact hazard model (a run is on the greedy path until its first reversed decision) but it is an upper bound: it draws fresh independent noise at every step of every execution, while a real server cycles through a limited set of batch configurations, so many executions repeat each other exactly.`}
    >
      <div className="space-y-8" aria-live="polite">
        {step === 0 ? (
          <DecisionStep
            preset={preset}
            selectPreset={selectPreset}
            gap={gap}
            setGap={(v) => {
              setGap(v)
            }}
            sigma={sigma}
            setSigma={setSigma}
            temperature={temperature}
            setTemperature={setTemperature}
            seed={seed}
            setSeed={setSeed}
          />
        ) : (
          <AnswerStep sigma={sigma} setSigma={setSigma} />
        )}
      </div>
    </ConceptLab>
  )
}

function DecisionStep({
  preset,
  selectPreset,
  gap,
  setGap,
  sigma,
  setSigma,
  temperature,
  setTemperature,
  seed,
  setSeed,
}: {
  preset: PresetId
  selectPreset: (id: PresetId) => void
  gap: number
  setGap: (v: number) => void
  sigma: number
  setSigma: (v: number) => void
  temperature: number
  setTemperature: (v: number) => void
  seed: number
  setSeed: (v: number) => void
}) {
  const draws = useMemo(() => makeRunDraws(mulberry32(seed * 104729), RUNS), [seed])
  const outcomes = draws.map((d) => decide(d, gap, sigma, temperature))
  const flips = outcomes.filter((o) => o === 1).length
  const expected =
    temperature <= 1e-6 ? flipProbability(gap, sigma) : samplingRunnerUpProbability(gap, temperature)
  const active = PRESETS.find((p) => p.id === preset)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="lab-kicker">Start from a real decision</p>
            <div className="mt-2">
              <SegmentedChoice label="Real decision" choices={PRESETS} value={preset} onChange={selectPreset} />
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--lab-muted)]">
              {active?.detail} Gap {formatNumber(active?.gap ?? 0, 3)} logits, measured.
            </p>
          </div>
          <Slider
            label="Gap between top two scores"
            value={gap}
            min={0}
            max={3}
            step={0.01}
            onChange={setGap}
            format={(v) => `${v.toFixed(2)} logits`}
          />
        </div>
        <div className="space-y-2">
          <Slider
            label="Numerical noise (std. dev.)"
            value={sigma}
            min={0}
            max={0.3}
            step={0.005}
            onChange={setSigma}
            format={(v) => `${v.toFixed(3)} logits`}
            hint={`Measured bf16 vs fp32 on this model: ≈${measuredNoise.logitStd.toFixed(2)}.`}
          />
          <Slider
            label="Sampling temperature"
            value={temperature}
            min={0}
            max={1}
            step={0.05}
            onChange={setTemperature}
            format={(v) => (v === 0 ? "0 (greedy)" : v.toFixed(2))}
            hint="At 0 the only randomness is numerical. Above 0, sampling is the main source."
          />
        </div>
      </div>

      <div>
        <p className="lab-kicker">{RUNS} executions of the same prompt</p>
        <Legend
          items={[
            { label: "Emits the leading token", series: 1, kind: "dot" },
            { label: "Emits the runner-up", series: 2, kind: "dot" },
          ]}
        />
        <div
          role="img"
          aria-label={`${RUNS} executions: ${RUNS - flips} emit the leading token and ${flips} emit the runner-up.`}
          className="mt-3 grid max-w-xl gap-1.5"
          style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
        >
          {outcomes.map((outcome, i) => (
            <span
              key={i}
              className={`block aspect-square rounded-full ${outcome === 1 ? "bg-[var(--viz-2)]" : "bg-[var(--viz-1)]"}`}
              style={{ opacity: outcome === 1 ? 1 : 0.55 }}
            />
          ))}
        </div>
      </div>

      <dl className="lab-readout">
        <div>
          <dt>Runner-up emitted</dt>
          <dd>
            {flips} of {RUNS}
          </dd>
        </div>
        <div>
          <dt>{temperature <= 1e-6 ? "Predicted (noise only)" : "Predicted (sampling only)"}</dt>
          <dd>{(expected * 100).toFixed(1)}%</dd>
        </div>
        <div>
          <dt>Odds of the leader</dt>
          <dd>{formatNumber(Math.exp(gap), 1)}×</dd>
        </div>
      </dl>

      <button
        type="button"
        className="rounded border border-[var(--lab-rule)] px-3 text-sm font-semibold text-[var(--lab-ink)] hover:bg-[color-mix(in_oklch,var(--lab-ink)_5%,transparent)]"
        onClick={() => setSeed(seed + 1)}
      >
        Run 100 new executions
      </button>

      <FlipCurve gap={gap} sigma={sigma} />

      <Annotation label="What to notice" tone="accent">
        {temperature <= 1e-6
          ? gap > 4 * sigma
            ? "With a clear gap, the leader wins in every execution: the noise is too small to reorder the scores."
            : "The gap is within a few noise-widths, so some executions reverse the order. That is a decision boundary being crossed, not randomness in the model."
          : "At a temperature above zero the sampler itself picks the runner-up often. Numerical noise is then a small extra on top of a much larger intentional randomness."}
      </Annotation>
    </>
  )
}

function FlipCurve({ gap, sigma }: { gap: number; sigma: number }) {
  const grid = Array.from({ length: 61 }, (_, i) => i * 0.05)
  const rows = grid.filter((_, i) => i % 6 === 0).map((g) => [g.toFixed(2), `${(flipProbability(g, sigma) * 100).toFixed(2)}%`])
  const current = flipProbability(gap, sigma)
  return (
    <div>
      <p className="lab-kicker">Chance numerical noise alone reverses a greedy choice</p>
      <Chart
        label={`Reversal probability against score gap for noise ${sigma.toFixed(3)}. At the current gap ${gap.toFixed(2)} it is ${(current * 100).toFixed(1)} percent.`}
        height={210}
        margin={{ top: 10, right: 20, bottom: 38, left: 52 }}
      >
        {({ width, height }) => {
          const sx = linear([0, 3], [0, width])
          const sy = linear([0, 0.5], [height, 0])
          const pts = grid.map((g) => [sx(g), sy(flipProbability(g, sigma))] as const)
          return (
            <>
              <YAxis scale={sy} ticks={[0, 0.25, 0.5]} format={(v) => `${v * 100}%`} grid gridWidth={width} label="reversed" />
              <XAxis scale={sx} y={height} ticks={[0, 1, 2, 3]} label="gap between the top two scores (logits)" />
              <path className="viz-wash viz-fill-1" d={areaPath(pts, height)} />
              <path className="viz-line viz-stroke-1" d={linePath(pts)} />
              <circle className="viz-dot viz-fill-2" cx={sx(gap)} cy={sy(current)} r={6} />
              <text className="viz-text-strong" x={Math.min(sx(gap) + 12, width - 90)} y={sy(current) - 12}>
                {(current * 100).toFixed(1)}% here
              </text>
            </>
          )
        }}
      </Chart>
      <ChartTable caption="Reversal probability by score gap" columns={["Gap (logits)", "Chance of reversal"]} rows={rows} />
    </div>
  )
}

function AnswerStep({ sigma, setSigma }: { sigma: number; setSigma: (v: number) => void }) {
  const gaps = measuredGeneration.gaps
  const curve = useMemo(() => divergenceCurve(gaps, sigma), [gaps, sigma])
  const noiseScale = sigma * Math.SQRT2
  const nearCount = gaps.filter((g) => g < noiseScale).length
  const half = stepReaching(curve, 0.5)
  const end = curve[curve.length - 1] ?? 0
  const closest = [...measuredGeneration.nearTies].sort((a, b) => a.gap - b.gap).slice(0, 5)

  return (
    <>
      <Slider
        label="Numerical noise (std. dev.)"
        value={sigma}
        min={0}
        max={0.3}
        step={0.005}
        onChange={setSigma}
        format={(v) => `${v.toFixed(3)} logits`}
        hint={`Measured bf16 vs fp32: ≈${measuredNoise.logitStd.toFixed(2)}. At 0 nothing can ever differ.`}
      />

      <dl className="lab-readout">
        <div>
          <dt>Decisions in the answer</dt>
          <dd>{gaps.length}</dd>
        </div>
        <div>
          <dt>Near ties at this noise</dt>
          <dd>{nearCount}</dd>
        </div>
        <div>
          <dt>Differs by the end (upper bound)</dt>
          <dd>{(end * 100).toFixed(0)}%</dd>
        </div>
        <div>
          <dt>Half have diverged by</dt>
          <dd>{half ? `token ${half}` : "never"}</dd>
        </div>
      </dl>

      <div>
        <p className="lab-kicker">Gap between the top two scores at every step of a real answer</p>
        <Chart
          label={`Top-two score gap at each of ${gaps.length} steps of a greedy answer, on a log axis. ${nearCount} steps have a gap smaller than the noise scale ${noiseScale.toFixed(2)}.`}
          height={230}
          margin={{ top: 10, right: 20, bottom: 38, left: 52 }}
        >
          {({ width, height }) => {
            const sx = linear([0, gaps.length], [0, width])
            const sy = linear([-3, 1], [height, 0])
            const logGap = (g: number) => Math.log10(Math.max(g, 1e-3))
            const decades = [-3, -2, -1, 0, 1]
            return (
              <>
                <YAxis
                  scale={sy}
                  ticks={decades}
                  format={(v) => formatNumber(10 ** v, 3)}
                  grid
                  gridWidth={width}
                  label="gap (logits, log scale)"
                />
                <XAxis scale={sx} y={height} ticks={[0, 60, 120, 180, 240]} label="token position in the answer" />
                {sigma > 0 ? (
                  <>
                    <rect x={0} width={width} y={sy(logGap(noiseScale))} height={height - sy(logGap(noiseScale))} className="viz-fill-2 viz-wash" />
                    <text className="viz-text" x={width - 4} y={sy(logGap(noiseScale)) - 6} textAnchor="end">
                      noise scale: gaps below this can reverse
                    </text>
                  </>
                ) : null}
                {gaps.map((g, i) => (
                  <circle
                    key={i}
                    className={`viz-dot ${g < noiseScale && sigma > 0 ? "viz-fill-2" : "viz-fill-muted"}`}
                    cx={sx(i + 1)}
                    cy={sy(logGap(g))}
                    r={g < noiseScale && sigma > 0 ? 4 : 3}
                    fillOpacity={g < noiseScale && sigma > 0 ? 1 : 0.55}
                  />
                ))}
              </>
            )
          }}
        </Chart>
      </div>

      <div>
        <p className="lab-kicker">Chance an execution has left the greedy path by this token</p>
        <Chart
          label={`Cumulative probability that a run has diverged from the noiseless greedy answer, reaching ${(end * 100).toFixed(0)} percent by the end for noise ${sigma.toFixed(3)}.`}
          height={190}
          margin={{ top: 10, right: 20, bottom: 38, left: 52 }}
        >
          {({ width, height }) => {
            const sx = linear([0, gaps.length], [0, width])
            const sy = linear([0, 1], [height, 0])
            const pts = curve.map((p, i) => [sx(i + 1), sy(p)] as const)
            return (
              <>
                <YAxis scale={sy} ticks={[0, 0.5, 1]} format={(v) => `${v * 100}%`} grid gridWidth={width} label="diverged" />
                <XAxis scale={sx} y={height} ticks={[0, 60, 120, 180, 240]} label="token position" />
                <path className="viz-wash viz-fill-1" d={areaPath(pts, height)} />
                <path className="viz-line viz-stroke-1" d={linePath(pts)} />
              </>
            )
          }}
        </Chart>
      </div>

      <div>
        <p className="lab-kicker">The closest calls in this answer</p>
        <ul className="mt-2 divide-y divide-[var(--lab-rule)] border-y border-[var(--lab-rule)] text-sm">
          {closest.map((tie) => (
            <li key={tie.step} className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr_5rem] sm:gap-4">
              <span className="font-semibold text-[var(--lab-ink)]">token {tie.step}</span>
              <span className="text-[var(--lab-muted)]">
                … {tie.context.replace(/\n/g, " ").trim()} <strong className="text-[var(--lab-ink)]">[{showToken(tie.leader)}</strong> vs <strong className="text-[var(--lab-ink)]">{showToken(tie.runner_up)}]</strong>
              </span>
              <span className="tabular-nums text-[var(--lab-muted)]">gap {tie.gap.toFixed(3)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Annotation label="Real-world anchor" tone="accent">
        Thinking Machines Lab sampled 1,000 completions at temperature 0 from Qwen3-235B-A22B-Instruct-2507 for the prompt “Tell me about Richard Feynman”: 80 were unique. All 1,000 were identical for the first 102 tokens, then 992 continued “Queens, New York” and 8 “New York City” at token 103. With batch-invariant kernels all 1,000 were identical. A small per-step chance of reversal, repeated over many steps, is enough to produce divergence. But real outputs cluster far more than the independent-noise model above: the single most common completion occurred 78 times.
      </Annotation>

      <ChartTable
        caption="Top-two score gap and cumulative divergence probability by token position"
        columns={["Token", "Gap (logits)", "Diverged by here"]}
        rows={gaps.map((g, i) => [i + 1, g.toFixed(3), `${((curve[i] ?? 0) * 100).toFixed(1)}%`]).filter((_, i) => i % 12 === 0)}
        summary="View every 12th step as a table"
      />
    </>
  )
}
