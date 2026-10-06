"use client"

import { useId, useMemo, useState } from "react"
import { ConceptLab, type LabInsight } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import { formatNumber, linear, linePath } from "@/lib/viz/scale"
import {
  EVAL_GRID,
  LAMBDA_INDEX_MAX,
  OBS_END,
  SLIGHTLY_WRONG_LAW,
  TRUE_LAW,
  T_MAX,
  WRONG_DAMPING_LAW,
  dataSystem,
  evaluate,
  lambdaFromIndex,
  makeSensors,
  metricsFor,
  solveFit,
  sweepOutsideRmse,
  trueSolution,
  type Law,
} from "@/lib/viz/physicsInformed"

type LawId = "correct" | "stiffness" | "damping"

const LAW_CHOICES = [
  { id: "correct", label: "Correct k=4" },
  { id: "stiffness", label: "Wrong k=6" },
  { id: "damping", label: "Wrong c=1.2" },
] as const

const LAWS: Record<LawId, { law: Law; name: string; note: string }> = {
  correct: {
    law: TRUE_LAW,
    name: "the correct law",
    note: "Penalises u″ + 0.4 u′ + 4.0 u. This is exactly the law that generated the data.",
  },
  stiffness: {
    law: SLIGHTLY_WRONG_LAW,
    name: "a slightly wrong law (k = 6.0)",
    note: "Penalises u″ + 0.4 u′ + 6.0 u. The spring constant is 50% too high, so the law wants a faster oscillation than the one that produced the data.",
  },
  damping: {
    law: WRONG_DAMPING_LAW,
    name: "a wrong-damping law (c = 1.2)",
    note: "Penalises u″ + 1.2 u′ + 4.0 u. The law expects the oscillation to die out three times faster than it really does.",
  },
}

const DEFAULT_LAMBDA_INDEX = 20
const T_CLIP = 1.6

function formatLambda(lambda: number): string {
  if (lambda === 0) return "0 (data only)"
  if (lambda < 0.01) {
    const exp = Math.floor(Math.log10(lambda) + 1e-9)
    const mant = lambda / 10 ** exp
    return Math.abs(mant - 1) < 0.02 ? `1e${exp}` : `${formatNumber(mant, 1)}e${exp}`
  }
  if (lambda >= 100) return String(Math.round(lambda))
  return formatNumber(lambda, lambda < 1 ? 3 : 2)
}

function fmtErr(v: number): string {
  if (v >= 10) return v.toFixed(1)
  if (v >= 1) return v.toFixed(2)
  if (v >= 0.01) return v.toFixed(3)
  return v.toFixed(4)
}

/** Round SVG coordinates: the fit is ill-conditioned, so last-digit float noise must not reach the markup. */
const px = (v: number) => Math.round(v * 100) / 100

/** Nudge labels apart vertically (positions are top-to-bottom baselines). */
function spread(ys: number[], gap: number, min: number, max: number): number[] {
  const order = ys.map((y, i) => [y, i] as const).sort((a, b) => a[0] - b[0])
  const out = new Array<number>(ys.length)
  let prev = min - gap
  for (const [y, i] of order) {
    const v = Math.max(y, prev + gap)
    out[i] = v
    prev = v
  }
  const overflow = prev - max
  if (overflow > 0) for (let i = 0; i < out.length; i += 1) out[i] -= overflow
  return out
}

export default function PhysicsInformedVisual() {
  const [lambdaIndex, setLambdaIndex] = useState(DEFAULT_LAMBDA_INDEX)
  const [lawId, setLawId] = useState<LawId>("correct")
  const [n, setN] = useState(8)
  const [sigma, setSigma] = useState(0.08)
  const [seed, setSeed] = useState(1)

  const lambda = lambdaFromIndex(lambdaIndex)
  const law = LAWS[lawId]

  // everything below depends only on the sensor draw
  const draw = useMemo(() => {
    const sensors = makeSensors(seed, n, sigma)
    const system = dataSystem(sensors)
    const dataW = solveFit(system, 0, TRUE_LAW)
    const dataCurve = evaluate(dataW, EVAL_GRID)
    return {
      sensors,
      system,
      dataCurve,
      dataMetrics: metricsFor(dataW),
      sweep: sweepOutsideRmse(sensors),
    }
  }, [seed, n, sigma])

  const physics = useMemo(() => {
    const w = solveFit(draw.system, lambda, law.law)
    return { curve: evaluate(w, EVAL_GRID), metrics: metricsFor(w) }
  }, [draw, lambda, law])

  const truth = useMemo(() => EVAL_GRID.map((t) => trueSolution(t)), [])
  const dataPeak = Math.max(...draw.dataCurve.u.map(Math.abs))

  const summary =
    lambda === 0
      ? `Physics weight is zero, so the blue curve equals the orange data-only fit. Outside the sensor window its error is ${fmtErr(draw.dataMetrics.rmseOutside)}.`
      : `With ${law.name} at weight ${formatLambda(lambda)}, error outside the sensor window is ${fmtErr(physics.metrics.rmseOutside)} for the physics-informed fit against ${fmtErr(draw.dataMetrics.rmseOutside)} for data only. Inside the window: ${fmtErr(physics.metrics.rmseInside)} against ${fmtErr(draw.dataMetrics.rmseInside)}. Residual of the true law: ${fmtErr(physics.metrics.lawResidual)} against ${fmtErr(draw.dataMetrics.lawResidual)}.`

  const tableRows = useMemo(() => {
    const rows: (string | number)[][] = []
    for (let t = 0; t <= T_MAX + 1e-9; t += 0.5) {
      const i = Math.round(t / 0.05)
      rows.push([
        formatNumber(t, 1),
        formatNumber(truth[i], 3),
        formatNumber(draw.dataCurve.u[i], 3),
        formatNumber(physics.curve.u[i], 3),
      ])
    }
    return rows
  }, [truth, draw, physics])

  const mainLabel = `Displacement u over time from 0 to 10 seconds. Sensors exist only from 0 to ${OBS_END} seconds. The data-only fit has error ${fmtErr(draw.dataMetrics.rmseOutside)} outside that window; the physics-informed fit with ${law.name} at weight ${formatLambda(lambda)} has error ${fmtErr(physics.metrics.rmseOutside)}.`

  const sweepLabel = `Error outside the sensor window against physics weight on log axes. The correct law falls to about ${fmtErr(draw.sweep[LAMBDA_INDEX_MAX - 1].correct)} and stays there; a wrong law levels off at ${fmtErr(draw.sweep[LAMBDA_INDEX_MAX - 1].slightlyWrong)} (k = 6) or ${fmtErr(draw.sweep[LAMBDA_INDEX_MAX - 1].wrongDamping)} (c = 1.2); data only is ${fmtErr(draw.dataMetrics.rmseOutside)}.`

  const insights: LabInsight[] = [
    {
      label: "The loss",
      body: (
        <>
          Loss = data mismatch + λ × law violation. Data mismatch is the mean squared gap between the curve u and the n
          sensor readings. Law violation is the mean squared value of u″ + c·u′ + k·u at 120 points across 0–10 s,
          sensors or not.
        </>
      ),
      tone: "intervention",
    },
    {
      label: "Held fixed",
      body: "Same model class (36 Gaussian bumps), same sensors, same noise, same tiny ridge. The orange curve is always the λ = 0 fit on exactly this data.",
    },
    {
      label: "What the knob does",
      body: "λ sets how much a violation of the law costs compared with missing a sensor. Too small and the law term is lost in the ridge. Large with the right law, the curve is forced onto a true solution, even where nothing was measured.",
      tone: "accent",
    },
    {
      label: "Limits",
      body: "The law is a soft penalty, not a guarantee. A wrong law gives a confidently biased curve that more data and a larger λ cannot repair. Real PINNs use neural networks trained by gradient descent, where loss balancing and stiff equations make optimisation hard. Here a linear surrogate keeps the optimum exact so only the loss term is on trial.",
    },
  ]

  return (
    <ConceptLab
      title="What does adding a physical law to the loss change?"
      description="Fit the same noisy sensors twice: once by data alone, once with a penalty for violating the equation of motion. Then see what happens where there are no sensors."
      methodology="Linear surrogate · closed-form optimum · computed live"
      insights={insights}
      caption="Toy model. A damped oscillator (u″ + 0.4u′ + 4u = 0, u(0) = 1, u′(0) = 0) is observed by noisy sensors only for the first 3.5 s. Both curves are linear combinations of 36 Gaussian bumps whose loss minimum is solved exactly, so this isolates the effect of the loss term; it is not a neural network and says nothing about training difficulty. Sensor times and noise come from a seeded generator."
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {summary}
      </p>

      <Annotation label="Loss, as computed here" tone="intervention">
        <strong className="text-[var(--lab-ink)]">Loss = data mismatch + λ × law violation.</strong> Symbols: u(t) is the
        model curve, y<sub>i</sub> the sensor reading at time t<sub>i</sub>, and c, k the damping and stiffness in the law
        u″ + c·u′ + k·u = 0.
      </Annotation>

      <div className="mt-5 lab-controls">
        <Slider
          label="Physics weight"
          value={lambdaIndex}
          min={0}
          max={LAMBDA_INDEX_MAX}
          onChange={setLambdaIndex}
          format={(i) => `λ = ${formatLambda(lambdaFromIndex(i))}`}
          hint="Log scale, 1e-5 to 1000. Far left = 0."
        />
        <Slider label="Sensors" value={n} min={4} max={24} onChange={setN} format={(v) => `n = ${v}`} />
        <Slider
          label="Sensor noise"
          value={sigma}
          min={0}
          max={0.3}
          step={0.01}
          onChange={setSigma}
          format={(v) => `σ = ${formatNumber(v, 2)}`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3">
        <div>
          <p className="lab-kicker mb-1">Law used in the penalty</p>
          <SegmentedChoice label="Law used in the penalty" choices={LAW_CHOICES} value={lawId} onChange={setLawId} />
        </div>
        <div className="lab-segmented">
          <button type="button" className="px-3 text-sm" onClick={() => setSeed((s) => s + 1)}>
            New sensor draw
          </button>
        </div>
      </div>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-[var(--lab-muted)]">{law.note}</p>

      <div className="mt-5">
        <MainChart
          label={mainLabel}
          truth={truth}
          draw={draw}
          physicsU={physics.curve.u}
          lambda={lambda}
        />
        <div className="mt-2">
          <Legend
            items={[
              { label: "Sensors (noisy)", series: "ink", kind: "dot" },
              { label: "True solution", series: "ink", kind: "dash" },
              { label: "Data only (λ = 0)", series: 2 },
              { label: "Physics-informed", series: 1 },
              { label: "No sensors here", series: "muted", kind: "band" },
            ]}
          />
        </div>
        {dataPeak > T_CLIP ? (
          <p className="mt-2 text-xs leading-5 text-[var(--lab-muted)]">
            The data-only curve leaves the plotted range (peak |u| = {formatNumber(dataPeak, 1)}). It still fits the
            sensors; the sensors just do not say what it should do in between.
          </p>
        ) : null}
        <ChartTable
          caption="True solution, data-only fit and physics-informed fit every 0.5 seconds"
          columns={["t (s)", "True u", "Data only", "Physics-informed"]}
          rows={tableRows}
        />
      </div>

      <dl
        className="lab-readout mt-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))" }}
        aria-label="Errors against the true solution"
      >
        <Readout
          title="Error inside 0–3.5 s"
          data={draw.dataMetrics.rmseInside}
          physics={physics.metrics.rmseInside}
        />
        <Readout
          title="Error outside (3.5–10 s)"
          data={draw.dataMetrics.rmseOutside}
          physics={physics.metrics.rmseOutside}
        />
        <Readout
          title="Law residual (true law)"
          data={draw.dataMetrics.lawResidual}
          physics={physics.metrics.lawResidual}
        />
      </dl>
      <p className="mt-2 text-xs leading-5 text-[var(--lab-muted)]">
        Errors are root-mean-square gaps to the true solution on a 0.05 s grid. Law residual is the RMS of u″ + 0.4u′ +
        4u, always judged by the true law, whichever law was used in training.
      </p>

      <section className="mt-8" aria-labelledby="pi-sweep-title">
        <h3 id="pi-sweep-title" className="text-sm font-semibold text-[var(--lab-ink)]">
          Error outside the window, as the weight grows
        </h3>
        <p className="mb-2 max-w-3xl text-xs leading-5 text-[var(--lab-muted)]">
          Same sensors, every law, 25 weights. Too small does nothing (the curve sits at the orange level); a correct law
          drives the error down and keeps it there; a wrong law stops improving and stays biased. The dot marks the
          current setting. Wrong laws can still beat a wild data-only curve outside the window, but they cost accuracy
          inside it. Try n = 24 and noise 0: the data alone is then good enough that the wrong laws are plainly worse.
        </p>
        <SweepChart label={sweepLabel} draw={draw} lambdaIndex={lambdaIndex} lawId={lawId} />
        <ChartTable
          summary="View weight sweep as a table"
          caption="Error outside the sensor window for each penalty law and physics weight"
          columns={["λ", "Correct law", "Wrong k=6", "Wrong c=1.2"]}
          rows={draw.sweep.map((p) => [
            formatLambda(p.lambda),
            fmtErr(p.correct),
            fmtErr(p.slightlyWrong),
            fmtErr(p.wrongDamping),
          ])}
        />
      </section>
    </ConceptLab>
  )
}

function Readout({ title, data, physics }: { title: string; data: number; physics: number }) {
  return (
    <div>
      <dt>{title}</dt>
      <dd className="mt-1 max-w-[13rem] text-base">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-normal text-[var(--lab-muted)]">Data only</span>
          <span>{fmtErr(data)}</span>
        </span>
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-normal text-[var(--lab-muted)]">Physics-informed</span>
          <span>{fmtErr(physics)}</span>
        </span>
      </dd>
    </div>
  )
}

interface DrawProps {
  sensors: { t: number[]; y: number[] }
  dataCurve: { u: number[] }
  dataMetrics: { rmseOutside: number }
  sweep: { lambda: number; correct: number; slightlyWrong: number; wrongDamping: number }[]
}

function MainChart({
  label,
  truth,
  draw,
  physicsU,
  lambda,
}: {
  label: string
  truth: number[]
  draw: DrawProps
  physicsU: number[]
  lambda: number
}) {
  const clipId = `pi-clip-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <Chart label={label} height={340} margin={{ left: 44, right: 14 }}>
      {({ width, height }) => {
        const x = linear([0, T_MAX], [0, width])
        const y = linear([-T_CLIP, T_CLIP], [height, 0])
        const path = (u: readonly number[]) =>
          linePath(EVAL_GRID.map((t, i) => [x(t), y(Math.max(-T_CLIP * 1.5, Math.min(T_CLIP * 1.5, u[i])))] as const))

        // flag labels: leftmost anchor on the top row, so leaders never cross a lower label
        const narrow = x(OBS_END) < 170
        const flagsRaw = [
          { key: "data", text: "Data only", t: 3.9, u: draw.dataCurve.u },
          { key: "phys", text: lambda === 0 ? "Physics (λ = 0)" : "Physics-informed", t: 5.3, u: physicsU },
          { key: "true", text: "True solution", t: 6.6, u: truth },
        ]
        const flags = flagsRaw.map((f, row) => {
          const idx = Math.round(f.t / 0.05)
          const fx = px(x(f.t))
          const fy = px(Math.max(0, Math.min(height, y(f.u[idx]))))
          return { ...f, fx, fy, row, ty: 14 + row * 15 }
        })
        return (
          <>
            <defs>
              <clipPath id={clipId}>
                <rect x={0} y={0} width={width} height={height} />
              </clipPath>
            </defs>
            <rect
              x={x(OBS_END)}
              y={0}
              width={width - x(OBS_END)}
              height={height}
              className="viz-fill-muted viz-wash"
            />
            <YAxis scale={y} ticks={[-1.5, -1, -0.5, 0, 0.5, 1, 1.5]} grid gridWidth={width} label="displacement u" />
            <XAxis scale={x} y={height} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} label="time t (s)" />
            <line x1={x(OBS_END)} x2={x(OBS_END)} y1={0} y2={height} className="viz-stroke-muted" strokeDasharray="2 4" />
            <text className="viz-text" x={x(OBS_END) - 6} y={height - 8} textAnchor="end">
              {narrow ? "observed" : `observed window 0–${OBS_END} s`}
            </text>
            <text className="viz-text" x={x(OBS_END) + 6} y={height - 8}>
              {narrow ? "no sensors" : "no sensors here"}
            </text>
            <g clipPath={`url(#${clipId})`}>
              <path d={path(truth)} className="viz-line viz-stroke-ink" strokeDasharray="5 4" />
              <path d={path(draw.dataCurve.u)} className="viz-line viz-stroke-2" />
              <path d={path(physicsU)} className="viz-line viz-stroke-1" />
            </g>
            {draw.sensors.t.map((t, i) => (
              <circle key={i} cx={px(x(t))} cy={px(y(draw.sensors.y[i]))} r={4.5} className="viz-dot viz-fill-ink" />
            ))}
            {flags.map((f) => (
              <g key={f.key} aria-hidden="true">
                <line
                  x1={f.fx}
                  x2={f.fx}
                  y1={f.ty + 3}
                  y2={f.fy}
                  className="viz-stroke-muted"
                  strokeWidth={1}
                />
                <text
                  className="viz-text-strong"
                  x={f.fx + 4}
                  y={f.ty}
                  stroke="var(--viz-surface)"
                  strokeWidth={4}
                  paintOrder="stroke"
                >
                  {f.text}
                </text>
              </g>
            ))}
                      </>
        )
      }}
    </Chart>
  )
}

function SweepChart({
  label,
  draw,
  lambdaIndex,
  lawId,
}: {
  label: string
  draw: DrawProps
  lambdaIndex: number
  lawId: LawId
}) {
  const LOG_MIN = -2.6
  const LOG_MAX = 0.5
  return (
    <Chart label={label} height={270} margin={{ left: 44, right: 14 }}>
      {({ width, height }) => {
        const x = linear([-5, 3], [0, width])
        const y = linear([LOG_MIN, LOG_MAX], [height, 0])
        const ly = (v: number) => Math.max(LOG_MIN, Math.min(LOG_MAX, Math.log10(Math.max(v, 1e-12))))
        const series = [
          { key: "correct", label: "correct law", cls: "viz-stroke-1", dash: undefined, get: (p: DrawProps["sweep"][number]) => p.correct },
          { key: "stiffness", label: "wrong k=6", cls: "viz-stroke-ink", dash: "7 4", get: (p: DrawProps["sweep"][number]) => p.slightlyWrong },
          { key: "damping", label: "wrong c=1.2", cls: "viz-stroke-ink", dash: "1 5", get: (p: DrawProps["sweep"][number]) => p.wrongDamping },
        ] as const
        const lines = series.map((s) => ({
          ...s,
          pts: draw.sweep.map((p) => [x(Math.log10(p.lambda)), y(ly(s.get(p)))] as const),
        }))
        const dataY = px(y(ly(draw.dataMetrics.rmseOutside)))
        const labelEntries = [
          { key: "data", text: "data only (λ = 0)", y: dataY },
          ...lines.map((l) => ({ key: l.key, text: l.label, y: l.pts[l.pts.length - 1][1] })),
        ]
        const placed = spread(
          labelEntries.map((e) => e.y - 6),
          13,
          10,
          height - 6,
        )
        const active = lines.find((l) => l.key === lawId)
        const current =
          lambdaIndex > 0 && active ? active.pts[lambdaIndex - 1] : null
        const yTicks = [-2, -1, 0]
        return (
          <>
            <YAxis
              scale={y}
              ticks={yTicks}
              format={(v) => formatNumber(10 ** v, 3)}
              grid
              gridWidth={width}
              label="error outside"
            />
            <XAxis
              scale={x}
              y={height}
              ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3]}
              format={(v) => (v === 0 ? "1" : `1e${v}`)}
              label="physics weight λ (log scale)"
            />
            <line x1={0} x2={width} y1={dataY} y2={dataY} className="viz-line viz-stroke-2" strokeDasharray="6 4" />
            {lines.map((l) => (
              <path
                key={l.key}
                d={linePath(l.pts)}
                className={`viz-line ${l.cls}`}
                strokeDasharray={l.dash}
                opacity={l.key === lawId ? 1 : 0.7}
              />
            ))}
            {current ? (
              <>
                <line x1={px(current[0])} x2={px(current[0])} y1={0} y2={height} className="viz-stroke-muted" strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={px(current[0])} cy={px(current[1])} r={5} className="viz-dot viz-fill-ink" />
              </>
            ) : null}
            {labelEntries.map((e, i) => (
              <text
                key={e.key}
                className="viz-text-strong"
                x={width - 4}
                y={px(placed[i])}
                textAnchor="end"
                stroke="var(--viz-surface)"
                strokeWidth={4}
                paintOrder="stroke"
                aria-hidden="true"
              >
                {e.text}
              </text>
            ))}
          </>
        )
      }}
    </Chart>
  )
}
