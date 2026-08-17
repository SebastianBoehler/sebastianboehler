import { profile } from "@/content/profile"
import type { ContributionArcState, ContributionYear } from "@/lib/github-types"

const CELL_SIZE = 3
const CELL_STEP = 4
const DAYS_PER_WEEK = 7
const LEVEL_OPACITY = [1, 0.45, 0.6, 0.75, 0.9] as const

function levelPath(data: ContributionYear, level: number) {
  return data.cells
    .filter((cell) => cell.level === level)
    .map((cell) => `M${cell.week * CELL_STEP} ${cell.day * CELL_STEP}h${CELL_SIZE}v${CELL_SIZE}h-${CELL_SIZE}Z`)
    .join("")
}

function YearArc({ data }: { data: ContributionYear }) {
  const contributionLabel = data.total === 1 ? "contribution" : "contributions"
  const columns = Math.max(1, ...data.cells.map((cell) => cell.week + 1))
  const width = columns * CELL_STEP - 1
  const height = DAYS_PER_WEEK * CELL_STEP - 1

  return (
    <li className="space-y-4 border-b border-[var(--line)] py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div>
        <h3 className="font-semibold">{data.year}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {data.total.toLocaleString("en-US")} {contributionLabel}
        </p>
      </div>

      <svg
        className="block h-auto w-full max-w-2xl"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMid meet"
        data-contribution-columns={columns}
        aria-hidden="true"
        focusable="false"
        shapeRendering="crispEdges"
      >
        {[0, 1, 2, 3, 4].map((level) => {
          const path = levelPath(data, level)
          return path ? (
            <path
              key={level}
              d={path}
              fill={level === 0 ? "var(--line)" : "var(--accent)"}
              fillOpacity={level === 0 ? undefined : LEVEL_OPACITY[level]}
            />
          ) : null
        })}
      </svg>
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
          {profile.contributionArc}
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
