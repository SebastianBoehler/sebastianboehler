import fs from "node:fs/promises"
import path from "node:path"

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  visual?: string
}

export type BlogPost = BlogPostMeta & {
  content: string
}

const postsDirectory = path.join(process.cwd(), "content", "blog")

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const post = await getBlogPost(file.replace(/\.md$/, ""))
        return toMeta(post)
      }),
  )

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const file = await fs.readFile(path.join(postsDirectory, `${slug}.md`), "utf8")
  const { frontmatter, content } = parseMarkdownFile(file)

  return {
    slug,
    title: readString(frontmatter, "title"),
    description: readString(frontmatter, "description"),
    date: readString(frontmatter, "date"),
    tags: readList(frontmatter, "tags"),
    visual: frontmatter.visual,
    content,
  }
}

function parseMarkdownFile(file: string) {
  const match = file.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!match) {
    throw new Error("Blog post is missing frontmatter.")
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    content: match[2].trim(),
  }
}

function parseFrontmatter(value: string) {
  return value.split("\n").reduce<Record<string, string>>((result, line) => {
    const separator = line.indexOf(":")

    if (separator === -1) {
      return result
    }

    const key = line.slice(0, separator).trim()
    const rawValue = line.slice(separator + 1).trim()
    result[key] = rawValue.replace(/^"(.*)"$/, "$1")
    return result
  }, {})
}

function readString(source: Record<string, string>, key: string) {
  const value = source[key]

  if (!value) {
    throw new Error(`Blog post is missing ${key}.`)
  }

  return value
}

function readList(source: Record<string, string>, key: string) {
  const value = source[key]

  if (!value) {
    return []
  }

  return value
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((item) => item.trim().replace(/^"(.*)"$/, "$1"))
    .filter(Boolean)
}

function toMeta(post: BlogPost): BlogPostMeta {
  const { content: _content, ...meta } = post
  return meta
}
