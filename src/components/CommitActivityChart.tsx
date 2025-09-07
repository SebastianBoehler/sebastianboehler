interface Contribution {
  year: string
  total: number
}

interface Props {
  data: Contribution[]
  activeYear: string
}

export default function CommitActivityChart({ data, activeYear }: Props) {
  console.log('[CommitActivityChart] props', { data, activeYear })
  if (data.length === 0) {
    console.log('[CommitActivityChart] No data provided')
    return null
  }
  let activeIndex = data.findIndex((d) => d.year === activeYear)
  if (activeIndex < 0) activeIndex = 0
  const maxDist = Math.max(activeIndex, data.length - 1 - activeIndex, 1)

  return (
    <div className="flex w-full gap-2 mb-8">
      {data.map((d, i) => {
        const dist = Math.abs(i - activeIndex)
        const t = dist / maxDist // 0 at active, 1 at far ends
        // Cosine falloff then sharpen with gamma for steeper decrease.
        const base = 0.5 * (1 + Math.cos(Math.PI * t))
        const gamma = 2.0 // increase to make center taller, edges drop faster
        const falloff = Math.pow(base, gamma)
        const min = 0.12 // keep ends slightly visible (~12%)
        const heightPct = (min + (1 - min) * falloff) * 100
        return (
          <div key={d.year} className="flex-1 flex flex-col items-center">
            <div className="w-full h-32 flex items-end">
              <div
                className={`${
                  d.year === activeYear
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-700'
              } mx-auto w-[2px] md:w-[3px] lg:w-[4px] rounded transition-all duration-300 ease-out`}
                style={{ height: `${heightPct}%` }}
                aria-label={`${d.year}: ${d.total} commits`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{d.year}</p>
          </div>
        )
      })}
    </div>
  )
}
