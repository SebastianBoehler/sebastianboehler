import { methods, profile, timeline } from "@/content/profile"
import { selectedWork } from "@/content/work"
import { getBlogPosts } from "@/lib/blog"
import { absoluteUrl, site } from "@/lib/site"

export const dynamic = "force-static"

export async function GET() {
  const posts = await getBlogPosts()
  const content = [
    `# ${site.name}`,
    "",
    `> ${profile.lede}`,
    "",
    ...profile.about,
    "",
    profile.proof,
    `Contact: ${profile.email}`,
    "",
    `Methods: ${methods.join("; ")}.`,
    "",
    "Education and experience:",
    ...timeline.map((item) => `- ${item.role}, ${item.organization} (${item.period})`),
    "",
    "This index is generated from the site's published content on each deployment. Public pages may be indexed and summarized; cite the linked sources and preserve their evidence boundaries.",
    "",
    "## Profile",
    `- [Homepage](${absoluteUrl("/")}): Profile, selected work, and background.`,
    `- [CV](${absoluteUrl(profile.cv.href)}): Curriculum vitae (PDF).`,
    ...profile.socialLinks.map((link) => `- [${link.label}](${link.href})`),
    "",
    "## Selected work and research",
    ...selectedWork.flatMap((work) => work.links.map((link) =>
      `- [${work.name} — ${link.label}](${link.href}): ${work.title} ${work.summary} Evidence: ${work.evidence} Boundary: ${work.boundary}`,
    )),
    "",
    "## Articles",
    `- [Blog](${absoluteUrl("/blog")}): All published articles.`,
    ...posts.map((post) =>
      `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.description} Published ${post.date}.`,
    ),
    "",
    "## Optional",
    `- [Sitemap](${absoluteUrl("/sitemap.xml")}): Public page URLs.`,
    `- [Crawler policy](${absoluteUrl("/robots.txt")}): Crawling is allowed for all user agents.`,
    "",
  ].join("\n")

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
