import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleHeader } from "@/components/blog/ArticleHeader"
import MarkdownContent from "@/components/blog/MarkdownContent"
import { getBlogPost, getBlogPosts } from "@/lib/blog"
import { absoluteUrl, site } from "@/lib/site"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getBlogPost(slug)
    const url = absoluteUrl(`/blog/${post.slug}`)
    const image = post.image ? absoluteUrl(post.image) : undefined

    return {
      title: post.title,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: site.author, url: site.url }],
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        type: "article",
        url,
        title: post.title,
        description: post.description,
        siteName: site.name,
        publishedTime: post.date,
        authors: [site.author],
        tags: post.tags,
        images: image
          ? [
              {
                url: image,
                alt: post.imageAlt ?? post.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: post.title,
        description: post.description,
        images: image ? [image] : undefined,
      },
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post

  try {
    const { slug } = await params
    post = await getBlogPost(slug)
  } catch {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? [absoluteUrl(post.image)] : undefined,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@id": `${site.url}/#person`,
    },
    publisher: {
      "@id": `${site.url}/#person`,
    },
    keywords: post.tags.join(", "),
    inLanguage: "en",
  }

  return (
    <article className="mx-auto w-full max-w-[70ch] px-4 py-16 sm:px-6 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticleHeader post={post} />
      <MarkdownContent content={post.content} />
    </article>
  )
}
