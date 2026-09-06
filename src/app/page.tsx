import { PortfolioDirection } from "@/components/directions/PortfolioDirection"
import { getBlogPosts } from "@/lib/blog"
import "@/components/directions/directions.css"

export const revalidate = 3600

export default async function Home() {
  const posts = (await getBlogPosts()).slice(0, 3)
  return <PortfolioDirection direction="after-hours" posts={posts} preview={false} />
}
