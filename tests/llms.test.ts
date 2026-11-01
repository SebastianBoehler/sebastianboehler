import { expect, test } from "bun:test"
import { GET } from "@/app/llms.txt/route"
import robots from "@/app/robots"
import { competitions, projects } from "@/content/work"
import { getBlogPosts } from "@/lib/blog"

test("serves a public text index with every published article, competition and project", async () => {
  const response = await GET()
  const body = await response.text()

  expect(response.status).toBe(200)
  expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8")
  expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
  expect(body).toStartWith("# Sebastian Böhler\n\n> ")
  expect(body).toContain("Jul 2022–Jul 2023")
  expect(body).not.toContain("looking for internship opportunities")
  for (const post of await getBlogPosts()) {
    expect(body).toContain(`/blog/${post.slug}`)
    expect(body).toContain(post.title)
  }
  for (const item of competitions) expect(body).toContain(item.result)
  for (const item of projects) expect(body).toContain(item.status)
  expect(robots().rules).toContainEqual({ userAgent: "*", allow: "/" })
  expect(await Bun.file("public/llms.txt").exists()).toBeFalse()
})
