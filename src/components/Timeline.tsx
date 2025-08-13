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

  const [activeYear, setActiveYear] = useState(years[0])
  const yearRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const y = entry.target.getAttribute('data-year')
            if (y) setActiveYear(y)
          }
        })
      },
      { threshold: 0.6 }
    )
    years.forEach(year => {
      const el = yearRefs.current[year]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [years])

  const chartData = contributions.filter(c => years.includes(c.year))

  return (
    <div>
      <CommitActivityChart data={chartData} activeYear={activeYear} />
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
