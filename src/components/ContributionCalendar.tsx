import type { ContributionYear } from "@/lib/github"

const LEVEL_CLASSES = [
  "bg-[#ebedf0] dark:bg-[#161b22]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
] as const

export default function ContributionCalendar({
  years,
}: {
  years: ContributionYear[]
}) {
  return (
    <div className="border border-[#d0d7de] bg-white p-5 text-[#1f2328] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-white sm:p-7">
      <div className="flex flex-col gap-3 border-b border-[#d8dee4] pb-5 dark:border-[#21262d] sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#656d76] dark:text-[#7d8590]">
            GitHub Activity
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#1f2328] dark:text-[#f0f6fc]">
            Contribution history across all years
          </h2>
          <p className="max-w-2xl text-sm text-[#57606a] dark:text-[#8b949e]">
            Same GitHub-style calendar orientation, with weekdays running vertically inside each
            week column and years stacked for comparison.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#57606a] dark:text-[#8b949e]">
          <span>Less</span>
          {LEVEL_CLASSES.map((levelClass) => (
            <span key={levelClass} className={`h-2.5 w-2.5 rounded-[2px] ${levelClass}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {years.map((year) => (
          <div
            key={year.year}
            className="border border-[#d8dee4] bg-white p-4 dark:border-[#21262d] dark:bg-[#0b1118] sm:p-5"
          >
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1f2328] dark:text-[#f0f6fc]">{year.year}</h3>
                <p className="text-sm text-[#57606a] dark:text-[#8b949e]">
                  {year.total.toLocaleString("en-US")} contributions
                </p>
              </div>
            </div>

            <div>
              <div className="grid w-full grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-[2px] sm:gap-[3px]">
                {Array.from({ length: 53 * 7 }, (_, index) => {
                  const week = Math.floor(index / 7)
                  const day = index % 7
                  const cell = year.cells.find((entry) => entry.week === week && entry.day === day)
                  const levelClass = LEVEL_CLASSES[cell?.level ?? 0]

                  return (
                    <div
                      key={`${year.year}-${week}-${day}`}
                      className={`aspect-square w-full rounded-[1px] min-[520px]:rounded-[2px] ${levelClass}`}
                      style={{ gridColumn: week + 1, gridRow: day + 1 }}
                      title={
                        cell
                          ? `${cell.date} · level ${cell.level}`
                          : `${year.year} · no visible contribution data`
                      }
                    />
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
