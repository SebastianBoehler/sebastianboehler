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
  const max = Math.max(...data.map((d) => d.total))
  const denom = max > 0 ? max : 1
  console.log('[CommitActivityChart] max total', max)
  return (
    <div className="flex w-full gap-2 mb-8">
      {data.map((d) => (
        <div key={d.year} className="flex-1 flex flex-col items-center">
          <div className="w-full h-32 flex items-end">
            <div
              className={`${
                d.year === activeYear
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-700'
              } mx-auto w-[2px] md:w-[3px] lg:w-[4px] rounded transition-colors`}
              style={{ height: `${(d.total / denom) * 100}%` }}
              aria-label={`${d.year}: ${d.total} commits`}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{d.year}</p>
        </div>
      ))}
    </div>
  )
}
