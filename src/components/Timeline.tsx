import TimelineEntry, { TimelineEntryData } from "./TimelineEntry"

export default function Timeline({ entries }: { entries: TimelineEntryData[] }) {
  const groups = entries.reduce<Record<string, TimelineEntryData[]>>((acc, entry) => {
    const year = entry.date.slice(0, 4)
    acc[year] = acc[year] || []
    acc[year].push(entry)
    return acc
  }, {})
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="snap-y snap-mandatory">
      {years.map(year => (
        <section key={year} className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <h2 className="heading-2 mb-12">{year}</h2>
          <div className="space-y-12 max-w-xl w-full">
            {groups[year].map((entry, idx) => (
              <TimelineEntry key={idx} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
