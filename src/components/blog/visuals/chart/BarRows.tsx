import type React from "react"
import { formatNumber } from "@/lib/viz/scale"

export interface BarRow {
  label: string
  value: number
  /** Text shown at the bar tip. Defaults to the formatted value. */
  display?: string
  note?: string
  /** 1 = blue, 2 = orange, "ink" = neutral. Colour is paired with the label, never the only cue. */
  series?: 1 | 2 | "ink"
}

/**
 * Horizontal bars from a true zero baseline. Thin (<=24px), 4px rounded data end,
 * value at the tip, one shared scale so lengths are comparable across rows.
 */
export function BarRows({
  rows,
  max,
  unit = "",
  label,
  labelWidth,
}: {
  rows: readonly BarRow[]
  max?: number
  unit?: string
  label: string
  /** CSS length for the label column; default suits sentence-length labels. */
  labelWidth?: string
}) {
  const top = max ?? Math.max(...rows.map((row) => row.value), 1)
  return (
    <ul
      className="viz-bars"
      aria-label={label}
      style={labelWidth ? ({ "--bar-label": labelWidth } as React.CSSProperties) : undefined}
    >
      {rows.map((row) => (
        <li key={row.label}>
          <span className="viz-bar-label">{row.label}</span>
          <span className="viz-bar-track" aria-hidden="true">
            <span
              className={`viz-bar viz-bar-${row.series ?? 1}`}
              style={{ width: `${Math.max(0.5, (row.value / top) * 100)}%` }}
            />
          </span>
          <span className="viz-bar-value">
            {row.display ?? `${formatNumber(row.value, 2)}${unit}`}
          </span>
          {row.note ? <span className="viz-bar-note">{row.note}</span> : null}
        </li>
      ))}
    </ul>
  )
}
