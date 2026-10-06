"use client"

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { ConceptLab } from "@/components/blog/visuals/ConceptLab"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { parameterGolfRecords, type GolfRecord } from "@/components/blog/data/parameterGolfRecords"
import { linear, stepPath, formatNumber } from "@/lib/viz/scale"

const AIDEN_HANDLE = "dexhunter"
const BASELINE_AUTHOR = "Baseline"
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"]

function dayNumber(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return Date.UTC(y, m - 1, d) / 86_400_000
}

function formatDay(day: number) {
  const date = new Date(day * 86_400_000)
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`
}

interface Point extends GolfRecord {
  day: number
  best: number
  aiden: boolean
  frontier: boolean
}

function buildPoints(): Point[] {
  let best = Infinity
  return parameterGolfRecords.map((record) => {
    const frontier = record.bpb < best
    best = Math.min(best, record.bpb)
    return {
      ...record,
      day: dayNumber(record.date),
      best,
      aiden: record.author === AIDEN_HANDLE,
      frontier,
    }
  })
}

export default function ParameterGolfFrontierVisual() {
  const points = useMemo(buildPoints, [])
  const [selected, setSelected] = useState(points.length - 1)
  const plotRef = useRef<SVGRectElement>(null)

  const first = points[0]
  const last = points[points.length - 1]
  const records = points.filter((p) => p.author !== BASELINE_AUTHOR)
  const aidenCount = records.filter((p) => p.aiden).length
  const authors = new Set(records.map((p) => p.author)).size
  const active = points[selected]
  const aidenFirstIndex = points.findIndex((p) => p.aiden)
  const aidenLastIndex = points.length - 1 - [...points].reverse().findIndex((p) => p.aiden)

  const x = linear([first.day - 1, last.day + 1], [0, 1])
  const rows = points.map((p, index) => [
    p.date,
    p.author,
    p.name,
    p.bpb.toFixed(4),
    index === 0 ? "—" : `${(p.bpb - points[index - 1].best).toFixed(4)}`,
  ])

  const label = `Parameter Golf main-track records from ${formatDay(first.day)} to ${formatDay(last.day)}: the best score improved from ${first.bpb} to ${last.bpb} bits per byte across ${records.length} records by ${authors} contributors; ${aidenCount} are from the account Weco identifies as Aiden.`

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      setSelected((i) => Math.min(points.length - 1, i + 1))
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      setSelected((i) => Math.max(0, i - 1))
    }
  }

  return (
    <ConceptLab
      title="How the frontier actually moved"
      description="Every accepted main-track record in the public leaderboard, by date. Hover or use the arrow keys to read a record."
      methodology="Real data · OpenAI Parameter Golf README"
      insights={[
        {
          label: "What this shows",
          body: `${records.length} accepted records from ${authors} different contributors moved the best score from ${first.bpb.toFixed(4)} to ${last.bpb.toFixed(4)} bits per byte in about six weeks. No single account owns the curve.`,
          tone: "accent",
        },
        {
          label: "Aiden’s share",
          body: `${aidenCount} of ${records.length} records (${Math.round((aidenCount / records.length) * 100)}%) came from the \`${AIDEN_HANDLE}\` account that Weco identifies as Aiden. The repository itself only lists the handle; the link to Aiden is Weco’s statement.`,
          tone: "intervention",
        },
        {
          label: "Reading rule",
          body: "Lower is better, so the chart is flipped: improvement goes up. A step is a new best; dots on the line are the records that set it.",
        },
      ]}
      caption="Source: the leaderboard tables in github.com/openai/parameter-golf (README at commit f5c0793, 4 May 2026). Scores are the README’s official score column. Non-record (unlimited-compute) submissions are omitted. The final record (1 May) was added after the 30 April deadline under a grace policy. Late records improve on the previous best by only about 0.001 bpb."
    >
      <div className="space-y-5">
        <Legend
          items={[
            { label: "Best score so far", series: "ink", kind: "line" },
            { label: `Record by ${AIDEN_HANDLE} (Aiden, per Weco)`, series: 1, kind: "dot" },
            { label: "Record by anyone else", series: "muted", kind: "dot" },
          ]}
        />

        <Chart label={label} height={360} margin={{ top: 14, right: 22, bottom: 40, left: 56 }}>
          {({ width, height }) => {
            const sx = linear([first.day - 1, last.day + 1], [0, width])
            // flipped: lower bpb is better, so better is up
            const sy = linear([1.235, 1.05], [height, 0])
            const stepPoints = points.map((p) => [sx(p.day), sy(p.best)] as const)
            const tickDays: number[] = []
            for (let d = dayNumber("2026-03-20"); d <= last.day + 1; d += width < 520 ? 14 : 7) tickDays.push(d)

            const onMove = (event: PointerEvent<SVGRectElement>) => {
              const rect = plotRef.current?.getBoundingClientRect()
              if (!rect) return
              const px = event.clientX - rect.left
              const py = event.clientY - rect.top
              let nearest = 0
              let bestDistance = Infinity
              points.forEach((p, i) => {
                const distance = Math.hypot(sx(p.day) - px, (sy(p.bpb) - py) * 0.6)
                if (distance < bestDistance) {
                  bestDistance = distance
                  nearest = i
                }
              })
              setSelected(nearest)
            }

            return (
              <>
                <YAxis
                  scale={sy}
                  ticks={[1.2, 1.16, 1.12, 1.08]}
                  format={(v) => v.toFixed(2)}
                  label="val_bpb (lower is better)"
                  grid
                  gridWidth={width}
                />
                <XAxis
                  scale={sx}
                  y={height}
                  ticks={tickDays}
                  format={formatDay}
                />
                <path className="viz-line viz-stroke-ink" d={stepPath(stepPoints)} />
                {points.map((p, i) => (
                  <circle
                    key={`${p.date}-${p.name}`}
                    className={`viz-dot ${p.aiden ? "viz-fill-1" : "viz-fill-muted"}`}
                    cx={sx(p.day)}
                    cy={sy(p.bpb)}
                    r={p.aiden ? 5.5 : 4}
                    fillOpacity={p.frontier ? 1 : 0.35}
                    stroke={i === selected ? "var(--viz-ink)" : undefined}
                    strokeWidth={i === selected ? 2 : undefined}
                  />
                ))}
                <text className="viz-text" x={sx(first.day) + 8} y={sy(first.bpb) - 10}>
                  Baseline {first.bpb.toFixed(4)}
                </text>
                <text className="viz-text-strong" x={sx(points[aidenFirstIndex].day) - 4} y={sy(points[aidenFirstIndex].bpb) + 20} textAnchor="start">
                  Aiden’s first
                </text>
                <text className="viz-text" x={sx(last.day) - 6} y={sy(last.bpb) - 12} textAnchor="end">
                  {last.bpb.toFixed(4)}
                </text>
                <text className="viz-text" x={sx(points[aidenLastIndex].day) + 8} y={sy(points[aidenLastIndex].bpb) + 18}>
                  Aiden’s seventh
                </text>
                <rect
                  ref={plotRef}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill="transparent"
                  tabIndex={0}
                  role="group"
                  aria-label="Records plot. Use left and right arrow keys to step through records."
                  onPointerMove={onMove}
                  onKeyDown={onKey}
                  style={{ cursor: "crosshair", outlineOffset: -2 }}
                />
              </>
            )
          }}
        </Chart>

        <div aria-live="polite" className="lab-annotation" data-tone={active.aiden ? "accent" : "default"}>
          <p className="lab-kicker">
            {active.date} · {active.author}
            {active.aiden ? " (Aiden, per Weco)" : ""}
          </p>
          <div>
            <strong className="text-[var(--lab-ink)]">{active.name}</strong> — {active.bpb.toFixed(4)} bpb
            {selected > 0
              ? `, ${formatNumber(points[selected - 1].best - active.bpb, 4)} below the previous best`
              : ""}
            {!active.frontier ? " (not a new best at the time it was added)" : ""}
            {active.afterDeadline ? " (added after the 30 April deadline under a grace policy)" : ""}.{" "}
            <a className="underline underline-offset-2" href={active.url} target="_blank" rel="noreferrer">
              Record write-up
            </a>
          </div>
        </div>

        <ChartTable
          caption="All accepted main-track records in date order with score and change from the previous best"
          columns={["Date", "Contributor", "Technique", "val_bpb", "Δ vs previous best"]}
          rows={rows}
        />
      </div>
    </ConceptLab>
  )
}
