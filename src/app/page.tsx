import { PortfolioDirection } from "@/components/directions/PortfolioDirection"
import { getBlogPosts } from "@/lib/blog"
import { getContributionArc } from "@/lib/github-contributions"
import "@/components/directions/directions.css"

export const revalidate = 3600

export default async function Home() {
  const [posts, contributions] = await Promise.all([getBlogPosts(), getContributionArc()])
  return <PortfolioDirection direction="after-hours" posts={posts.slice(0, 3)} contributions={contributions} preview={false} />
}
