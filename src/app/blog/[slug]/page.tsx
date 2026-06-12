import Link from "next/link"
import { notFound } from "next/navigation"
import MarkdownContent from "@/components/blog/MarkdownContent"
import { getBlogPost, getBlogPosts } from "@/lib/blog"

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPost(params.slug)

    return {
      title: `${post.title} | Sebastian Boehler`,
      description: post.description,
    }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post

  try {
    post = await getBlogPost(params.slug)
  } catch {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
      <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white">
        Back to blog
      </Link>

      <header className="mt-8 border-b border-gray-200 pb-8 dark:border-gray-800">
        <time className="text-sm text-gray-500" dateTime={post.date}>
          {dateFormatter.format(new Date(post.date))}
        </time>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-gray-950 dark:text-white sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">{post.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <MarkdownContent content={post.content} />
    </article>
  )
}
