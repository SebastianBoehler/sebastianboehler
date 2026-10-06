"use client"

import { useState } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { BarRows } from "@/components/blog/visuals/chart/BarRows"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import { linear, linePath } from "@/lib/viz/scale"

/**
 * Data: Roediger & Karpicke (2006), "Test-enhanced learning: taking memory tests improves
 * long-term retention", Psychological Science 17(3), 249-255. Percent of idea units recalled
 * from prose passages (free recall, no feedback). Experiment 1: restudy vs test, final test after
 * 5 min / 2 days / 1 week. Experiment 2: SSSS / SSST / STTT, final test after 5 min / 1 week,
 * plus students' 1-7 prediction of how well they would remember after a week.
 */
const DELAYS = [
  { label: "5 minutes", short: "5 min" },
  { label: "2 days", short: "2 days" },
  { label: "1 week", short: "1 week" },
] as const

const EXP1 = {
  restudy: [81, 54, 42],
  test: [75, 68, 56],
} as const

const EXP2 = [
  { code: "SSSS", meaning: "read 4 times", fiveMin: 83, week: 40, predicted: 4.8 },
  { code: "SSST", meaning: "read 3 times, then 1 recall test", fiveMin: 78, week: 56, predicted: 4.2 },
  { code: "STTT", meaning: "read once, then 3 recall tests", fiveMin: 71, week: 61, predicted: 4.0 },
] as const

export default function TestingEffectVisual() {
  const [delay, setDelay] = useState(0)
  const restudy = EXP1.restudy[delay]
  const test = EXP1.test[delay]
  const diff = test - restudy
  const winner = diff > 0 ? "recall testing" : "restudying"

  const summary = `After ${DELAYS[delay].label}: restudying gave ${restudy}% recall and recall testing gave ${test}%. ${winner[0].toUpperCase()}${winner.slice(1)} is ahead by ${Math.abs(diff)} points.`

  return (
    <ConceptLab
      title="Rereading wins today. Testing wins next week."
      description="Real results from the classic testing-effect experiment. Move the final-test delay and watch the two strategies swap places."
      methodology="Real data · Roediger & Karpicke 2006"
      insights={[
        {
          label: "What happened",
          body: "Students read a short prose passage, then either read it again or tried to recall it from memory with no answers shown. Both groups were tested later by free recall.",
          tone: "accent",
        },
        {
          label: "Why it is easy to get wrong",
          body: "Right after studying, rereading looks better and feels better. The advantage of retrieval only appears when you wait. In experiment 2 the group that reread the most also predicted they would remember best.",
          tone: "intervention",
        },
        {
          label: "Limits",
          body: "Prose passages, undergraduates, free recall, no feedback after the recall test. It supports retrieval practice in general, not any particular study app.",
        },
      ]}
      caption="Data from Roediger & Karpicke (2006), Psychological Science 17(3):249–255; experiment 1 (n = 30 per cell) and experiment 2. The x-axis is categorical, not to scale. “Percent recalled” is the share of idea units in the passage."
    >
      <div className="space-y-8">
        <Slider
          label="Final test after"
          value={delay}
          min={0}
          max={2}
          step={1}
          onChange={setDelay}
          format={(v) => DELAYS[v].label}
        />

        <p className="sr-only" aria-live="polite">
          {summary}
        </p>

        <div>
          <p className="lab-kicker">Experiment 1 · percent of the passage recalled</p>
          <Legend
            items={[
              { label: "Read again (restudy)", series: 2, kind: "line" },
              { label: "Recall from memory (test)", series: 1, kind: "line" },
            ]}
          />
          <Chart
            label={`Percent of the passage recalled by final-test delay. ${summary}`}
            height={260}
            margin={{ top: 14, right: 90, bottom: 38, left: 52 }}
          >
            {({ width, height }) => {
              const sx = linear([0, 2], [24, width - 24])
              const sy = linear([30, 90], [height, 0])
              const toPoints = (values: readonly number[]) =>
                values.map((v, i) => [sx(i), sy(v)] as const)
              return (
                <>
                  <YAxis
                    scale={sy}
                    ticks={[30, 50, 70, 90]}
                    format={(v) => `${v}%`}
                    label="recalled"
                    grid
                    gridWidth={width}
                  />
                  <XAxis scale={sx} y={height} ticks={[0, 1, 2]} format={(i) => DELAYS[i].short} />
                  <line
                    className="viz-stroke-ink"
                    x1={sx(delay)}
                    x2={sx(delay)}
                    y1={0}
                    y2={height}
                    strokeOpacity={0.35}
                    strokeWidth={1}
                  />
                  <path className="viz-line viz-stroke-2" d={linePath(toPoints(EXP1.restudy))} />
                  <path className="viz-line viz-stroke-1" d={linePath(toPoints(EXP1.test))} />
                  {EXP1.restudy.map((v, i) => (
                    <circle key={`r${i}`} className="viz-dot viz-fill-2" cx={sx(i)} cy={sy(v)} r={i === delay ? 6 : 4.5} />
                  ))}
                  {EXP1.test.map((v, i) => (
                    <circle key={`t${i}`} className="viz-dot viz-fill-1" cx={sx(i)} cy={sy(v)} r={i === delay ? 6 : 4.5} />
                  ))}
                  <text className="viz-text-strong" x={sx(2) + 12} y={sy(EXP1.test[2]) + 4}>
                    Test {EXP1.test[2]}%
                  </text>
                  <text className="viz-text-strong" x={sx(2) + 12} y={sy(EXP1.restudy[2]) + 4}>
                    Reread {EXP1.restudy[2]}%
                  </text>
                </>
              )
            }}
          </Chart>
          <dl className="lab-readout mt-2">
            <div>
              <dt>Read again</dt>
              <dd>{restudy}%</dd>
            </div>
            <div>
              <dt>Recall test</dt>
              <dd>{test}%</dd>
            </div>
            <div>
              <dt>Ahead</dt>
              <dd>
                {diff > 0 ? "testing" : "rereading"}, by {Math.abs(diff)} points
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-[var(--lab-rule)] pt-6">
          <p className="lab-kicker">Experiment 2 · what students believed vs what happened</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">
            S = a study period (read), T = a recall test. Students rated, on a 1–7 scale, how well they expected to remember after a week.
          </p>
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            <div>
              <p className="lab-kicker">Recalled after one week</p>
              <BarRows
                label="Percent recalled after one week by condition"
                max={100}
                unit="%"
                labelWidth="3.5rem"
                rows={EXP2.map((row) => ({
                  label: row.code,
                  value: row.week,
                  display: `${row.week}%`,
                  note: row.meaning,
                  series: row.code === "SSSS" ? 2 : 1,
                }))}
              />
            </div>
            <div>
              <p className="lab-kicker">Predicted (1–7)</p>
              <BarRows
                label="Predicted one-week memory by condition, scale 1 to 7"
                max={7}
                labelWidth="3.5rem"
                rows={EXP2.map((row) => ({
                  label: row.code,
                  value: row.predicted,
                  display: row.predicted.toFixed(1),
                  note: row.code === "SSSS" ? "most confident, remembered least" : undefined,
                  series: "ink",
                }))}
              />
            </div>
          </div>
        </div>

        <ChartTable
          caption="Recall percentages from Roediger and Karpicke 2006, experiments 1 and 2"
          columns={["Condition", "5 minutes", "2 days", "1 week", "Predicted (1–7)"]}
          rows={[
            ["Exp 1 · read again", `${EXP1.restudy[0]}%`, `${EXP1.restudy[1]}%`, `${EXP1.restudy[2]}%`, "—"],
            ["Exp 1 · recall test", `${EXP1.test[0]}%`, `${EXP1.test[1]}%`, `${EXP1.test[2]}%`, "—"],
            ...EXP2.map((row) => [
              `Exp 2 · ${row.code} (${row.meaning})`,
              `${row.fiveMin}%`,
              "—",
              `${row.week}%`,
              row.predicted.toFixed(1),
            ]),
          ]}
        />
      </div>
    </ConceptLab>
  )
}
