interface Contribution {
  year: string
  total: number
}

interface Props {
  data: Contribution[]
  activeYear: string
}

export default function CommitActivityChart({ data, activeYear }: Props) {
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.total))
  return (
    <div className="flex h-32 w-full items-end gap-2 mb-8">
      {data.map((d) => (
        <div key={d.year} className="flex-1 flex flex-col items-center">
          <div
            className={`${
              d.year === activeYear
                ? 'bg-blue-600 dark:bg-blue-400'
                : 'bg-gray-300 dark:bg-gray-700'
            } w-full transition-colors`}
            style={{ height: `${(d.total / max) * 100}%` }}
            aria-label={`${d.year}: ${d.total} commits`}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{d.year}</p>
        </div>
      ))}
    </div>
  )
}
