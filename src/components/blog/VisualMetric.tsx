type VisualMetricProps = {
  label: string
  value: number
  color: string
  displayValue?: string
}

export default function VisualMetric({ label, value, color, displayValue }: VisualMetricProps) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
        <span>{label}</span>
        <span>{displayValue ?? `${value}%`}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="h-2 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
