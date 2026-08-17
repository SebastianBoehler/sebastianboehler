import { expect, test } from "bun:test"
import { isVisualId } from "@/components/blog/PostVisual"
import { getBlogPost, getBlogPosts } from "@/lib/blog"

test("orders valid posts and resolves every visual", async () => {
  const posts = await getBlogPosts()
  const dates = posts.map((post) => post.date)

  expect(dates).toEqual([...dates].sort().reverse())

  for (const meta of posts) {
    const post = await getBlogPost(meta.slug)
    const requiredMetadata = [post.title, post.description, post.date, ...post.tags]
    const visualIds = [
      post.visual,
      ...Array.from(post.content.matchAll(/\[\[visual:([a-z0-9-]+)\]\]/g), (match) => match[1]),
    ].filter((id): id is string => Boolean(id))

    expect(requiredMetadata.every(Boolean)).toBeTrue()
    expect(post.tags.length).toBeGreaterThan(0)
    expect(visualIds.every(isVisualId)).toBeTrue()

    if (post.image) {
      expect(await Bun.file(`public${post.image}`).exists()).toBeTrue()
    }
  }
})

test("rejects inherited object keys as visual identifiers", () => {
  expect(isVisualId("constructor")).toBeFalse()
})
