import Link from "next/link"
import type { BlogPostMeta } from "@/lib/blog"
import { Section } from "./Section"

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })

export function WritingPreview({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <Section id="writing" title="Writing">
      <ul className="writing-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            <time dateTime={post.date}>{dateFormatter.format(new Date(`${post.date}T00:00:00Z`))}</time>
          </li>
        ))}
      </ul>
      <p><Link href="/blog">All posts</Link></p>
    </Section>
  )
}
