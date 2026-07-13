"use client"

import type { ReactNode } from "react"

export interface Choice<T extends string> {
  id: T
  label: string
}

export function SegmentedChoice<T extends string>({
  label,
  choices,
  value,
  onChange,
}: {
  label: string
  choices: readonly Choice<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="lab-segmented" role="group" aria-label={label}>
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          aria-pressed={value === choice.id}
          onClick={() => onChange(choice.id)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}

export function TokenStrip({
  label,
  tokens,
}: {
  label: string
  tokens: readonly { text: string; tone?: "default" | "intervention" | "accent" }[]
}) {
  return (
    <div className="lab-token-group">
      <p className="lab-kicker">{label}</p>
      <div className="lab-token-strip" aria-label={tokens.map((token) => token.text).join(" ")}>
        {tokens.map((token, index) => (
          <span key={`${token.text}-${index}`} data-tone={token.tone ?? "default"}>
            {token.text}
          </span>
        ))}
      </div>
    </div>
  )
}

export type QualitativeFit = "strong" | "plausible" | "weak"

export function QualitativeRows({
  label,
  rows,
}: {
  label: string
  rows: readonly {
    label: string
    fit: QualitativeFit
    note?: ReactNode
    selected?: boolean
  }[]
}) {
  return (
    <div className="lab-qualitative">
      <p className="lab-kicker">{label}</p>
      <div>
        {rows.map((row) => (
          <div key={row.label} className="lab-qualitative-row" data-selected={row.selected || undefined}>
            <span className="lab-qualitative-label">{row.label}</span>
            <span className="lab-fit" data-fit={row.fit}>
              <span aria-hidden="true" />
              {row.fit === "strong" ? "strong fit" : row.fit}
            </span>
            {row.note ? <span className="lab-row-note">{row.note}</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Annotation({
  label,
  children,
  tone = "default",
}: {
  label: string
  children: ReactNode
  tone?: "default" | "intervention" | "accent"
}) {
  return (
    <div className="lab-annotation" data-tone={tone}>
      <p className="lab-kicker">{label}</p>
      <div>{children}</div>
    </div>
  )
}

export function ComparisonRows({
  rows,
}: {
  rows: readonly { label: string; baseline: ReactNode; changed: ReactNode }[]
}) {
  return (
    <div className="lab-comparison" role="table" aria-label="Comparison">
      <div className="lab-comparison-header" role="row">
        <span role="columnheader">Question</span>
        <span role="columnheader">Baseline</span>
        <span role="columnheader">Changed</span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className="lab-comparison-row" role="row">
          <strong role="rowheader">{row.label}</strong>
          <span role="cell">{row.baseline}</span>
          <span role="cell">{row.changed}</span>
        </div>
      ))}
    </div>
  )
}
