import type { CSSProperties } from "react"
import type { ContributionArcState, ContributionYear } from "@/lib/github-types"

const CELLS_PER_YEAR = 53 * 7

function cellStyle(level: number): CSSProperties {
  if (level === 0) return { backgroundColor: "var(--line)" }

  return {
    backgroundColor: `color-mix(in oklch, var(--accent) ${30 + level * 15}%, var(--surface))`,
  }
}

function YearArc({ data }: { data: ContributionYear }) {
  const contributionLabel = data.total === 1 ? "contribution" : "contributions"

  return (
    <li className="space-y-4 border-b border-[var(--line)] py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div>
        <h3 className="font-semibold">{data.year}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {data.total.toLocaleString("en-US")} {contributionLabel}
        </p>
      </div>

      <div
        className="grid w-full max-w-2xl grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-px"
        aria-hidden="true"
      >
        {Array.from({ length: CELLS_PER_YEAR }, (_, index) => {
          const week = Math.floor(index / 7)
          const day = index % 7
          const cell = data.cells.find((entry) => entry.week === week && entry.day === day)

          return (
            <span
              key={`${data.year}-${week}-${day}`}
              className="aspect-square min-w-0 rounded-[1px]"
              style={{ gridColumn: week + 1, gridRow: day + 1, ...cellStyle(cell?.level ?? 0) }}
              aria-hidden="true"
            />
          )
        })}
      </div>
    </li>
  )
}

export function ContributionArc({ state }: { state: ContributionArcState }) {
  return (
    <section aria-labelledby="contribution-heading" className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-3 lg:col-span-4">
        <h2 id="contribution-heading" className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Contribution arc
        </h2>
        <p className="max-w-md text-base leading-7 text-[var(--muted)]">
          A quiet record of sustained public building from 2017 onward.
        </p>
      </div>

      <div className="min-w-0 lg:col-span-8">
        {state.status === "ready" ? (
          <ol className="min-w-0">
            {state.years.map((year) => (
              <YearArc key={year.year} data={year} />
            ))}
          </ol>
        ) : (
          <p role="status" className="border-l-2 border-[var(--line)] pl-5 text-base leading-7 text-[var(--muted)]">
            {state.message}
          </p>
        )}
      </div>
    </section>
  )
}
