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
    <section className="space-y-5 border-t border-gray-200 pt-10 text-[#1f2328] dark:border-gray-800 dark:text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-950 dark:text-white">GitHub Activity</h2>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Contribution history across all years.
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

      <div className="overflow-x-auto">
        <div className="min-w-[760px] space-y-3">
          {years.map((year) => (
            <div
              key={year.year}
              className="grid grid-cols-[96px_1fr] items-start gap-4 border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-900"
            >
              <div className="pt-0.5">
                <h3 className="text-sm font-semibold text-[#1f2328] dark:text-[#f0f6fc]">{year.year}</h3>
                <p className="text-xs text-[#57606a] dark:text-[#8b949e]">
                  {year.total.toLocaleString("en-US")} contributions
                </p>
              </div>

              <div className="grid grid-cols-[repeat(53,8px)] grid-rows-7 gap-[2px]">
                {Array.from({ length: 53 * 7 }, (_, index) => {
                  const week = Math.floor(index / 7)
                  const day = index % 7
                  const cell = year.cells.find((entry) => entry.week === week && entry.day === day)
                  const levelClass = LEVEL_CLASSES[cell?.level ?? 0]

                  return (
                    <div
                      key={`${year.year}-${week}-${day}`}
                      className={`h-2 w-2 rounded-[1px] ${levelClass}`}
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
          ))}
        </div>
      </div>
    </section>
  )
}
