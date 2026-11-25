import { About } from "@/components/home/About"
import { Contact } from "@/components/home/Contact"
import { NetworkingOverview } from "@/components/home/NetworkingOverview"
import { Research } from "@/components/home/Research"
import { SelectedWork } from "@/components/home/SelectedWork"
import { WritingPreview } from "@/components/home/WritingPreview"
import "@/components/home/home.css"
import "@/components/home/overview.css"
import { projects } from "@/content/work"
import { getBlogPosts } from "@/lib/blog"

export default async function Home() {
  const posts = await getBlogPosts()
  return (
    <>
      <NetworkingOverview posts={posts} />
      <div className="home home--details">
        <Research />
        <SelectedWork items={projects} />
        <WritingPreview posts={posts.slice(0, 3)} />
        <About />
        <Contact />
      </div>
    </>
  )
}
