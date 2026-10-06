"use client"

import { useId, useMemo, useState } from "react"
import { ConceptLab, type LabInsight } from "@/components/blog/visuals/ConceptLab"
import { SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import { clamp, formatNumber, linePath, linear } from "@/lib/viz/scale"
import {
  BATCH_SIZES,
  LEARNING_RATES,
  N_EXAMPLES,
  N_RUNS,
  START,
  contourPoints,
  covarianceEllipse,
  getProblem,
  predictSpread,
  runEnsemble,
  runGd,
  stabilityLimit,
  type Problem,
  type Schedule,
} from "@/lib/viz/sgdDynamics"

type BatchId = `${(typeof BATCH_SIZES)[number]}`
type ViewId = "whole" | "zoom"
type CloudId = "show" | "hide"

const BATCH_CHOICES = BATCH_SIZES.map((b) => ({ id: String(b) as BatchId, label: String(b) }))
const SCHEDULE_CHOICES = [
  { id: "constant", label: "Constant" },
  { id: "cosine", label: "Cosine decay to 0" },
] as const
const VIEW_CHOICES = [
  { id: "whole", label: "Whole path" },
  { id: "zoom", label: "Zoom on optimum" },
] as const
const CLOUD_CHOICES = [
  { id: "show", label: "Show" },
  { id: "hide", label: "Hide" },
] as const

const DEFAULT_ETA_INDEX = LEARNING_RATES.indexOf(0.1)
const FLOOR_EXPONENT = -6

/** Contour levels are values of L - L_min; each is 4x the previous one. */
const LEVELS = {
  whole: [0.05, 0.2, 0.8, 3.2, 12.8, 51.2],
  zoom: [0.002, 0.008, 0.032, 0.128, 0.512, 2.048],
}

export default function TrainingDynamicsVisual() {
  const problem = getProblem()
  const [batch, setBatch] = useState<BatchId>("4")
  const [etaIndex, setEtaIndex] = useState(DEFAULT_ETA_INDEX)
  const [steps, setSteps] = useState(300)
  const [momentum, setMomentum] = useState(0)
  const [schedule, setSchedule] = useState<Schedule>("constant")
  const [seed, setSeed] = useState(1)
  const [view, setView] = useState<ViewId>("whole")
  const [cloud, setCloud] = useState<CloudId>("show")

  const eta = LEARNING_RATES[etaIndex]
  const batchSize = Number(batch)

  const sim = useMemo(() => {
    const options = { eta, batch: batchSize, steps, momentum, schedule, seed }
    const ensemble = runEnsemble(problem, options, N_RUNS)
    const gd = runGd(problem, { eta, steps, momentum, schedule })
    const prediction = predictSpread(problem, { eta, batch: batchSize, steps, momentum, schedule })
    return { ensemble, gd, prediction }
  }, [problem, eta, batchSize, steps, momentum, schedule, seed])

  const { ensemble, gd, prediction } = sim
  const limit = stabilityLimit(problem, momentum)
  const gdDiverged = gd.diverged
  const sgdDivergedRuns = ensemble.divergedCount
  const anyDiverged = gdDiverged || sgdDivergedRuns > 0
  const noiseGrowth = (eta * (problem.hessian[0] + problem.hessian[2])) / (2 * batchSize)
  const theoryStrained = prediction !== null && noiseGrowth > 0.15

  const sgdExcess = ensemble.first.excess[steps]
  const gdExcess = gd.excess[steps]

  const status = gdDiverged
    ? `Diverges at this η: ${formatNumber(eta, 3)} is above the full-batch stability limit 2(1 + β)/λmax = ${formatNumber(limit, 2)}, so even exact gradients overshoot more each step.`
    : sgdDivergedRuns > 0
      ? `SGD diverges in ${sgdDivergedRuns} of ${N_RUNS} runs at this η and batch size, although full-batch gradient descent is stable. The noise adds to the overshoot, so tiny batches have a lower stability limit than ${formatNumber(limit, 2)}.`
      : null

  const liveSummary = status
    ? status
    : `Batch size ${batchSize}, learning rate ${formatNumber(eta, 3)}, ${steps} steps, momentum ${formatNumber(momentum, 2)}, ${schedule === "cosine" ? "cosine decay" : "constant"} schedule. ` +
      `SGD ends with excess loss ${fmt(sgdExcess)}; full-batch gradient descent ends with ${fmt(gdExcess)}. ` +
      `The ${N_RUNS} end points lie at an RMS distance ${fmt(ensemble.rmsSpread)} from the optimum` +
      (prediction ? `; the small-step theory predicts ${fmt(prediction.rms)}.` : ".")

  const insights: LabInsight[] = [
    {
      label: "Downhill drift",
      body: (
        <>
          The average of the per-example gradients is the full-batch gradient. The blue path follows it on average:
          compare it with the thin ink path, which uses exact gradients and the same learning rate.
        </>
      ),
      tone: "accent",
    },
    {
      label: "Batch noise",
      body: (
        <>
          Each step uses a different small sample, so the step direction jitters. The jitter shrinks as batch size
          grows (∝ 1/√B), and its effect on the final position grows with the learning rate. At B = {N_EXAMPLES} every
          step uses all examples and the jitter is exactly zero.
        </>
      ),
      tone: "intervention",
    },
    {
      label: "Temperature",
      body: (
        <>
          The size of the stationary noise ball scales like √(η/B), so learning rate and batch size trade off. Now: η/B ={" "}
          {fmt(eta / batchSize)}
          {prediction && !theoryStrained ? ` → predicted radius ${fmt(prediction.rms)}.` : "."}
        </>
      ),
    },
    {
      label: "Annealing",
      body: (
        <>
          Decaying η toward 0 lowers that temperature, so the ball shrinks and training settles. This is why practical
          schedules end with a small learning rate.
        </>
      ),
    },
    {
      label: "Not a thermal ball",
      body: (
        <>
          SGD noise is not isotropic thermal noise: its covariance is shaped by the data. Here that makes the cloud
          rounder than the valley, where thermal noise at the same temperature would stretch it about 3:1 along the
          valley. “Temperature” is an analogy with limits (Mandt et al. 2017; Smith &amp; Le 2018).
        </>
      ),
    },
  ]

  return (
    <ConceptLab
      title="Drift plus shake: what SGD does near a minimum"
      description="Every number here comes from running SGD on a small regression problem. Change batch size, learning rate and schedule, and watch the blue path, the cloud of 40 independent end points and the loss."
      methodology="Toy model · exact gradients · computed live"
      insights={insights}
      caption={
        <>
          Linear regression with two parameters on {N_EXAMPLES} synthetic examples, so the loss is an exact quadratic
          and the contours are exact ellipses. Because it is convex, there is one minimum; real deep-network landscapes
          are non-convex, so what carries over is the drift-plus-noise decomposition, not this geometry. “Predicted”
          uses the small-step stationary covariance of SGD (Mandt et al. 2017; Smith &amp; Le 2018) and holds for β = 0
          only. Mini-batches are drawn without replacement at every step; the 40 runs use different seeds.
        </>
      }
    >
      <section className="space-y-6">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {liveSummary}
        </p>

        <div className="space-y-3 [&_.lab-segmented_button]:whitespace-nowrap">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <p className="lab-kicker mb-1.5">Batch size (256 = full batch)</p>
              <SegmentedChoice label="Batch size" choices={BATCH_CHOICES} value={batch} onChange={setBatch} />
            </div>
            <div>
              <p className="lab-kicker mb-1.5">Learning-rate schedule</p>
              <SegmentedChoice
                label="Learning-rate schedule"
                choices={SCHEDULE_CHOICES}
                value={schedule}
                onChange={setSchedule}
              />
            </div>
          </div>
          <div className="lab-controls" style={{ alignItems: "end" }}>
            <Slider
              label="Learning rate"
              value={etaIndex}
              min={0}
              max={LEARNING_RATES.length - 1}
              onChange={setEtaIndex}
              format={(i) => formatNumber(LEARNING_RATES[i], 3)}
              hint={`Stability limit for exact gradients: ${formatNumber(limit, 2)}`}
            />
            <div>
              <button
                type="button"
                className="rounded border border-[var(--lab-rule)] px-3 text-sm font-medium text-[var(--lab-ink)]"
                onClick={() => setSeed((s) => s + 1)}
              >
                New seed ({seed})
              </button>
              <p className="mt-1 text-xs leading-5 text-[var(--lab-muted)]">Draws different mini-batches.</p>
            </div>
          </div>
          <details className="border-t border-[var(--lab-rule)]">
            <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-semibold text-[var(--lab-muted)]">
              More settings: momentum, number of steps
            </summary>
            <div className="lab-controls pb-2">
              <Slider
                label="Momentum"
                value={momentum}
                min={0}
                max={0.95}
                step={0.05}
                onChange={setMomentum}
                format={(v) => formatNumber(v, 2)}
                hint="Heavy-ball momentum; widens the stability limit."
              />
              <Slider label="Steps" value={steps} min={50} max={600} step={50} onChange={setSteps} />
            </div>
          </details>
        </div>

        {status ? (
          <p
            role="status"
            className="rounded border border-[var(--lab-intervention)] px-3 py-2 text-sm leading-6 text-[var(--lab-ink)]"
          >
            {status}
          </p>
        ) : null}

        <div className="space-y-2 [&_.lab-segmented_button]:whitespace-nowrap">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            <div>
              <p className="lab-kicker mb-1.5">View</p>
              <SegmentedChoice label="Parameter-space view" choices={VIEW_CHOICES} value={view} onChange={setView} />
            </div>
            <div>
              <p className="lab-kicker mb-1.5">{N_RUNS} runs’ end points</p>
              <SegmentedChoice
                label={`Show end points of ${N_RUNS} independent runs`}
                choices={CLOUD_CHOICES}
                value={cloud}
                onChange={setCloud}
              />
            </div>
          </div>
          <Chart
            label={chartALabel({ problem, sim, steps, view, cloud, anyDiverged })}
            height={340}
            margin={{ top: 10, right: 14, bottom: 38, left: 44 }}
          >
            {(inner) => (
              <ParameterSpace
                problem={problem}
                inner={inner}
                view={view}
                showCloud={cloud === "show"}
                sim={sim}
                gdDiverged={gdDiverged}
                anyDiverged={anyDiverged}
              />
            )}
          </Chart>
          <div className="mt-2">
            <Legend
              items={[
                { label: "SGD path", series: 1, kind: "line" },
                { label: "Full-batch GD (same η)", series: "ink", kind: "line" },
                { label: `End points of ${N_RUNS} runs`, series: 2, kind: "dot" },
                { label: "Predicted 2σ ball", series: "muted", kind: "dash" },
              ]}
            />
            <p className="mt-1 text-xs leading-5 text-[var(--lab-muted)]">
              Hairline ellipses are contours of the loss above its minimum (each 4× the previous, labelled on two).
            </p>
          </div>
        </div>

        <div>
          <Chart
            label={`Excess loss L − L_min against step on a log axis. SGD ends at ${fmt(sgdExcess)} and full-batch gradient descent at ${fmt(gdExcess)}${prediction ? `; the theory expects ${fmt(prediction.excess[steps])}` : ""}.`}
            height={180}
            margin={{ top: 10, right: 70, bottom: 38, left: 52 }}
          >
            {(inner) => <LossChart inner={inner} steps={steps} sim={sim} />}
          </Chart>
          <div className="mt-2">
            <Legend
              items={[
                { label: "SGD (the run drawn above)", series: 1, kind: "line" },
                { label: "Full-batch GD", series: "ink", kind: "line" },
                ...(prediction ? [{ label: "Theory: expected loss", series: "muted" as const, kind: "dash" as const }] : []),
              ]}
            />
          </div>
        </div>

        <dl className="lab-readout">
          <div>
            <dt>SGD final excess loss</dt>
            <dd>{sgdDivergedRuns > 0 || gdDiverged ? "—" : fmt(sgdExcess)}</dd>
          </div>
          <div>
            <dt>Full-batch GD final</dt>
            <dd>{gdDiverged ? "—" : fmt(gdExcess)}</dd>
          </div>
          <div>
            <dt>Spread: measured</dt>
            <dd>{anyDiverged ? "—" : fmt(ensemble.rmsSpread)}</dd>
          </div>
          <div>
            <dt>Spread: predicted</dt>
            <dd>{prediction && !anyDiverged ? fmt(prediction.rms) : "—"}</dd>
          </div>
          <div>
            <dt>Rate ÷ batch size{schedule === "cosine" ? " (start)" : ""}</dt>
            <dd>{fmt(eta / batchSize)}</dd>
          </div>
        </dl>
        <p className="text-xs leading-5 text-[var(--lab-muted)]">
          Spread is the RMS distance from the {N_RUNS} end points to the optimum. “Predicted” propagates the mini-batch
          gradient covariance at the optimum through the update, step by step. In the small-step limit the stationary
          covariance S solves HS + SH = (η/B)C, with H the loss curvature and C the per-example gradient covariance.{" "}
          {anyDiverged
            ? ""
            : momentum > 0
            ? "With momentum this theory does not apply, so the prediction shows “—”."
            : theoryStrained
              ? "At this η/B the noise itself grows away from the optimum, which the theory ignores, so it under-predicts."
              : "It applies for β = 0 with a constant or decaying η."}{" "}
          Runs with a small η × steps have not finished converging, and the prediction includes the distance left to
          travel. Loss values below 10⁻⁶ are drawn on the bottom line.
        </p>

        <ChartTable
          caption="Excess loss L minus L_min at selected steps"
          columns={["Step", "Full-batch GD", "SGD (drawn run)", `Mean of ${N_RUNS} runs`, "Theory"]}
          rows={tableRows(sim, steps)}
        />
      </section>
    </ConceptLab>
  )
}

type Sim = {
  ensemble: ReturnType<typeof runEnsemble>
  gd: ReturnType<typeof runGd>
  prediction: ReturnType<typeof predictSpread>
}

/** Server and browser can disagree in the last bits of Math.cos/log, so rendered coordinates are rounded. */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function fmt(value: number): string {
  if (!Number.isFinite(value)) return "—"
  if (value === 0) return "0"
  const a = Math.abs(value)
  if (a < 1e-3) return value.toExponential(1).replace("e-", "e−")
  if (a < 0.1) return value.toPrecision(2)
  if (a < 10) return value.toPrecision(3)
  return value.toFixed(1)
}

function sup(exponent: number): string {
  const digits: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }
  return "10" + String(exponent).split("").map((c) => digits[c] ?? c).join("")
}

function tableRows(sim: Sim, steps: number) {
  const { gd, ensemble, prediction } = sim
  const picks: number[] = []
  const stride = Math.max(1, Math.round(steps / 12))
  for (let t = 0; t < steps; t += stride) picks.push(t)
  picks.push(steps)
  return picks.map((t) => [
    t,
    fmt(gd.excess[t]),
    fmt(ensemble.first.excess[t]),
    fmt(ensemble.meanExcess[t]),
    prediction ? fmt(prediction.excess[t]) : "—",
  ])
}

function chartALabel({
  problem,
  sim,
  steps,
  view,
  cloud,
  anyDiverged,
}: {
  problem: Problem
  sim: Sim
  steps: number
  view: ViewId
  cloud: CloudId
  anyDiverged: boolean
}) {
  const [x, y] = sim.ensemble.first.final
  const base = `Parameter space (${view === "zoom" ? "zoomed on the optimum" : "whole path"}): loss contours around the optimum at (${formatNumber(problem.optimum[0])}, ${formatNumber(problem.optimum[1])}), full-batch gradient descent, and one SGD path from (${START[0]}, ${START[1]}).`
  if (anyDiverged) return `${base} At these settings the optimizer diverges.`
  return `${base} After ${steps} steps SGD is at (${formatNumber(x)}, ${formatNumber(y)})${cloud === "show" ? `; the ${N_RUNS} independent end points have an RMS distance ${fmt(sim.ensemble.rmsSpread)} from the optimum` : ""}.`
}

/* -------------------------------- chart A -------------------------------- */

function ParameterSpace({
  problem,
  inner,
  view,
  showCloud,
  sim,
  gdDiverged,
  anyDiverged,
}: {
  problem: Problem
  inner: { width: number; height: number }
  view: ViewId
  showCloud: boolean
  sim: Sim
  gdDiverged: boolean
  anyDiverged: boolean
}) {
  const clipId = `clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const { width, height } = inner
  const [ox, oy] = problem.optimum
  // Equal pixels per unit on both axes keeps the ellipses true to the geometry.
  const bounds =
    view === "whole"
      ? { cx: -0.1, cy: 0.9, minX: 5.6, minY: 3.7 }
      : { cx: ox, cy: oy, minX: 1.6, minY: 1.0 }
  const pxPerUnit = Math.min(width / bounds.minX, height / bounds.minY)
  const spanX = width / pxPerUnit
  const spanY = height / pxPerUnit
  const sx = linear([bounds.cx - spanX / 2, bounds.cx + spanX / 2], [0, width])
  const sy = linear([bounds.cy - spanY / 2, bounds.cy + spanY / 2], [height, 0])
  const px = (p: readonly [number, number]) => [round2(sx(p[0])), round2(sy(p[1]))] as [number, number]

  const toPoints = (path: Float64Array) => {
    const out: [number, number][] = []
    for (let i = 0; i < path.length; i += 2) out.push(px([path[i], path[i + 1]]))
    return out
  }
  const sgdPoints = toPoints(sim.ensemble.first.path)
  const gdPoints = toPoints(sim.gd.path)
  const levels = LEVELS[view]
  const ring = sim.prediction ? covarianceEllipse(sim.prediction.covariance) : null
  const ringPath =
    ring && ring.radii[0] > 1e-9
      ? linePath(
          Array.from({ length: 65 }, (_, k) => {
            const phi = (2 * Math.PI * k) / 64
            const a = 2 * ring.radii[0] * Math.cos(phi)
            const b = 2 * ring.radii[1] * Math.sin(phi)
            const mean = sim.prediction!.mean
            return px([
              mean[0] + a * ring.axes[0][0] + b * ring.axes[1][0],
              mean[1] + a * ring.axes[0][1] + b * ring.axes[1][1],
            ])
          }),
        )
      : null

  const xTicks = sx.ticks(Math.max(3, Math.round(width / 90)))
  const yTicks = sy.ticks(5)
  const [startX, startY] = px(START)
  const [optX, optY] = px(problem.optimum)
  const sgdEnd = sgdPoints[sgdPoints.length - 1]
  const startVisible = startX > 0 && startX < width && startY > 0 && startY < height

  // cloud label sits beside the cloud, never on top of the dots
  const finals = sim.ensemble.finals.map(px)
  let cloudRadius = 0
  for (const f of finals) cloudRadius = Math.max(cloudRadius, Math.hypot(f[0] - optX, f[1] - optY))
  cloudRadius = clamp(cloudRadius, 6, height / 2)
  const cloudLabelX = clamp(optX + cloudRadius + 10, 0, width - 120)
  const cloudLabelY = clamp(optY - cloudRadius - 8, 12, height - 8)

  const contourLabels = [2, 4].map((k) => {
    const pts = contourPoints(problem, levels[k], 96).map(px)
    let best = pts[0]
    for (const pt of pts) if (pt[1] < best[1]) best = pt
    return { level: levels[k], x: best[0], y: best[1] }
  })

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={width} height={height} />
        </clipPath>
      </defs>
      <XAxis scale={sx} y={height} ticks={xTicks} label="w₁" format={(v) => formatNumber(v, 1)} />
      <YAxis scale={sy} ticks={yTicks} label="w₂" format={(v) => formatNumber(v, 1)} />
      <rect x={0} y={0} width={width} height={height} fill="none" className="viz-grid" />
      <g clipPath={`url(#${clipId})`}>
        {levels.map((level) => (
          <path
            key={level}
            d={linePath(contourPoints(problem, level, 96).map(px))}
            fill="none"
            className="viz-stroke-muted"
            strokeWidth={1}
            strokeOpacity={0.45}
          />
        ))}
        {contourLabels.map((label) =>
          label.y > 14 && label.y < height - 4 && label.x > 30 && label.x < width - 30 ? (
            <text
              key={label.level}
              className="viz-text"
              x={label.x}
              y={label.y - 4}
              textAnchor="middle"
              style={{ paintOrder: "stroke", stroke: "var(--viz-surface)", strokeWidth: 3 }}
            >
              {formatNumber(label.level, 3)}
            </text>
          ) : null,
        )}
        <path d={linePath(gdPoints)} fill="none" className="viz-stroke-ink" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath(sgdPoints)} className="viz-line viz-stroke-1" strokeOpacity={0.9} />
        {ringPath && !anyDiverged ? (
          <path d={ringPath} fill="none" className="viz-stroke-muted" strokeWidth={1.5} strokeDasharray="5 4" />
        ) : null}
        {showCloud && !anyDiverged
          ? finals.map((f, i) => (
              <circle
                key={i}
                cx={f[0]}
                cy={f[1]}
                r={3.5}
                className="viz-fill-2"
                stroke="var(--viz-surface)"
                strokeWidth={1}
                fillOpacity={0.9}
              />
            ))
          : null}
        {/* optimum: cross */}
        <g className="viz-stroke-ink" strokeWidth={2} strokeLinecap="round">
          <line x1={optX - 6} x2={optX + 6} y1={optY} y2={optY} />
          <line x1={optX} x2={optX} y1={optY - 6} y2={optY + 6} />
        </g>
        {startVisible ? <circle cx={startX} cy={startY} r={5} className="viz-dot viz-fill-ink" /> : null}
        {!gdDiverged ? <circle cx={sgdEnd[0]} cy={sgdEnd[1]} r={5} className="viz-dot viz-fill-1" /> : null}
      </g>
      {startVisible ? (
        <text className="viz-text-strong" x={startX + 9} y={startY - 8}>
          start
        </text>
      ) : null}
      <text
        className="viz-text-strong"
        x={clamp(optX + 10, 4, width - 60)}
        y={clamp(optY + 20, 14, height - 6)}
        style={{ paintOrder: "stroke", stroke: "var(--viz-surface)", strokeWidth: 3 }}
      >
        optimum
      </text>
      {showCloud && !anyDiverged ? (
        <text
          className="viz-text-strong"
          x={cloudLabelX}
          y={cloudLabelY}
          style={{ paintOrder: "stroke", stroke: "var(--viz-surface)", strokeWidth: 3 }}
        >
          {N_RUNS} run end-points
        </text>
      ) : null}
      {anyDiverged ? (
        <g>
          <rect x={width / 2 - 110} y={height / 2 - 22} width={220} height={44} rx={4} fill="var(--viz-surface)" stroke="var(--viz-axis)" />
          <text className="viz-text-strong" x={width / 2} y={height / 2 + 4} textAnchor="middle">
            Diverges at this η
          </text>
        </g>
      ) : null}
    </>
  )
}

/* -------------------------------- chart B -------------------------------- */

function LossChart({
  inner,
  steps,
  sim,
}: {
  inner: { width: number; height: number }
  steps: number
  sim: Sim
}) {
  const { width, height } = inner
  const { gd, ensemble, prediction } = sim
  const sgd = ensemble.first
  const start = Math.max(sgd.excess[0], 1e-6)
  const top = Math.ceil(Math.log10(start * 1.5))
  const sx = linear([0, steps], [0, width])
  const sy = linear([FLOOR_EXPONENT, top], [height, 0])
  const logY = (v: number) => round2(sy(clamp(Math.log10(Math.max(v, 1e-300)), FLOOR_EXPONENT, top)))
  const series = (values: ArrayLike<number>) => {
    const pts: [number, number][] = []
    for (let t = 0; t <= steps; t += 1) if (Number.isFinite(values[t])) pts.push([round2(sx(t)), logY(values[t])])
    return pts
  }
  const decades: number[] = []
  for (let k = FLOOR_EXPONENT; k <= top; k += 2) decades.push(k)

  const diverged = gd.diverged || ensemble.divergedCount > 0
  const gdPts = series(gd.excess)
  const sgdPts = series(sgd.excess)
  const predPts = prediction ? series(prediction.excess) : []
  const lastSgd = sgdPts[sgdPts.length - 1]
  const lastGd = gdPts[gdPts.length - 1]

  return (
    <>
      <XAxis scale={sx} y={height} label="step" format={(v) => String(Math.round(v))} />
      <YAxis
        scale={sy}
        ticks={decades}
        label="L − L_min"
        grid
        gridWidth={width}
        format={sup}
      />
      {predPts.length > 1 && !diverged ? (
        <path d={linePath(predPts)} fill="none" className="viz-stroke-muted" strokeWidth={2} strokeDasharray="5 4" strokeLinecap="round" />
      ) : null}
      <path d={linePath(gdPts)} className="viz-line viz-stroke-ink" />
      <path d={linePath(sgdPts)} className="viz-line viz-stroke-1" />
      {lastSgd && !diverged ? <circle cx={lastSgd[0]} cy={lastSgd[1]} r={4} className="viz-dot viz-fill-1" /> : null}
      {lastGd && !gd.diverged ? <circle cx={lastGd[0]} cy={lastGd[1]} r={4} className="viz-dot viz-fill-ink" /> : null}
      {lastSgd && !diverged ? (
        <text className="viz-text-strong" x={width + 8} y={lastSgd[1] + 4}>
          SGD
        </text>
      ) : null}
      {lastGd && !diverged ? (
        <text
          className="viz-text-strong"
          x={width + 8}
          y={lastSgd && Math.abs(lastGd[1] - lastSgd[1]) < 13 ? lastSgd[1] + 18 : lastGd[1] + 4}
        >
          full batch
        </text>
      ) : null}
    </>
  )
}
