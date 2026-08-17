import Link from "next/link"
import type { BlogPostMeta } from "@/lib/blog"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function WritingPreview({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <section aria-labelledby="writing-heading" className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 id="writing-heading" className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Recent writing
          </h2>
          <p className="text-base leading-7 text-[var(--muted)] sm:text-lg">
            Notes on research systems, engineering practice, and how models behave in the environments around them.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex min-h-11 shrink-0 items-center font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Browse all essays
        </Link>
      </div>

      <div className="border-t border-[var(--line)]">
        {posts.map((post) => (
          <article key={post.slug} className="grid gap-3 border-b border-[var(--line)] py-7 sm:grid-cols-[9rem_1fr] sm:gap-7">
            <time dateTime={post.date} className="text-sm leading-7 text-[var(--muted)]">
              {dateFormatter.format(new Date(`${post.date}T00:00:00Z`))}
            </time>
            <div className="max-w-3xl space-y-2">
              <h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:text-[var(--accent)] hover:underline"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-base leading-7 text-[var(--muted)]">{post.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
