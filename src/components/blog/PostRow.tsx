import Link from "next/link"
import type { BlogPostMeta } from "@/lib/blog"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function PostRow({ post }: { post: BlogPostMeta }) {
  return (
    <article className="border-b border-[var(--line)] py-8 first:pt-0 sm:py-10">
      <Link
        className="group grid min-h-11 gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-7"
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
      >
        <time className="text-sm leading-7 text-[var(--muted)]" dateTime={post.date}>
          {dateFormatter.format(new Date(`${post.date}T00:00:00Z`))}
        </time>
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.025em] underline-offset-4 group-hover:text-[var(--accent)] group-hover:underline sm:text-3xl">
            {post.title}
          </h2>
          <p className="text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            {post.description}
          </p>
        </div>
      </Link>
    </article>
  )
}
