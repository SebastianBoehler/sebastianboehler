"use client"

import { useInView } from "@/hooks/useInView"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"

export interface TimelineEntryData {
  date: string
  title: string
  description: string
  icon?: string
  link?: string
}

export default function TimelineEntry({ entry }: { entry: TimelineEntryData }) {
  const { ref, inView } = useInView({ threshold: 0.1 })
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div
      ref={ref as any}
      className={cn(
        "relative pl-8 border-l border-gray-300 dark:border-gray-700",
        "opacity-0 translate-y-4 transition-all duration-700", 
        (inView || prefersReducedMotion) && "opacity-100 translate-y-0"
      )}
    >
      {entry.icon && (
        <span className="absolute -left-4 top-0 text-xl">{entry.icon}</span>
      )}
      <time className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
        {new Date(entry.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        })}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {entry.link ? (
          <a href={entry.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {entry.title}
          </a>
        ) : (
          entry.title
        )}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{entry.description}</p>
    </div>
  )
}
