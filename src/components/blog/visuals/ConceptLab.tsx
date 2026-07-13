"use client"

import type { CSSProperties, ReactNode } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"

export interface LabStep {
  label: string
  shortLabel?: string
}

export interface LabInsight {
  label: string
  body: ReactNode
  tone?: "default" | "intervention" | "accent"
}

interface ConceptLabProps {
  title: string
  description: string
  methodology: string
  children: ReactNode
  caption: ReactNode
  insights?: readonly LabInsight[]
  steps?: readonly LabStep[]
  activeStep?: number
  onStepChange?: (index: number) => void
  headerActions?: ReactNode
  footer?: ReactNode
}

export function ConceptLab({
  title,
  description,
  methodology,
  children,
  caption,
  insights,
  steps,
  activeStep = 0,
  onStepChange,
  headerActions,
  footer,
}: ConceptLabProps) {
  const hasSteps = Boolean(steps?.length && onStepChange)

  return (
    <figure className="concept-lab">
      <header className="lab-header">
        <div>
          <h2 className="lab-title">{title}</h2>
          <p className="lab-description">{description}</p>
        </div>
        <div className="lab-header-actions">
          {headerActions}
          <span className="lab-methodology">{methodology}</span>
          {hasSteps ? (
            <div className="lab-step-arrows" role="group" aria-label="Move through explanation">
              <button
                type="button"
                onClick={() => onStepChange?.(activeStep - 1)}
                disabled={activeStep === 0}
              >
                <ArrowLeftIcon aria-hidden="true" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => onStepChange?.(activeStep + 1)}
                disabled={activeStep === (steps?.length ?? 1) - 1}
              >
                <span>Next</span>
                <ArrowRightIcon aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {hasSteps ? (
        <ol
          className="lab-step-rail"
          aria-label="Explanation steps"
          style={{ "--lab-step-count": steps?.length } as CSSProperties}
        >
          {steps?.map((step, index) => (
            <li key={step.label}>
              <button
                type="button"
                aria-current={index === activeStep ? "step" : undefined}
                onClick={() => onStepChange?.(index)}
              >
                <span className="lab-step-number">{index + 1}</span>
                <span className="lab-step-label">
                  <span className="sm:hidden">{step.shortLabel ?? step.label}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      <div className={insights?.length ? "lab-layout" : "lab-layout lab-layout-full"}>
        <div className="lab-canvas">{children}</div>
        {insights?.length ? <InsightRail insights={insights} /> : null}
      </div>

      {footer ? <div className="lab-footer">{footer}</div> : null}
      <figcaption className="lab-caption">{caption}</figcaption>
    </figure>
  )
}

function InsightRail({ insights }: { insights: readonly LabInsight[] }) {
  return (
    <aside className="lab-insight-rail" aria-label="Explanation">
      {insights.map((insight) => (
        <section key={insight.label} data-tone={insight.tone ?? "default"}>
          <h3>{insight.label}</h3>
          <div>{insight.body}</div>
        </section>
      ))}
    </aside>
  )
}
