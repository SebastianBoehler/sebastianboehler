"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import type { LinearScale } from "@/lib/viz/scale"
import { formatNumber } from "@/lib/viz/scale"

export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

const DEFAULT_MARGIN: Margin = { top: 12, right: 18, bottom: 38, left: 48 }

/** Measure an element's width so charts lay out in real pixels (text stays legible on phones). */
export function useMeasuredWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const next = Math.round(el.getBoundingClientRect().width)
      if (next > 0) setWidth(next)
    }
    update()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}

interface ChartProps {
  /** Accessible name; also the one-line statement of what is plotted. */
  label: string
  height?: number
  margin?: Partial<Margin>
  /** Called with the inner plot size; draw in inner coordinates (0,0 is the top-left of the plot area). */
  children: (inner: { width: number; height: number }) => ReactNode
  className?: string
}

export function Chart({ label, height = 280, margin, className, children }: ChartProps) {
  const [ref, width] = useMeasuredWidth<HTMLDivElement>()
  // Math.sin/exp/log can differ in the last digit between Node (server) and the browser, which would
  // trip a hydration mismatch on unrounded SVG coordinates. The plot body is drawn after mount; the
  // svg keeps its full height so nothing shifts.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const m = { ...DEFAULT_MARGIN, ...margin }
  const innerWidth = Math.max(40, width - m.left - m.right)
  const innerHeight = Math.max(40, height - m.top - m.bottom)

  return (
    <div ref={ref} className={`viz-chart ${className ?? ""}`}>
      <svg width={width} height={height} role="img" aria-label={label}>
        <g transform={`translate(${m.left},${m.top})`}>
          {mounted ? children({ width: innerWidth, height: innerHeight }) : null}
        </g>
      </svg>
    </div>
  )
}

export function XAxis({
  scale,
  y,
  ticks,
  format = (v) => formatNumber(v),
  label,
  grid,
  gridHeight,
}: {
  scale: LinearScale
  y: number
  ticks?: number[]
  format?: (value: number) => string
  label?: string
  grid?: boolean
  gridHeight?: number
}) {
  const values = ticks ?? scale.ticks(6)
  const [r0, r1] = scale.range
  return (
    <g className="viz-axis" aria-hidden="true">
      <line className="viz-axis-line" x1={Math.min(r0, r1)} x2={Math.max(r0, r1)} y1={y} y2={y} />
      {values.map((tick) => (
        <g key={tick} transform={`translate(${scale(tick)},0)`}>
          {grid && gridHeight ? <line className="viz-grid" y1={y} y2={y - gridHeight} /> : null}
          <line className="viz-tick" y1={y} y2={y + 4} />
          <text className="viz-text" y={y + 17} textAnchor="middle">
            {format(tick)}
          </text>
        </g>
      ))}
      {label ? (
        <text className="viz-text viz-axis-title" x={(r0 + r1) / 2} y={y + 34} textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  )
}

export function YAxis({
  scale,
  x = 0,
  ticks,
  format = (v) => formatNumber(v),
  label,
  grid,
  gridWidth,
}: {
  scale: LinearScale
  x?: number
  ticks?: number[]
  format?: (value: number) => string
  label?: string
  grid?: boolean
  gridWidth?: number
}) {
  const values = ticks ?? scale.ticks(5)
  const [r0, r1] = scale.range
  return (
    <g className="viz-axis" aria-hidden="true">
      {values.map((tick) => (
        <g key={tick} transform={`translate(0,${scale(tick)})`}>
          {grid && gridWidth ? <line className="viz-grid" x1={x} x2={x + gridWidth} /> : null}
          <text className="viz-text" x={x - 8} dy="0.32em" textAnchor="end">
            {format(tick)}
          </text>
        </g>
      ))}
      {label ? (
        <text
          className="viz-text viz-axis-title"
          transform={`translate(${x - 38},${(r0 + r1) / 2}) rotate(-90)`}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  )
}

/** Small colour key: always paired with a swatch, never colour-only (text stays in ink tokens). */
export function Legend({
  items,
}: {
  items: readonly { label: string; series: 1 | 2 | 3 | "ink" | "muted"; kind?: "line" | "dot" | "dash" | "band" }[]
}) {
  return (
    <ul className="viz-legend">
      {items.map((item) => (
        <li key={item.label}>
          <svg width="22" height="12" aria-hidden="true">
            {item.kind === "dot" ? (
              <circle cx="11" cy="6" r="4" className={`viz-fill-${item.series}`} />
            ) : item.kind === "band" ? (
              <rect x="1" y="1" width="20" height="10" rx="2" className={`viz-fill-${item.series} viz-wash`} />
            ) : (
              <line
                x1="1"
                x2="21"
                y1="6"
                y2="6"
                className={`viz-stroke-${item.series}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={item.kind === "dash" ? "4 3" : undefined}
              />
            )}
          </svg>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

/** Table-view twin: every chart's numbers reachable without hover, colour, or pointer. */
export function ChartTable({
  summary = "View data as a table",
  caption,
  columns,
  rows,
}: {
  summary?: string
  caption: string
  columns: readonly string[]
  rows: readonly (readonly (string | number)[])[]
}) {
  return (
    <details className="viz-table-twin">
      <summary>{summary}</summary>
      <div className="viz-table-scroll">
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={j}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
