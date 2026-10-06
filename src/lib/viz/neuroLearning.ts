/**
 * Toy models behind the "synapse / myelin / credit signal" figure.
 *
 * Everything is closed form (no randomness, no time stepping), so every number
 * on screen can be checked by hand:
 *
 *  - A leaky integrate-and-fire (LIF) neuron with delta synapses:
 *      dV/dt = -(V - V_rest) / tau_m
 *    and each presynaptic spike adds an instantaneous jump w (mV) to V.
 *    Between events V - V_rest decays exactly as exp(-t / tau_m). If a jump
 *    takes V to the threshold or above, the neuron spikes and V resets to
 *    V_rest. There is no refractory period.
 *  - Conduction delay = axon length / conduction velocity.
 *  - A three-factor learning rule: weight change = eta * eligibility(t_R),
 *    where eligibility is a trace that jumps by 1 at every pre/post
 *    coincidence and decays exponentially with time constant tau_e.
 */

/** Membrane time constant (ms). Typical cortical values are 10-30 ms. */
export const TAU_M_MS = 15
export const V_REST_MV = -70
export const V_THRESHOLD_MV = -55
/** Depolarisation needed to reach threshold from rest (mV). */
export const THRESHOLD_GAP_MV = V_THRESHOLD_MV - V_REST_MV

export type Source = "A" | "B"

export interface SynapticEvent {
  /** Arrival time at the postsynaptic neuron (ms). */
  t: number
  /** Instantaneous membrane jump (mV). */
  w: number
  source: Source
}

export interface LifEventResult extends SynapticEvent {
  /** Depolarisation above rest just before the jump (mV). */
  uBefore: number
  /** Depolarisation above rest just after the jump, before any reset (mV). */
  uPeak: number
  spiked: boolean
}

export interface LifRun {
  events: LifEventResult[]
  /** Post-event (post-reset) depolarisation above rest at the start of each decay segment. */
  segments: { t: number; u: number }[]
  spikeTimes: number[]
  /** Highest membrane potential reached, before reset (mV, absolute). */
  peakMv: number
  fired: boolean
  tauM: number
}

/** Exact event-driven simulation: decay between events, jump at events, reset on threshold. */
export function simulateLif(
  input: readonly SynapticEvent[],
  tauM: number = TAU_M_MS,
  gapMv: number = THRESHOLD_GAP_MV,
): LifRun {
  const sorted = [...input].sort((a, b) => a.t - b.t)
  const events: LifEventResult[] = []
  const segments: { t: number; u: number }[] = [{ t: 0, u: 0 }]
  const spikeTimes: number[] = []
  let tPrev = 0
  let u = 0
  let peakU = 0
  for (const event of sorted) {
    const uBefore = u * Math.exp(-(event.t - tPrev) / tauM)
    const uPeak = uBefore + event.w
    const spiked = uPeak >= gapMv
    if (uPeak > peakU) peakU = uPeak
    events.push({ ...event, uBefore, uPeak, spiked })
    if (spiked) spikeTimes.push(event.t)
    u = spiked ? 0 : uPeak
    tPrev = event.t
    segments.push({ t: event.t, u })
  }
  return {
    events,
    segments,
    spikeTimes,
    peakMv: V_REST_MV + peakU,
    fired: spikeTimes.length > 0,
    tauM,
  }
}

/** Membrane potential (mV) at time t; at an event time this is the post-event (post-reset) value. */
export function voltageAt(run: LifRun, t: number): number {
  let segment = run.segments[0]
  for (const candidate of run.segments) {
    if (candidate.t <= t) segment = candidate
    else break
  }
  return V_REST_MV + segment.u * Math.exp(-(t - segment.t) / run.tauM)
}

/** A single EPSP of size w has decayed to w * exp(-dt / tau) after dt ms. */
export function epspRemaining(w: number, dtMs: number, tauM: number = TAU_M_MS): number {
  return w * Math.exp(-dtMs / tauM)
}

/** Peak depolarisation of two EPSPs separated by dtMs: the first has decayed, the second is fresh. */
export function twoEpspPeak(wFirst: number, wSecond: number, dtMs: number, tauM: number = TAU_M_MS): number {
  return epspRemaining(wFirst, dtMs, tauM) + wSecond
}

/** Closed-form firing test for two EPSPs (the neuron fires on the second jump, or on the first if it alone reaches threshold). */
export function firesAtDelta(
  wFirst: number,
  wSecond: number,
  dtMs: number,
  tauM: number = TAU_M_MS,
  gapMv: number = THRESHOLD_GAP_MV,
): boolean {
  return wFirst >= gapMv || twoEpspPeak(wFirst, wSecond, dtMs, tauM) >= gapMv
}

/**
 * Largest gap (ms) between two EPSPs for which they still reach threshold:
 *   wFirst * exp(-D / tau) + wSecond = gap   =>   D = tau * ln(wFirst / (gap - wSecond)).
 * Returns Infinity if one EPSP reaches threshold alone and null if the two can never reach it together.
 */
export function criticalDelta(
  wFirst: number,
  wSecond: number,
  tauM: number = TAU_M_MS,
  gapMv: number = THRESHOLD_GAP_MV,
): number | null {
  if (wFirst >= gapMv || wSecond >= gapMv) return Infinity
  if (wFirst + wSecond < gapMv) return null
  return tauM * Math.log(wFirst / (gapMv - wSecond))
}

export interface TracePoint {
  t: number
  v: number
}

/**
 * Plot-ready membrane trace. Includes the vertical jump at each event, and the
 * vertical reset after a spike, so the line is drawn exactly as the model runs.
 */
export function lifTrace(run: LifRun, tEnd: number, dtMs = 0.25): TracePoint[] {
  const points: TracePoint[] = []
  let ei = 0
  const steps = Math.round(tEnd / dtMs)
  for (let i = 0; i <= steps; i += 1) {
    const t = i * dtMs
    while (ei < run.events.length && run.events[ei].t <= t) {
      const event = run.events[ei]
      points.push({ t: event.t, v: V_REST_MV + event.uBefore })
      points.push({ t: event.t, v: V_REST_MV + event.uPeak })
      if (event.spiked) points.push({ t: event.t, v: V_REST_MV })
      ei += 1
    }
    points.push({ t, v: voltageAt(run, t) })
  }
  return points
}

// ---------------------------------------------------------------------------
// Synapse panel
// ---------------------------------------------------------------------------

export const SYNAPSE_T_A_MS = 10
export const SYNAPSE_T_B_MS = 14
export const SYNAPSE_WINDOW_MS = 60

export interface SynapseResult {
  run: LifRun
  alone: { A: LifRun; B: LifRun }
  eventsAB: SynapticEvent[]
  /** Peak depolarisation if there were no leak (tau -> infinity): the plain weighted sum w_A*1 + w_B*1. */
  noLeakSumMv: number
}

export function simulateSynapse(wA: number, wB: number): SynapseResult {
  const a: SynapticEvent = { t: SYNAPSE_T_A_MS, w: wA, source: "A" }
  const b: SynapticEvent = { t: SYNAPSE_T_B_MS, w: wB, source: "B" }
  return {
    run: simulateLif([a, b]),
    alone: { A: simulateLif([a]), B: simulateLif([b]) },
    eventsAB: [a, b],
    noLeakSumMv: wA + wB,
  }
}

// ---------------------------------------------------------------------------
// Myelin panel
// ---------------------------------------------------------------------------

/** Fixed synaptic weight of both inputs in the myelin panel (mV). 9 + 9 > 15, 9 < 15. */
export const MYELIN_WEIGHT_MV = 9
export const AXON_LENGTH_MM = 15
export const VELOCITY_A_MS = 5
export const VELOCITY_MIN_MS = 0.5
export const VELOCITY_MAX_MS = 50
/** Slider range in log10(m/s). */
export const LOG_VELOCITY_MIN = -0.3
export const LOG_VELOCITY_MAX = 1.7
export const MYELIN_WINDOW_MS = 40

/** mm divided by m/s is ms: 15 mm at 5 m/s takes 3 ms. */
export function arrivalTimeMs(lengthMm: number, velocityMs: number): number {
  return lengthMm / velocityMs
}

export function velocityFromLog(logV: number): number {
  const v = Number((10 ** logV).toPrecision(3))
  return Math.min(VELOCITY_MAX_MS, Math.max(VELOCITY_MIN_MS, v))
}

export interface MyelinInput {
  vA?: number
  vB: number
  lengthA?: number
  lengthB?: number
  wA?: number
  wB?: number
}

export interface MyelinResult {
  tA: number
  tB: number
  delta: number
  /** Largest arrival gap that still fires with these weights; null if the pair can never fire. */
  critical: number | null
  run: LifRun
  alone: { A: LifRun; B: LifRun }
  wA: number
  wB: number
  vA: number
  vB: number
}

export function simulateMyelin(input: MyelinInput): MyelinResult {
  const vA = input.vA ?? VELOCITY_A_MS
  const wA = input.wA ?? MYELIN_WEIGHT_MV
  const wB = input.wB ?? MYELIN_WEIGHT_MV
  const tA = arrivalTimeMs(input.lengthA ?? AXON_LENGTH_MM, vA)
  const tB = arrivalTimeMs(input.lengthB ?? AXON_LENGTH_MM, input.vB)
  const a: SynapticEvent = { t: tA, w: wA, source: "A" }
  const b: SynapticEvent = { t: tB, w: wB, source: "B" }
  const aFirst = tA <= tB
  return {
    tA,
    tB,
    delta: Math.abs(tB - tA),
    critical: aFirst ? criticalDelta(wA, wB) : criticalDelta(wB, wA),
    run: simulateLif([a, b]),
    alone: { A: simulateLif([a]), B: simulateLif([b]) },
    wA,
    wB,
    vA,
    vB: input.vB,
  }
}

// ---------------------------------------------------------------------------
// Credit-signal panel
// ---------------------------------------------------------------------------

/** Eligibility-trace time constant (s). Literature values range from hundreds of ms to seconds; Izhikevich (2007) uses 1 s. */
export const TAU_E_S = 1
/** Learning rate; the figure reports weight changes in units of eta. */
export const ETA = 1
/** In the no-trace variant a synapse counts as "active now" for this long after a coincidence (s). */
export const ACTIVITY_WINDOW_S = 0.05
export const CREDIT_WINDOW_S = 8

export type CreditId = "A" | "B" | "C"
export type FeedbackMode = "trace" | "instant"

export interface CreditSynapse {
  id: CreditId
  /** Times of pre/post coincidences (s). */
  coincidences: readonly number[]
}

export const CREDIT_SYNAPSES: readonly CreditSynapse[] = [
  { id: "A", coincidences: [0] },
  { id: "B", coincidences: [2] },
  { id: "C", coincidences: [] },
]

/** e(t) = sum over past coincidences of exp(-(t - t_k) / tau_e). Zero before the first coincidence. */
export function eligibility(t: number, coincidences: readonly number[], tauE: number = TAU_E_S): number {
  let total = 0
  for (const tk of coincidences) {
    if (t >= tk) total += Math.exp(-(t - tk) / tauE)
  }
  return total
}

/** Without a trace, a synapse is only "eligible" while a coincidence is happening. */
export function activity(
  t: number,
  coincidences: readonly number[],
  window: number = ACTIVITY_WINDOW_S,
): number {
  for (const tk of coincidences) {
    if (t >= tk && t < tk + window) return 1
  }
  return 0
}

export function eligibilityFor(
  mode: FeedbackMode,
  t: number,
  coincidences: readonly number[],
): number {
  return mode === "trace" ? eligibility(t, coincidences) : activity(t, coincidences)
}

/** Three-factor rule: the same scalar reward reaches every synapse; only the local factor differs. */
export function weightChange(
  mode: FeedbackMode,
  rewardTime: number,
  coincidences: readonly number[],
  eta: number = ETA,
): number {
  return eta * eligibilityFor(mode, rewardTime, coincidences)
}

/** Plot-ready eligibility (or activity) trace with vertical jumps at coincidences. */
export function eligibilityTrace(
  mode: FeedbackMode,
  coincidences: readonly number[],
  tEnd: number = CREDIT_WINDOW_S,
  dt = 0.05,
): { t: number; e: number }[] {
  const sorted = [...coincidences].sort((a, b) => a - b)
  if (mode === "instant") {
    const points = [{ t: 0, e: 0 }]
    for (const tk of sorted) {
      points.push({ t: tk, e: 0 }, { t: tk, e: 1 })
      points.push({ t: tk + ACTIVITY_WINDOW_S, e: 1 }, { t: tk + ACTIVITY_WINDOW_S, e: 0 })
    }
    points.push({ t: tEnd, e: 0 })
    return points
  }
  const points: { t: number; e: number }[] = []
  const steps = Math.round(tEnd / dt)
  let ci = 0
  for (let i = 0; i <= steps; i += 1) {
    const t = Number((i * dt).toFixed(6))
    while (ci < sorted.length && sorted[ci] <= t) {
      points.push({ t: sorted[ci], e: eligibility(sorted[ci] - 1e-9, sorted) })
      points.push({ t: sorted[ci], e: eligibility(sorted[ci], sorted) })
      ci += 1
    }
    points.push({ t, e: eligibility(t, sorted) })
  }
  return points
}
