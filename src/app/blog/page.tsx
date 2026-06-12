import type { Metadata } from "next"
import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import { absoluteUrl, site } from "@/lib/site"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on machine learning, research software, and AI-assisted engineering.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${site.name}`,
    description: "Notes on machine learning, research software, and AI-assisted engineering.",
    url: absoluteUrl("/blog"),
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title: `Blog | ${site.name}`,
    description: "Notes on machine learning, research software, and AI-assisted engineering.",
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl("/blog")}#blog`,
    name: "Sebastian Boehler Blog",
    url: absoluteUrl("/blog"),
    description: metadata.description,
    author: {
      "@id": `${site.url}/#person`,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="border-b border-gray-200 pb-8 dark:border-gray-800">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-gray-950 dark:text-white">
          Research notes and visual essays
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400">
          Lightweight posts on models, software systems, and the strange parts of engineering with AI.
        </p>
      </header>

      <div className="mt-10 space-y-7">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 pb-7 dark:border-gray-800">
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-2xl font-semibold tracking-normal text-gray-950 group-hover:underline dark:text-white">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500" dateTime={post.date}>
                  {dateFormatter.format(new Date(post.date))}
                </time>
              </div>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
