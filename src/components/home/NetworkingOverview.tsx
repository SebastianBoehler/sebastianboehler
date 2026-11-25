import Link from "next/link"
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react"
import type { BlogPostMeta } from "@/lib/blog"
import { profile, education, experience } from "@/content/profile"
import { overview } from "@/content/overview"
import { competitions, projects, publications } from "@/content/work"

const selectedResults = [...competitions].sort((a, b) => overview.results[a.id].order - overview.results[b.id].order)
const currentProjects = projects
  .filter((item) => item.id !== "hb-capital")
  .sort((a, b) => overview.projects[a.id].order - overview.projects[b.id].order)

function Identity() {
  return (
    <section className="overview-identity" aria-labelledby="overview-name">
      <h1 id="overview-name">Sebastian <span className="overview-surname">Böhler<span>.</span></span></h1>
      <p className="overview-mobile-role">{profile.role}</p>
      <p className="overview-introduction">{overview.introduction}</p>
      <p className="overview-interests">{overview.interests}</p>
      <div className="overview-actions">
        <a className="overview-email" href={`mailto:${profile.email}`}><Mail size={16} aria-hidden="true" /> Get in touch</a>
        <a href={profile.cv.href}>CV <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
      <ul className="overview-socials" aria-label="Profile links">
        {profile.socialLinks.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}
      </ul>
      <div className="overview-background">
        <h2>Background</h2>
        <p><strong>{education[0].role}</strong><span>{education[0].organization} · since 2025</span></p>
        <p><strong>{experience[0].role}</strong><span>Hector Institute, Tübingen · since 2026</span></p>
        <p><strong>Founder, Sunderlabs</strong><span>Simulation, robot learning and speech</span></p>
        <p className="overview-tools">{overview.tools}</p>
      </div>
      <a className="overview-meet" href={`mailto:${profile.email}?subject=Meet%20at%20NeurIPS`}>
        <span className="overview-meet__dot" aria-hidden="true" />
        <span><strong>Meet at NeurIPS</strong><span>Sydney · 11–12 December 2026</span></span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </section>
  )
}

function Results() {
  return (
    <section className="overview-results" aria-labelledby="overview-results-heading">
      <div className="overview-section-heading"><h2 id="overview-results-heading">Selected results</h2><span>2026</span></div>
      <ol className="overview-result-list">
        {selectedResults.map((item) => {
          const entry = overview.results[item.id]
          const [placing] = item.result.split(" · ")
          return (
            <li key={item.id}>
              <a className="overview-result" href={item.links[0].href} target="_blank" rel="noreferrer">
                <div className="overview-result__heading"><h3>{entry.title}</h3><ArrowUpRight size={16} aria-hidden="true" /></div>
                <p className="overview-result__placing">{placing}</p>
                <p className="overview-result__note">{entry.note}</p>
                <p className="overview-result__context">{entry.context}</p>
              </a>
            </li>
          )
        })}
      </ol>
      <Link className="overview-more" href="/#research">Methods, results and source links <ArrowDown size={14} aria-hidden="true" /></Link>
    </section>
  )
}

function CurrentWork({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <aside className="overview-current" aria-labelledby="overview-current-heading">
      <h2 id="overview-current-heading">What I’m building</h2>
      <ul className="overview-project-list">
        {currentProjects.map((item) => (
          <li key={item.id}>
            <a href={item.links[0].href} target="_blank" rel="noreferrer"><h3>{item.name}</h3><ArrowUpRight size={14} aria-hidden="true" /></a>
            <p>{overview.projects[item.id].note}</p>
          </li>
        ))}
      </ul>
      <div className="overview-research-note">
        <h2>Research</h2>
        <a href={publications[0].links[0].href} target="_blank" rel="noreferrer">QLoRA for next user turn prediction <ArrowUpRight size={14} aria-hidden="true" /></a>
        <p>IEEE ICETSIS 2026</p>
        <p className="overview-compute"><strong>2 × 5,000 GPU-hours</strong><span>EuroHPC compute awards · Leonardo</span></p>
      </div>
      <div className="overview-writing">
        <h2>Writing</h2>
        <ul>{posts.slice(0, 2).map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}<ArrowUpRight size={14} aria-hidden="true" /></Link></li>)}</ul>
      </div>
    </aside>
  )
}

export function NetworkingOverview({ posts }: { posts: BlogPostMeta[] }) {
  return <div className="overview"><Identity /><Results /><CurrentWork posts={posts} /></div>
}
