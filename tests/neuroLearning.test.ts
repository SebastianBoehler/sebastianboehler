import { expect, test } from "bun:test"
import {
  ACTIVITY_WINDOW_S,
  CREDIT_SYNAPSES,
  MYELIN_WEIGHT_MV,
  TAU_E_S,
  TAU_M_MS,
  THRESHOLD_GAP_MV,
  V_REST_MV,
  V_THRESHOLD_MV,
  activity,
  arrivalTimeMs,
  criticalDelta,
  eligibility,
  eligibilityTrace,
  firesAtDelta,
  lifTrace,
  simulateLif,
  simulateMyelin,
  simulateSynapse,
  twoEpspPeak,
  velocityFromLog,
  voltageAt,
  weightChange,
  type SynapticEvent,
} from "@/lib/viz/neuroLearning"

const ev = (t: number, w: number, source: "A" | "B" = "A"): SynapticEvent => ({ t, w, source })

/** Independent check: explicit Euler on dV/dt = -(V - V_rest)/tau with delta jumps and reset. */
function euler(events: SynapticEvent[], tEnd: number, dt = 0.001) {
  let v = V_REST_MV
  let peak = V_REST_MV
  const out: { t: number; v: number }[] = []
  const pending = [...events].sort((a, b) => a.t - b.t)
  let ei = 0
  const steps = Math.round(tEnd / dt)
  for (let i = 0; i <= steps; i += 1) {
    const t = i * dt
    while (ei < pending.length && pending[ei].t <= t + dt / 2) {
      v += pending[ei].w
      if (v > peak) peak = v
      if (v >= V_THRESHOLD_MV) v = V_REST_MV
      ei += 1
    }
    out.push({ t, v })
    v += (-(v - V_REST_MV) / TAU_M_MS) * dt
  }
  return { out, peak }
}

test("constants match the stated model", () => {
  expect(TAU_M_MS).toBe(15)
  expect(V_REST_MV).toBe(-70)
  expect(V_THRESHOLD_MV).toBe(-55)
  expect(THRESHOLD_GAP_MV).toBe(15)
})

test("a single EPSP decays exponentially with tau_m", () => {
  const run = simulateLif([ev(10, 6)])
  expect(voltageAt(run, 9.99)).toBeCloseTo(V_REST_MV, 9)
  expect(voltageAt(run, 10)).toBeCloseTo(V_REST_MV + 6, 9)
  // one time constant later: 1/e of the jump remains
  expect(voltageAt(run, 10 + TAU_M_MS)).toBeCloseTo(V_REST_MV + 6 / Math.E, 9)
  // two time constants later: 1/e^2
  expect(voltageAt(run, 10 + 2 * TAU_M_MS)).toBeCloseTo(V_REST_MV + 6 / Math.E ** 2, 9)
  expect(run.fired).toBe(false)
  expect(run.peakMv).toBeCloseTo(-64, 9)
})

test("the event-driven solution agrees with explicit Euler (tiny dt)", () => {
  const events = [ev(10, 6), ev(14, 7, "B")]
  const run = simulateLif(events)
  const reference = euler(events, 60)
  for (const { t, v } of reference.out.filter((_, i) => i % 500 === 0)) {
    expect(Math.abs(voltageAt(run, t) - v)).toBeLessThan(0.02)
  }
  expect(Math.abs(run.peakMv - reference.peak)).toBeLessThan(1e-3)
})

test("two EPSPs sum with the first one decayed; threshold is crossed exactly where the closed form says", () => {
  const wA = 9
  const wB = 9
  const critical = criticalDelta(wA, wB) as number
  expect(critical).toBeCloseTo(TAU_M_MS * Math.log(1.5), 12)

  const just = (d: number) => simulateLif([ev(0, wA), ev(d, wB, "B")])
  const inside = just(critical - 1e-6)
  const outside = just(critical + 1e-6)
  expect(inside.fired).toBe(true)
  expect(outside.fired).toBe(false)

  // at the second event, the peak is w_A * exp(-d/tau) + w_B
  const d = 4
  const run = just(d)
  expect(run.events[1].uPeak).toBeCloseTo(wA * Math.exp(-d / TAU_M_MS) + wB, 12)
  expect(twoEpspPeak(wA, wB, d)).toBeCloseTo(run.events[1].uPeak, 12)
  expect(run.peakMv).toBeCloseTo(V_REST_MV + twoEpspPeak(wA, wB, d), 12)
})

test("after a spike the membrane resets to rest", () => {
  const run = simulateLif([ev(5, 9), ev(5, 9, "B"), ev(40, 3)])
  expect(run.spikeTimes).toEqual([5])
  expect(voltageAt(run, 5)).toBeCloseTo(V_REST_MV, 12)
  expect(run.events[0].uPeak).toBeGreaterThanOrEqual(0)
  // later 3 mV EPSP starts from rest, not from the old depolarisation
  expect(run.events[2].uBefore).toBeCloseTo(0, 12)
})

test("no spike when the summed EPSPs stay below threshold", () => {
  const run = simulateLif([ev(10, 6), ev(14, 6, "B")])
  expect(run.fired).toBe(false)
  expect(run.spikeTimes).toEqual([])
  expect(run.peakMv).toBeLessThan(V_THRESHOLD_MV)
  const synapse = simulateSynapse(6, 6)
  expect(synapse.run.fired).toBe(false)
  // with leak, 6 + 6 never reaches 15: the no-leak sum (12) is an upper bound
  expect(synapse.run.peakMv - V_REST_MV).toBeLessThan(synapse.noLeakSumMv)
})

test("raising one synaptic weight raises the peak monotonically and can flip the outcome", () => {
  let previous = -Infinity
  let flipped = false
  let firedBefore = false
  for (let wB = 0; wB <= 12; wB += 0.5) {
    const peak = simulateSynapse(6, wB).run.peakMv
    expect(peak).toBeGreaterThanOrEqual(previous)
    previous = peak
    const fires = simulateSynapse(6, wB).run.fired
    if (firedBefore) expect(fires).toBe(true)
    if (fires && !firedBefore) flipped = true
    firedBefore = fires
    // closed form agrees
    expect(fires).toBe(firesAtDelta(6, wB, 4))
  }
  expect(flipped).toBe(true)
})

test("synapse weights do not move spike timing: the events stay at 10 and 14 ms", () => {
  const a = simulateSynapse(2, 3)
  const b = simulateSynapse(11, 12)
  expect(a.run.events.map((e) => e.t)).toEqual([10, 14])
  expect(b.run.events.map((e) => e.t)).toEqual([10, 14])
})

test("criticalDelta edge cases", () => {
  expect(criticalDelta(5, 5)).toBeNull() // 10 < 15: never fires
  expect(criticalDelta(15, 1)).toBe(Infinity) // fires alone
  expect(criticalDelta(7.5, 7.5)).toBeCloseTo(0, 12) // sum == threshold only at zero gap
  expect(firesAtDelta(7.5, 7.5, 0)).toBe(true)
})

test("arrival time = length / velocity and grows as velocity falls", () => {
  expect(arrivalTimeMs(15, 5)).toBeCloseTo(3, 12) // mm / (m/s) = ms
  expect(arrivalTimeMs(15, 50)).toBeCloseTo(0.3, 12)
  expect(arrivalTimeMs(15, 0.5)).toBeCloseTo(30, 12)
  let previous = 0
  for (const v of [50, 20, 10, 5, 2, 1, 0.5]) {
    const t = arrivalTimeMs(15, v)
    expect(t).toBeGreaterThan(previous)
    previous = t
  }
  expect(velocityFromLog(0)).toBe(1)
  expect(velocityFromLog(-10)).toBe(0.5)
  expect(velocityFromLog(10)).toBe(50)
})

test("myelin: weights stay fixed; timing alone flips the outcome at the critical delta", () => {
  const fast = simulateMyelin({ vB: 5 })
  expect(fast.delta).toBeCloseTo(0, 12)
  expect(fast.run.fired).toBe(true)
  expect(fast.wA).toBe(MYELIN_WEIGHT_MV)
  expect(fast.wB).toBe(MYELIN_WEIGHT_MV)

  const critical = fast.critical as number
  expect(critical).toBeCloseTo(TAU_M_MS * Math.log(1.5), 12)

  // Slowing path B (lower velocity) makes delta grow; the outcome flips once, monotonically.
  let lastDelta = -1
  let seenNoFire = false
  for (const v of [5, 4, 3, 2.5, 2, 1.8, 1.7, 1.6, 1.5, 1, 0.7, 0.5]) {
    const r = simulateMyelin({ vB: v })
    expect(r.delta).toBeGreaterThanOrEqual(lastDelta)
    lastDelta = r.delta
    expect(r.run.fired).toBe(r.delta <= critical)
    expect(r.run.fired).toBe(firesAtDelta(MYELIN_WEIGHT_MV, MYELIN_WEIGHT_MV, r.delta))
    if (!r.run.fired) seenNoFire = true
    else expect(seenNoFire).toBe(false)
    // identical weights in every run
    expect(r.wA).toBe(MYELIN_WEIGHT_MV)
    expect(r.wB).toBe(MYELIN_WEIGHT_MV)
  }
  expect(seenNoFire).toBe(true)

  // a single 9 mV EPSP is below threshold; only the coincidence fires
  expect(simulateMyelin({ vB: 5 }).alone.A.fired).toBe(false)
  expect(simulateMyelin({ vB: 5 }).alone.B.fired).toBe(false)
})

test("myelin: very fast B arrives before A and the delta is still symmetric", () => {
  const r = simulateMyelin({ vB: 50 })
  expect(r.tB).toBeCloseTo(0.3, 12)
  expect(r.tA).toBeCloseTo(3, 12)
  expect(r.delta).toBeCloseTo(2.7, 12)
  expect(r.run.fired).toBe(true)
  expect(r.run.events[0].source).toBe("B")
})

test("lifTrace is time-ordered, contains the jump and reset vertical segments", () => {
  const run = simulateLif([ev(10, 9), ev(10, 9, "B")])
  const trace = lifTrace(run, 40)
  for (let i = 1; i < trace.length; i += 1) expect(trace[i].t).toBeGreaterThanOrEqual(trace[i - 1].t)
  const atEvent = trace.filter((p) => p.t === 10).map((p) => p.v)
  expect(Math.max(...atEvent)).toBeGreaterThan(V_THRESHOLD_MV)
  expect(atEvent[atEvent.length - 1]).toBeCloseTo(V_REST_MV, 12)
})

test("eligibility trace: known values, zero before the coincidence, tau_e = 1 s", () => {
  expect(TAU_E_S).toBe(1)
  expect(eligibility(-0.5, [0])).toBe(0)
  expect(eligibility(0, [0])).toBeCloseTo(1, 12)
  expect(eligibility(1, [0])).toBeCloseTo(Math.exp(-1), 12)
  expect(eligibility(2, [0])).toBeCloseTo(Math.exp(-2), 12)
  expect(eligibility(1.5, [2])).toBe(0)
  expect(eligibility(3, [2])).toBeCloseTo(Math.exp(-1), 12)
  // traces add when coincidences repeat
  expect(eligibility(3, [0, 2])).toBeCloseTo(Math.exp(-3) + Math.exp(-1), 12)
  expect(eligibility(5, [])).toBe(0)
})

test("three-factor rule: delta-w strictly decreases with reward delay", () => {
  const [A, B] = CREDIT_SYNAPSES
  let previous = Infinity
  for (let tR = 0; tR <= 6; tR += 0.1) {
    const dw = weightChange("trace", tR, A.coincidences)
    expect(dw).toBeLessThan(previous)
    previous = dw
  }
  previous = Infinity
  for (let tR = 2; tR <= 6; tR += 0.1) {
    const dw = weightChange("trace", tR, B.coincidences)
    expect(dw).toBeLessThan(previous)
    previous = dw
  }
})

test("a never-active synapse gets exactly zero, for every reward time and both feedback modes", () => {
  const C = CREDIT_SYNAPSES.find((s) => s.id === "C")!
  for (let tR = 0; tR <= 6; tR += 0.1) {
    expect(weightChange("trace", tR, C.coincidences)).toBe(0)
    expect(weightChange("instant", tR, C.coincidences)).toBe(0)
  }
})

test("reward before the coincidence gives zero", () => {
  const B = CREDIT_SYNAPSES.find((s) => s.id === "B")!
  for (const tR of [0, 0.5, 1, 1.99]) expect(weightChange("trace", tR, B.coincidences)).toBe(0)
  expect(weightChange("trace", 2, B.coincidences)).toBeCloseTo(1, 12)
})

test("same scalar reward, different local eligibility: A and B differ, C is zero", () => {
  const dw = CREDIT_SYNAPSES.map((s) => weightChange("trace", 2.5, s.coincidences))
  expect(dw[0]).toBeCloseTo(Math.exp(-2.5), 12)
  expect(dw[1]).toBeCloseTo(Math.exp(-0.5), 12)
  expect(dw[2]).toBe(0)
})

test("without a trace, reward only changes synapses active at that very moment", () => {
  const [A, B] = CREDIT_SYNAPSES
  expect(weightChange("instant", 0, A.coincidences)).toBe(1)
  expect(weightChange("instant", 2, B.coincidences)).toBe(1)
  expect(weightChange("instant", 0, B.coincidences)).toBe(0)
  for (const tR of [0.1, 0.5, 1, 1.5, 2.5, 4, 6]) {
    expect(weightChange("instant", tR, A.coincidences)).toBe(0)
    expect(weightChange("instant", tR, B.coincidences)).toBe(0)
  }
  expect(activity(ACTIVITY_WINDOW_S * 2, [0])).toBe(0)
})

test("plot traces are time-ordered", () => {
  for (const mode of ["trace", "instant"] as const) {
    const points = eligibilityTrace(mode, [0, 2], 8)
    for (let i = 1; i < points.length; i += 1) expect(points[i].t).toBeGreaterThanOrEqual(points[i - 1].t)
    expect(points[points.length - 1].t).toBeCloseTo(8, 9)
  }
})
