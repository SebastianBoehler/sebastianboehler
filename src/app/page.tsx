import { About } from "@/components/home/About"
import { Contact } from "@/components/home/Contact"
import { ContributionArc } from "@/components/home/ContributionArc"
import { Hero } from "@/components/home/Hero"
import { SelectedWork } from "@/components/home/SelectedWork"
import { WritingPreview } from "@/components/home/WritingPreview"
import { selectedWork } from "@/content/work"
import { getBlogPosts } from "@/lib/blog"
import { getContributionArc } from "@/lib/github-contributions"

export const revalidate = 3600

export default async function Home() {
  const [posts, contributions] = await Promise.all([
    getBlogPosts().then((items) => items.slice(0, 3)),
    getContributionArc(),
  ])

  return (
    <div className="mx-auto w-full max-w-[75rem] space-y-24 px-4 pb-4 sm:space-y-32 sm:px-6 lg:space-y-40">
      <Hero />
      <SelectedWork items={selectedWork} />
      <WritingPreview posts={posts} />
      <About />
      <ContributionArc state={contributions} />
      <Contact />
    </div>
  )
}
