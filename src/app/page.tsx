import { manualMilestones } from "@/data/manualMilestones"
import Timeline from "@/components/Timeline"
import { TimelineEntryData } from "@/components/TimelineEntry"
import { fetchRepos } from "@/lib/github"

async function mapRepos(): Promise<TimelineEntryData[]> {
  const repos = await fetchRepos("SebastianBoehler")
  return repos.map(r => ({
    date: r.created_at,
    title: r.name,
    description: r.description || "",
    link: r.homepage || r.html_url,
  }))
}

export default async function Home() {
  const repos = await mapRepos()
  const entries = [...manualMilestones, ...repos].sort((a, b) =>
    b.date.localeCompare(a.date)
  )
  return <Timeline entries={entries} />
}
