"use client";

import { useEffect, useRef, useState } from 'react'
import TimelineEntry, { TimelineEntryData } from './TimelineEntry'
import CommitActivityChart from './CommitActivityChart'
import { ContributionYear } from '@/lib/github'

interface Props {
  entries: TimelineEntryData[]
  contributions: ContributionYear[]
}

export default function Timeline({ entries, contributions }: Props) {
  const groups = entries.reduce<Record<string, TimelineEntryData[]>>((acc, entry) => {
    const year = entry.date.slice(0, 4)
    acc[year] = acc[year] || []
    acc[year].push(entry)
    return acc
  }, {})
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a))

  console.log('[Timeline] groups', groups)
  console.log('[Timeline] years', years)

  const [activeYear, setActiveYear] = useState(years[0])
  const yearRefs = useRef<Record<string, HTMLElement | null>>({})
  const ratiosRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100)
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const y = entry.target.getAttribute('data-year')
          if (!y) return
          ratiosRef.current[y] = entry.intersectionRatio
        })

        // Choose the year with the highest intersection ratio.
        let bestYear = activeYear
        let bestRatio = -1
        years.forEach(y => {
          const r = ratiosRef.current[y] ?? 0
          if (r > bestRatio) {
            bestRatio = r
            bestYear = y
          }
        })
        if (bestYear !== activeYear) {
          console.log('[Timeline] Active year resolved by ratio:', bestYear, 'ratio:', bestRatio)
          setActiveYear(bestYear)
        }
      },
      {
        threshold: thresholds,
        // Account for sticky header height so the top section is favored correctly.
        rootMargin: '-72px 0px -72px 0px',
      }
    )
    years.forEach(year => {
      const el = yearRefs.current[year]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [years, activeYear])

  useEffect(() => {
    console.log('[Timeline] activeYear changed', activeYear)
  }, [activeYear])

  console.log('[Timeline] contributions input', contributions)
  // Ensure we render a bar for every timeline year, even if contributions
  // data does not include that year (e.g., before GitHub activity started).
  const chartData = years.map((year) => {
    const match = contributions.find((c) => c.year === year)
    return match ?? { year, total: 0 }
  })
  console.log('[Timeline] chartData (aligned to years with fallbacks)', chartData)

  return (
    <div>
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pt-3">
        <CommitActivityChart data={chartData} activeYear={activeYear} />
      </div>
      <div className="snap-y snap-mandatory">
        {years.map(year => (
          <section
            key={year}
            ref={el => {
              yearRefs.current[year] = el
            }}
            data-year={year}
            className="snap-start min-h-screen flex flex-col items-center justify-center px-4 py-20"
          >
            <h2 className="heading-2 mb-12">{year}</h2>
            <div className="space-y-12 max-w-xl w-full">
              {groups[year].map((entry, idx) => (
                <TimelineEntry key={idx} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
