import { manualMilestones } from "@/data/manualMilestones"
import Timeline from "@/components/Timeline"
import { TimelineEntryData } from "@/components/TimelineEntry"
import { fetchRepos, fetchContributions } from "@/lib/github"

async function mapRepos(): Promise<TimelineEntryData[]> {
  const repos = await fetchRepos("SebastianBoehler")
  return repos.map((r) => ({
    date: r.created_at,
    title: r.name,
    description: r.description || "",
    link: r.homepage || r.html_url,
  }))
}

export const metadata = {
  title: "Timeline | Sebastian Böhler",
  description: "Chronological overview of projects, milestones & achievements.",
}

export default async function TimelinePage() {
  const repos = await mapRepos()
  const entries = [...manualMilestones, ...repos].sort((a, b) => b.date.localeCompare(a.date))
  const contributions = await fetchContributions("SebastianBoehler")
  return (
    <main>
      <Timeline entries={entries} contributions={contributions} />
    </main>
  )
}
