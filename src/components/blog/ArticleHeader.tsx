import Image from "next/image"
import Link from "next/link"
import type { BlogPostMeta } from "@/lib/blog"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function ArticleHeader({ post }: { post: BlogPostMeta }) {
  return (
    <header className="space-y-10 border-b border-[var(--line)] pb-10 sm:pb-12">
      <Link
        href="/blog"
        className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        Back to all essays
      </Link>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs leading-6 text-[var(--muted)] sm:text-sm">
          <time dateTime={post.date}>{dateFormatter.format(new Date(`${post.date}T00:00:00Z`))}</time>
          <span aria-hidden="true">·</span>
          <span>{post.tags.join(" · ")}</span>
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
            {post.title}
          </h1>
          <p className="max-w-[65ch] text-lg leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
            {post.description}
          </p>
        </div>
      </div>

      {post.image && (
        <figure className="relative overflow-hidden bg-[var(--surface)] after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_var(--image-outline)]">
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            width={1800}
            height={1404}
            className="h-auto w-full"
            priority
          />
        </figure>
      )}
    </header>
  )
}
