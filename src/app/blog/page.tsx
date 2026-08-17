import type { Metadata } from "next"
import { PostRow } from "@/components/blog/PostRow"
import { getBlogPosts } from "@/lib/blog"
import { absoluteUrl, site } from "@/lib/site"

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
    <div className="mx-auto w-full max-w-[75rem] px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
          Writing archive
        </h1>
        <p className="max-w-[65ch] text-lg leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
          Lightweight posts on models, software systems, and the strange parts of engineering with AI.
        </p>
      </header>

      <div className="mt-14 max-w-5xl border-t border-[var(--line)] sm:mt-20">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
