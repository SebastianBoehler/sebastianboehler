import { education, experience, profile } from "@/content/profile"
import { competitions, grants, projects, publications } from "@/content/work"
import { getBlogPosts } from "@/lib/blog"
import { absoluteUrl, site } from "@/lib/site"

export const dynamic = "force-static"

export async function GET() {
  const posts = await getBlogPosts()
  const content = [
    `# ${site.name}`,
    "",
    `> ${profile.intro[0]}`,
    "",
    profile.intro[1],
    `Contact: ${profile.email}`,
    "",
    "Experience:",
    ...experience.map((item) => `- ${item.role}, ${item.organization} (${item.period})`),
    "",
    "Education:",
    ...education.map((item) => `- ${item.role}, ${item.organization} (${item.period})`),
    "",
    "This index is generated from the site's published content on each deployment.",
    "",
    "## Profile",
    `- [Homepage](${absoluteUrl("/")}): Research, competitions, projects and background.`,
    `- [NeurIPS 2026](${absoluteUrl("/neurips")}): Short summary for people met at NeurIPS 2026 in Sydney.`,
    `- [CV](${absoluteUrl(profile.cv.href)}): Curriculum vitae (PDF).`,
    ...profile.socialLinks.map((link) => `- [${link.label}](${link.href})`),
    "",
    "## Research and competitions",
    ...competitions.map((item) =>
      `- [${item.name}](${item.links[0].href}) (${item.venue}): ${item.result}. ${item.summary}`,
    ),
    ...publications.map((item) => `- [${item.title}](${item.links[0].href}): ${item.venue}.`),
    ...grants.map((grant) => `- ${grant}`),
    "",
    "## Projects",
    ...projects.map((item) => `- [${item.name}](${item.links[0].href}) (${item.context}): ${item.summary} ${item.status}`),
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
