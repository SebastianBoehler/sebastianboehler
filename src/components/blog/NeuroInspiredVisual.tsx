"use client"

import { useMemo, useState, type ReactNode } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Annotation, SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import { linear, linePath } from "@/lib/viz/scale"
import {
  AXON_LENGTH_MM,
  CREDIT_SYNAPSES,
  CREDIT_WINDOW_S,
  LOG_VELOCITY_MAX,
  LOG_VELOCITY_MIN,
  MYELIN_WEIGHT_MV,
  MYELIN_WINDOW_MS,
  SYNAPSE_T_A_MS,
  SYNAPSE_T_B_MS,
  SYNAPSE_WINDOW_MS,
  TAU_E_S,
  THRESHOLD_GAP_MV,
  VELOCITY_A_MS,
  V_REST_MV,
  V_THRESHOLD_MV,
  eligibilityFor,
  eligibilityTrace,
  lifTrace,
  simulateMyelin,
  simulateSynapse,
  velocityFromLog,
  voltageAt,
  weightChange,
  type CreditId,
  type FeedbackMode,
  type LifRun,
} from "@/lib/viz/neuroLearning"

type Mechanism = "synapse" | "myelin" | "credit"

const mechanismChoices = [
  { id: "synapse", label: "Synapse" },
  { id: "myelin", label: "Myelin" },
  { id: "credit", label: "Credit signal" },
] as const

const feedbackChoices = [
  { id: "trace", label: "With eligibility trace" },
  { id: "instant", label: "Reward only (no trace)" },
] as const

const mechanismCopy = {
  synapse: {
    title: "Synaptic strength",
    description:
      "How big a postsynaptic effect each input spike has. This is the narrowest useful bridge to an ML weight: it scales what an input contributes.",
    boundary:
      "A biological synapse is a living, timed, chemical structure, not a scalar stored in memory. Even here the leak matters: the same two weights sum to different peaks depending on when the spikes arrive.",
  },
  myelin: {
    title: "Conduction timing",
    description:
      "Myelin changes how fast and how reliably a spike travels along an axon. It changes when the input arrives, not how big its effect is.",
    boundary:
      "Myelin improves the channel; it does not set synaptic influence and does not decide which answer is correct. Faster is not simply better: what matters here is arrival relative to the other input.",
  },
  credit: {
    title: "Credit assignment",
    description:
      "Which synapses are allowed to change when a delayed, global reward arrives. Backpropagation answers this exactly. The brain appears to approximate it with a local eligibility trace multiplied by a global neuromodulator such as dopamine.",
    boundary:
      "A global reward is one scalar broadcast to every synapse; it is not a per-weight gradient. Backpropagation computes an exact gradient for every weight at once. A scalar reward gated by eligibility is a much noisier, less informative signal (not simulated here). The trace also favours recency, not causation: it cannot tell a recent bystander from the real cause.",
  },
} as const

const HALO = { paintOrder: "stroke", stroke: "var(--viz-surface)", strokeWidth: 4, strokeLinejoin: "round" } as const

const V_DOMAIN: [number, number] = [-76, -44]

const mv = (v: number, digits = 1) => `${v.toFixed(digits).replace("-", "−")} mV`
const ms = (v: number, digits = 1) => `${v.toFixed(digits)} ms`
const sec = (v: number, digits = 1) => `${v.toFixed(digits)} s`
const velocityLabel = (v: number) => `${v < 10 ? v.toFixed(2).replace(/\.?0+$/, "") : v.toFixed(0)}\u00a0m/\u2060s`

export default function NeuroInspiredVisual() {
  const [mechanism, setMechanism] = useState<Mechanism>("synapse")
  const [wA, setWA] = useState(6)
  const [wB, setWB] = useState(6)
  const [logV, setLogV] = useState(0)
  const [rewardTime, setRewardTime] = useState(1)
  const [feedback, setFeedback] = useState<FeedbackMode>("trace")

  const active = mechanismCopy[mechanism]
  const vB = velocityFromLog(logV)

  const synapse = useMemo(() => simulateSynapse(wA, wB), [wA, wB])
  const myelin = useMemo(() => simulateMyelin({ vB }), [vB])

  const credit = useMemo(
    () =>
      CREDIT_SYNAPSES.map((s) => ({
        ...s,
        e: eligibilityFor(feedback, rewardTime, s.coincidences),
        dw: weightChange(feedback, rewardTime, s.coincidences),
        trace: eligibilityTrace(feedback, s.coincidences),
      })),
    [feedback, rewardTime],
  )

  const summary = liveSummary(mechanism, { synapse, myelin, credit, rewardTime, feedback, wA, wB })

  return (
    <ConceptLab
      title="Three ways a pathway becomes easier to activate"
      description="Change one thing, then see which of the other two do not move. Each panel is a small simulation that runs live."
      methodology="Toy neuron models · computed live"
      headerActions={
        <SegmentedChoice
          label="Choose a mechanism"
          choices={mechanismChoices}
          value={mechanism}
          onChange={setMechanism}
        />
      }
      insights={[
        { label: active.title, body: active.description, tone: "accent" },
        { label: "Analogy boundary", body: active.boundary },
      ]}
      footer={
        <Annotation label="What this isolates" tone="intervention">
          {takeaway(mechanism, { synapse, myelin, credit, rewardTime, feedback })}
        </Annotation>
      }
      caption={
        <>
          Toy models with illustrative, round-number parameters in plausible ranges; they are not fits to data. A
          delta-synapse leaky integrate-and-fire neuron (each input spike adds an instantaneous jump; no refractory
          period) is a deliberately minimal neuron. Eligibility-trace time constants in the literature run from
          hundreds of milliseconds to a few seconds; 1 s follows Izhikevich (2007).
        </>
      }
    >
      <div className="space-y-6">
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>

        {mechanism === "synapse" ? (
          <SynapsePanel wA={wA} wB={wB} setWA={setWA} setWB={setWB} result={synapse} />
        ) : mechanism === "myelin" ? (
          <MyelinPanel logV={logV} setLogV={setLogV} vB={vB} result={myelin} />
        ) : (
          <CreditPanel
            rewardTime={rewardTime}
            setRewardTime={setRewardTime}
            feedback={feedback}
            setFeedback={setFeedback}
            credit={credit}
          />
        )}

        <ScopeTable
          rows={scopeRows(mechanism, { wA, wB, synapse, myelin, credit, rewardTime, feedback })}
        />
      </div>
    </ConceptLab>
  )
}

// ---------------------------------------------------------------------------
// Synapse panel
// ---------------------------------------------------------------------------

function SynapsePanel({
  wA,
  wB,
  setWA,
  setWB,
  result,
}: {
  wA: number
  wB: number
  setWA: (v: number) => void
  setWB: (v: number) => void
  result: ReturnType<typeof simulateSynapse>
}) {
  const { run } = result
  const peakDepol = run.peakMv - V_REST_MV
  const leakNote = `The no-leak sum would be ${(wA + wB).toFixed(1)} mV; the leak makes the real peak ${peakDepol.toFixed(1)} mV because A has partly decayed by the time B arrives.`

  return (
    <>
      <div className="lab-controls">
        <Slider
          label="Synapse A strength w_A"
          value={wA}
          min={0}
          max={12}
          step={0.5}
          onChange={setWA}
          format={(v) => `${v.toFixed(1)} mV`}
        />
        <Slider
          label="Synapse B strength w_B"
          value={wB}
          min={0}
          max={12}
          step={0.5}
          onChange={setWB}
          format={(v) => `${v.toFixed(1)} mV`}
        />
      </div>

      <MembraneChart
        run={run}
        alone={result.alone}
        tEnd={SYNAPSE_WINDOW_MS}
        label={`Membrane potential over ${SYNAPSE_WINDOW_MS} milliseconds. Input A at ${SYNAPSE_T_A_MS} ms adds ${wA} millivolts and input B at ${SYNAPSE_T_B_MS} ms adds ${wB}. Peak ${mv(run.peakMv)}; the neuron ${run.fired ? "fires" : "does not fire"}.`}
      />

      <dl className="lab-readout">
        <Readout label="Peak V" value={mv(run.peakMv)} />
        <Readout label="Fires?" value={run.fired ? `yes, at ${ms(run.spikeTimes[0], 0)}` : "no"} />
        <Readout label="No-leak sum" value={`${(wA + wB).toFixed(1)} mV`} />
        <Readout label="Needed from rest" value={`${THRESHOLD_GAP_MV} mV`} />
      </dl>

      <p className="max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
        <strong className="text-[var(--lab-ink)]">ML analogy:</strong> w multiplies the input, a·w. Here each input is a
        single spike (a = 1), so a larger w means a larger jump. {leakNote} A single input of at most 12 mV can never
        reach the 15 mV needed, so this neuron fires only on a coincidence.
      </p>

      <ChartTable
        caption="Membrane potential over time for the current synaptic strengths"
        columns={["Time (ms)", "V (mV)", "V, A alone (mV)", "V, B alone (mV)"]}
        rows={lifRows(run, result.alone, SYNAPSE_WINDOW_MS)}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Myelin panel
// ---------------------------------------------------------------------------

function MyelinPanel({
  logV,
  setLogV,
  vB,
  result,
}: {
  logV: number
  setLogV: (v: number) => void
  vB: number
  result: ReturnType<typeof simulateMyelin>
}) {
  const { run } = result
  const verdict = result.critical === null ? "never (the two weights cannot reach threshold together)" : `fires if Δ ≤ ${ms(result.critical, 2)}`

  return (
    <>
      <div className="lab-controls">
        <Slider
          label="Myelination of path B → conduction velocity"
          value={logV}
          min={LOG_VELOCITY_MIN}
          max={LOG_VELOCITY_MAX}
          step={0.01}
          onChange={setLogV}
          format={(s) => velocityLabel(velocityFromLog(s))}
          hint="Log scale, 0.5 to 50 m/s. Illustrative: roughly thin unmyelinated up to thick myelinated axons."
        />
        <div className="text-sm leading-6 text-[var(--lab-muted)]">
          <p className="lab-kicker">Held fixed</p>
          <p>
            Both cells fire at t = 0. Both axons are {AXON_LENGTH_MM} mm long. Path A conducts at {VELOCITY_A_MS} m/s.
            Both synapses are {MYELIN_WEIGHT_MV} mV.
          </p>
        </div>
      </div>

      <MembraneChart
        run={run}
        alone={result.alone}
        tEnd={MYELIN_WINDOW_MS}
        bracket={{ from: result.tA, to: result.tB }}
        label={`Membrane potential over ${MYELIN_WINDOW_MS} milliseconds with both synapses fixed at ${MYELIN_WEIGHT_MV} millivolts. Input A arrives at ${ms(result.tA)} and input B at ${ms(result.tB)}, a gap of ${ms(result.delta)}. Peak ${mv(run.peakMv)}; the neuron ${run.fired ? "fires" : "does not fire"}.`}
      />

      <dl className="lab-readout">
        <Readout label="Arrival A" value={ms(result.tA)} />
        <Readout label="Arrival B" value={ms(result.tB)} />
        <Readout label="Gap Δ" value={ms(result.delta)} />
        <Readout label="Peak V" value={mv(run.peakMv)} />
        <Readout label="Fires?" value={run.fired ? `yes, at ${ms(run.spikeTimes[0])}` : "no"} />
      </dl>

      <p className="max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
        Arrival time = length / velocity: {AXON_LENGTH_MM} mm at {velocityLabel(vB)} takes {ms(result.tB)}. With
        two {MYELIN_WEIGHT_MV} mV inputs, the neuron {verdict}. The weights never changed; timing alone flips the
        outcome. Making B faster than A does not help further: only the gap matters.
      </p>

      <ChartTable
        caption="Membrane potential over time for the current conduction velocity of path B"
        columns={["Time (ms)", "V (mV)", "V, A alone (mV)", "V, B alone (mV)"]}
        rows={lifRows(run, result.alone, MYELIN_WINDOW_MS)}
      />
    </>
  )
}

function lifRows(run: LifRun, alone: { A: LifRun; B: LifRun }, tEnd: number) {
  const times = new Set<number>()
  for (let t = 0; t <= tEnd; t += 2) times.add(t)
  for (const event of run.events) times.add(Number(event.t.toFixed(3)))
  return Array.from(times)
    .sort((a, b) => a - b)
    .map((t) => [
      t.toFixed(t % 1 === 0 ? 0 : 2),
      voltageAt(run, t).toFixed(2),
      voltageAt(alone.A, t).toFixed(2),
      voltageAt(alone.B, t).toFixed(2),
    ])
}

function MembraneChart({
  run,
  alone,
  tEnd,
  label,
  bracket,
}: {
  run: LifRun
  alone: { A: LifRun; B: LifRun }
  tEnd: number
  label: string
  bracket?: { from: number; to: number }
}) {
  const trace = useMemo(() => lifTrace(run, tEnd), [run, tEnd])
  const traceA = useMemo(() => lifTrace(alone.A, tEnd), [alone.A, tEnd])
  const traceB = useMemo(() => lifTrace(alone.B, tEnd), [alone.B, tEnd])

  return (
    <div>
      <Chart label={label} height={310} margin={{ top: 34, left: 56, right: 22, bottom: 44 }}>
        {({ width, height }) => {
          const xs = linear([0, tEnd], [0, width])
          const ys = linear(V_DOMAIN, [height, 0])
          const path = (points: { t: number; v: number }[]) => linePath(points.map((p) => [xs(p.t), ys(p.v)]))
          const thresholdY = ys(V_THRESHOLD_MV)
          const events = run.events
          return (
            <>
              <YAxis scale={ys} ticks={[-70, -65, -60, -55, -50, -45]} format={(v) => `${v}`.replace("-", "−")} label="Membrane V (mV)" grid gridWidth={width} />
              <XAxis scale={xs} y={height} ticks={niceTimeTicks(tEnd)} label="Time (ms)" />

              <line className="viz-stroke-muted" x1={0} x2={width} y1={thresholdY} y2={thresholdY} strokeWidth={1.5} strokeDasharray="6 4" />
              <text className="viz-text" x={width} y={thresholdY - 6} textAnchor="end">
                threshold {mv(V_THRESHOLD_MV, 0)}
              </text>

              {events.map((event, i) => (
                <line
                  key={`g${i}`}
                  className={`viz-stroke-${event.source === "A" ? 1 : 2}`}
                  x1={xs(event.t)}
                  x2={xs(event.t)}
                  y1={ys(V_REST_MV + event.uPeak)}
                  y2={height}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                  opacity={0.7}
                />
              ))}

              <path className="viz-line viz-stroke-1" d={path(traceA)} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.9} />
              <path className="viz-line viz-stroke-2" d={path(traceB)} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.9} />
              <path className="viz-line viz-stroke-ink" d={path(trace)} />

              {bracket ? <Bracket xs={xs} y={ys(-74)} from={bracket.from} to={bracket.to} /> : null}

              {events.map((event, i) => {
                const x = xs(event.t)
                const y = ys(V_REST_MV + event.uPeak)
                const crowded = i > 0 && x - xs(events[i - 1].t) < 56
                const labelY = y - 11 - (crowded ? 14 : 0)
                const text = `${event.source} +${event.w % 1 === 0 ? event.w : event.w.toFixed(1)} mV${event.spiked ? " → spike, reset" : ""}`
                return (
                  <g key={`m${i}`}>
                    {event.spiked ? (
                      <path
                        className="viz-dot viz-fill-ink"
                        d={`M${x},${y - 7}L${x + 7},${y}L${x},${y + 7}L${x - 7},${y}Z`}
                      />
                    ) : (
                      <circle className={`viz-dot viz-fill-${event.source === "A" ? 1 : 2}`} cx={x} cy={y} r={5} />
                    )}
                    <text className="viz-text-strong" style={HALO} x={x} y={labelY} textAnchor={x > width - 90 ? "end" : "middle"}>
                      {text}
                    </text>
                  </g>
                )
              })}
            </>
          )
        }}
      </Chart>
      <Legend
        items={[
          { label: "Membrane V (A + B)", series: "ink" },
          { label: "A alone", series: 1, kind: "dash" },
          { label: "B alone", series: 2, kind: "dash" },
          { label: "Threshold", series: "muted", kind: "dash" },
        ]}
      />
    </div>
  )
}

function niceTimeTicks(tEnd: number) {
  const step = tEnd > 40 ? 10 : 5
  const ticks: number[] = []
  for (let t = 0; t <= tEnd; t += step) ticks.push(t)
  return ticks
}

function Bracket({
  xs,
  y,
  from,
  to,
}: {
  xs: (v: number) => number
  y: number
  from: number
  to: number
}) {
  const x0 = xs(Math.min(from, to))
  const x1 = xs(Math.max(from, to))
  const delta = Math.abs(to - from)
  return (
    <g aria-hidden="true">
      <line className="viz-stroke-ink" x1={x0} x2={x1} y1={y} y2={y} strokeWidth={1.5} />
      <line className="viz-stroke-ink" x1={x0} x2={x0} y1={y - 4} y2={y + 4} strokeWidth={1.5} />
      <line className="viz-stroke-ink" x1={x1} x2={x1} y1={y - 4} y2={y + 4} strokeWidth={1.5} />
      <text className="viz-text-strong" style={HALO} x={(x0 + x1) / 2} y={y - 7} textAnchor="middle">
        {`Δ = ${delta.toFixed(1)} ms`}
      </text>
    </g>
  )
}

// ---------------------------------------------------------------------------
// Credit panel
// ---------------------------------------------------------------------------

interface CreditRow {
  id: CreditId
  coincidences: readonly number[]
  e: number
  dw: number
  trace: { t: number; e: number }[]
}

const SERIES: Record<CreditId, 1 | 2 | "ink"> = { A: 1, B: 2, C: "ink" }

function CreditPanel({
  rewardTime,
  setRewardTime,
  feedback,
  setFeedback,
  credit,
}: {
  rewardTime: number
  setRewardTime: (v: number) => void
  feedback: FeedbackMode
  setFeedback: (v: FeedbackMode) => void
  credit: CreditRow[]
}) {
  const [a, b, c] = credit
  const traceText =
    feedback === "trace"
      ? `Eligibility e(t) jumps by 1 at each coincidence and decays with time constant ${TAU_E_S} s. At the reward, the three synapses hold e = ${a.e.toFixed(2)}, ${b.e.toFixed(2)} and ${c.e.toFixed(2)}.`
      : `Without a trace a synapse counts as active only during its coincidence (50 ms window here). At t = ${rewardTime.toFixed(1)} s the three synapses hold ${a.e}, ${b.e} and ${c.e}.`

  return (
    <>
      <div className="lab-controls">
        <Slider
          label="Reward arrival time t_R"
          value={rewardTime}
          min={0}
          max={6}
          step={0.1}
          onChange={setRewardTime}
          format={(v) => sec(v)}
          hint="One scalar (a dopamine pulse) broadcast to all three synapses."
        />
        <div>
          <p className="lab-kicker mb-2">Feedback</p>
          <SegmentedChoice label="Feedback type" choices={feedbackChoices} value={feedback} onChange={setFeedback} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div>
          <EligibilityChart credit={credit} rewardTime={rewardTime} feedback={feedback} />
          <Legend
            items={[
              { label: "A: coincidence at 0 s", series: 1 },
              { label: "B: coincidence at 2 s", series: 2 },
              { label: "C: never active", series: "ink", kind: "dash" },
              { label: "Reward time", series: "muted", kind: "dash" },
            ]}
          />
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-[var(--lab-ink)]">Weight change Δw = η · e(t_R), in units of η</p>
          <LollipopChart credit={credit} />
        </div>
      </div>

      <p className="max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
        {traceText} Global reward alone cannot tell synapses apart; local eligibility does. C was never active, so its
        Δw is exactly 0 however large the reward is.
      </p>

      <ChartTable
        caption={feedback === "trace" ? "Eligibility trace of each synapse over time" : "Whether each synapse is active over time (no trace)"}
        columns={["Time (s)", feedback === "trace" ? "e, synapse A" : "active, A", feedback === "trace" ? "e, synapse B" : "active, B", feedback === "trace" ? "e, synapse C" : "active, C"]}
        rows={creditRows(feedback, rewardTime)}
      />
    </>
  )
}

function creditRows(feedback: FeedbackMode, rewardTime: number) {
  const times = new Set<number>()
  for (let t = 0; t <= CREDIT_WINDOW_S; t += 0.5) times.add(t)
  times.add(Number(rewardTime.toFixed(1)))
  return Array.from(times)
    .sort((x, y) => x - y)
    .map((t) => [
      `${t.toFixed(1)}${t === Number(rewardTime.toFixed(1)) ? " (reward)" : ""}`,
      ...CREDIT_SYNAPSES.map((s) => eligibilityFor(feedback, t, s.coincidences).toFixed(3)),
    ])
}

function EligibilityChart({
  credit,
  rewardTime,
  feedback,
}: {
  credit: CreditRow[]
  rewardTime: number
  feedback: FeedbackMode
}) {
  const [a, b, c] = credit
  const label = `${feedback === "trace" ? "Eligibility traces" : "Activity indicators"} of three synapses over ${CREDIT_WINDOW_S} seconds. Reward at ${rewardTime.toFixed(1)} seconds gives synapse A ${a.dw.toFixed(2)}, synapse B ${b.dw.toFixed(2)}, synapse C ${c.dw.toFixed(2)} in units of eta.`

  return (
    <Chart label={label} height={300} margin={{ top: 34, left: 52, right: 22, bottom: 44 }}>
      {({ width, height }) => {
        const xs = linear([0, CREDIT_WINDOW_S], [0, width])
        const ys = linear([0, 1.1], [height - 6, 0])
        const path = (points: { t: number; e: number }[]) => linePath(points.map((p) => [xs(p.t), ys(p.e)]))
        const rx = xs(rewardTime)
        const anchor = rx < 70 ? "start" : rx > width - 70 ? "end" : "middle"
        return (
          <>
            <YAxis scale={ys} ticks={[0, 0.5, 1]} label={feedback === "trace" ? "Eligibility e(t)" : "Active now (0 or 1)"} grid gridWidth={width} />
            <XAxis scale={xs} y={height} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} label="Time (s)" />

            <line className="viz-stroke-muted" x1={rx} x2={rx} y1={-8} y2={height} strokeWidth={1.5} strokeDasharray="5 4" />
            <text className="viz-text-strong" style={HALO} x={rx} y={-14} textAnchor={anchor}>
              {`reward at ${rewardTime.toFixed(1)} s`}
            </text>

            <path className="viz-line viz-stroke-1" d={path(a.trace)} />
            <path className="viz-line viz-stroke-2" d={path(b.trace)} />
            <path className="viz-line viz-stroke-ink" d={path(c.trace)} strokeDasharray="4 3" />

            <text className="viz-text-strong" style={HALO} x={xs(0) + 9} y={ys(1) + 4}>
              A
            </text>
            <text className="viz-text-strong" style={HALO} x={xs(2) + 9} y={ys(1) + 4}>
              B
            </text>
            <text className="viz-text-strong" style={HALO} x={width} y={ys(0) - 9} textAnchor="end">
              C: never active, always 0
            </text>

            {credit.map((s) => (
              <circle
                key={s.id}
                className={`viz-dot viz-fill-${SERIES[s.id]}`}
                cx={rx}
                cy={ys(s.e)}
                r={5}
              />
            ))}
          </>
        )
      }}
    </Chart>
  )
}

function LollipopChart({ credit }: { credit: CreditRow[] }) {
  const label = `Weight change for each synapse in units of eta: A ${credit[0].dw.toFixed(2)}, B ${credit[1].dw.toFixed(2)}, C ${credit[2].dw.toFixed(2)}.`
  return (
    <Chart label={label} height={176} margin={{ top: 10, left: 30, right: 72, bottom: 40 }}>
      {({ width, height }) => {
        const xs = linear([0, 1], [0, width])
        return (
          <>
            <XAxis scale={xs} y={height} ticks={[0, 0.5, 1]} grid gridHeight={height} />
            {credit.map((s, i) => {
              const y = (height * (i + 0.5)) / credit.length
              const x = xs(s.dw)
              return (
                <g key={s.id}>
                  <text className="viz-text-strong" style={HALO} x={-12} y={y} dy="0.32em" textAnchor="end">
                    {s.id}
                  </text>
                  <line className={`viz-stroke-${SERIES[s.id]}`} x1={0} x2={x} y1={y} y2={y} strokeWidth={2} strokeLinecap="round" />
                  <circle className={`viz-dot viz-fill-${SERIES[s.id]}`} cx={x} cy={y} r={5} />
                  <text className="viz-text-strong" style={HALO} x={x + 11} y={y} dy="0.32em">
                    {s.id === "C" ? "0 exactly" : s.dw.toFixed(2)}
                  </text>
                </g>
              )
            })}
          </>
        )
      }}
    </Chart>
  )
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

interface ScopeRow {
  label: string
  value: ReactNode
  changed: boolean
}

function ScopeTable({ rows }: { rows: ScopeRow[] }) {
  return (
    <section aria-label="What this panel changes and what it holds fixed" className="border-t border-[var(--lab-rule)] pt-4">
      <p className="lab-kicker mb-2">Which of the three things moved?</p>
      <ul className="divide-y divide-[var(--lab-rule)] text-sm">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid items-baseline gap-x-4 gap-y-1 py-2 sm:grid-cols-[11rem_minmax(0,1fr)_7rem]"
          >
            <strong className="font-semibold text-[var(--lab-ink)]">{row.label}</strong>
            <span className="text-[var(--lab-muted)]">{row.value}</span>
            <span
              className={
                row.changed
                  ? "text-xs font-bold uppercase tracking-wide text-[var(--lab-ink)] sm:text-right"
                  : "text-xs font-semibold uppercase tracking-wide text-[var(--lab-muted)] sm:text-right"
              }
            >
              {row.changed ? "you change" : "held fixed"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

interface Sims {
  synapse: ReturnType<typeof simulateSynapse>
  myelin: ReturnType<typeof simulateMyelin>
  credit: CreditRow[]
  rewardTime: number
  feedback: FeedbackMode
}

function scopeRows(mechanism: Mechanism, s: Sims & { wA: number; wB: number }): ScopeRow[] {
  if (mechanism === "synapse") {
    return [
      { label: "Synaptic strength", value: `w_A = ${s.wA.toFixed(1)} mV, w_B = ${s.wB.toFixed(1)} mV`, changed: true },
      { label: "Conduction timing", value: `inputs arrive at ${SYNAPSE_T_A_MS} ms and ${SYNAPSE_T_B_MS} ms, whatever the weights`, changed: false },
      { label: "Which synapse updates", value: "no learning rule runs; the weights are whatever you set", changed: false },
    ]
  }
  if (mechanism === "myelin") {
    return [
      { label: "Synaptic strength", value: `${MYELIN_WEIGHT_MV} mV for both inputs, in every run`, changed: false },
      { label: "Conduction timing", value: `A arrives at ${ms(s.myelin.tA)}, B at ${ms(s.myelin.tB)}`, changed: true },
      { label: "Which synapse updates", value: "no learning rule runs; neither weight changes", changed: false },
    ]
  }
  const [a, b, c] = s.credit
  return [
    { label: "Synaptic strength", value: "not simulated; the rule only outputs a weight change Δw", changed: false },
    { label: "Conduction timing", value: "coincidences at 0 s and 2 s, no axonal delay modelled", changed: false },
    {
      label: "Which synapse updates",
      value: `reward at ${sec(s.rewardTime)} gives Δw = ${a.dw.toFixed(2)} for A, ${b.dw.toFixed(2)} for B, ${c.dw.toFixed(2)} for C`,
      changed: true,
    },
  ]
}

function takeaway(mechanism: Mechanism, s: Sims): ReactNode {
  if (mechanism === "synapse") {
    const { run } = s.synapse
    return run.fired
      ? "A larger synaptic effect pushes the same pair of spikes over threshold. Arrival times did not move and nothing was learned: only how much each input counts changed."
      : "With these strengths the two inputs sum to less than the 15 mV needed. Raise a weight and the same spikes, at the same times, fire the neuron."
  }
  if (mechanism === "myelin") {
    const r = s.myelin
    return r.run.fired
      ? `The two inputs arrive ${r.delta.toFixed(1)} ms apart, close enough for their EPSPs to overlap and reach threshold. Slow path B and the same weights stop firing the neuron.`
      : `Path B arrives ${r.delta.toFixed(1)} ms after A, so A's EPSP has decayed before B's jump. The weights are identical to the firing case; only the timing differs.`
  }
  const [a, b] = s.credit
  if (s.feedback === "instant") {
    return a.dw > 0 || b.dw > 0
      ? "The reward happened to arrive during a coincidence, so that synapse is credited. Move the reward even 0.1 s away and nobody is: without a trace, delayed reward is lost."
      : "The reward arrived while no synapse was active, so no one is credited. Switch on the eligibility trace to bridge the delay."
  }
  return b.dw === 0 && s.rewardTime < 2
    ? "The reward came before B's coincidence, so B has no trace yet and gets nothing; A is credited, discounted by the delay. The same scalar reached all three synapses, and only local state decided who changed."
    : "The same scalar reward reached all three synapses. Differences come only from each synapse's own trace; the later coincidence is credited more, because the trace encodes recency, not causation."
}

function liveSummary(mechanism: Mechanism, s: Sims & { wA: number; wB: number }): string {
  if (mechanism === "synapse") {
    return `Synapse panel. Strengths ${s.wA} and ${s.wB} millivolts. Peak membrane potential ${mv(s.synapse.run.peakMv)}. The neuron ${s.synapse.run.fired ? "fires" : "does not fire"}. Timing is unchanged.`
  }
  if (mechanism === "myelin") {
    return `Myelin panel. Arrival A ${ms(s.myelin.tA)}, arrival B ${ms(s.myelin.tB)}, gap ${ms(s.myelin.delta)}. The neuron ${s.myelin.run.fired ? "fires" : "does not fire"}. Weights are unchanged.`
  }
  const [a, b, c] = s.credit
  return `Credit panel. Reward at ${s.rewardTime.toFixed(1)} seconds. Weight change: synapse A ${a.dw.toFixed(2)}, synapse B ${b.dw.toFixed(2)}, synapse C ${c.dw.toFixed(2)}. Feedback ${s.feedback === "trace" ? "uses an eligibility trace" : "has no trace"}.`
}
