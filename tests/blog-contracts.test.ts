import { expect, test } from "bun:test"
import { isVisualId } from "@/components/blog/PostVisual"
import { getBlogPost, getBlogPosts } from "@/lib/blog"

const visualMarkerStart = /\[\[visual:/g
const visualMarker = /\[\[visual:([^\]]*)\]\]/g
const validVisualId = /^[a-z0-9-]+$/

test("orders valid posts and resolves every visual", async () => {
  const posts = await getBlogPosts()
  const dates = posts.map((post) => post.date)

  expect(dates).toEqual([...dates].sort().reverse())

  for (const meta of posts) {
    const post = await getBlogPost(meta.slug)
    const requiredMetadata = [post.title, post.description, post.date, ...post.tags]
    const markers = Array.from(post.content.matchAll(visualMarker), (match) => match[1])
    const markerStarts = post.content.match(visualMarkerStart)?.length ?? 0
    const visualIds = post.visual ? [post.visual, ...markers] : markers

    expect(requiredMetadata.every(Boolean)).toBeTrue()
    expect(post.tags.length).toBeGreaterThan(0)
    expect(markers).toHaveLength(markerStarts)
    expect(visualIds.every((id) => validVisualId.test(id) && isVisualId(id))).toBeTrue()

    if (post.image) {
      expect(await Bun.file(`public${post.image}`).exists()).toBeTrue()
    }
  }
})

test("rejects inherited object keys as visual identifiers", () => {
  expect(isVisualId("constructor")).toBeFalse()
})

test("rejects malformed visual markers", () => {
  for (const marker of ["[[visual:]]", "[[visual:Missing]]", "[[visual:missing_visual]]", "[[visual:missing-visual"]) {
    const ids = Array.from(marker.matchAll(visualMarker), (match) => match[1])
    const starts = marker.match(visualMarkerStart)?.length ?? 0

    expect(ids.length === starts && ids.every((id) => validVisualId.test(id) && isVisualId(id))).toBeFalse()
  }
})

test("uses complete lab colors without RGB channel wrappers", async () => {
  const componentFiles = new Bun.Glob("**/*.tsx")

  for await (const file of componentFiles.scan("src/components/blog")) {
    const source = await Bun.file(`src/components/blog/${file}`).text()
    expect(source).not.toMatch(/rgb\(var\(--lab-/)
  }
})
