import Link from "next/link"
import { ThemeToggle } from "@/components/site/ThemeToggle"
import { LossLandscape } from "@/components/home/landscape/LossLandscape"
import { profile } from "@/content/profile"
import { selectedWork } from "@/content/work"
import type { BlogPostMeta } from "@/lib/blog"

type Direction = "fieldnotes" | "index" | "after-hours"

const options = [
  { id: "fieldnotes", name: "Fieldnotes", number: "01" },
  { id: "index", name: "Index", number: "02" },
  { id: "after-hours", name: "After hours", number: "03" },
] as const

const categories = ["Autonomous systems", "Markets & infrastructure", "Language models", "Learning systems"]

export function PortfolioDirection({ direction, posts, preview = true }: {
  direction: Direction
  posts: BlogPostMeta[]
  preview?: boolean
}) {
  return (
    <div className={`portfolio-direction ${direction}`}>
      {preview && <nav className="direction-picker" aria-label="Design directions">
        <span>Portfolio studies</span>
        <div>{options.map((option) => (
          <Link key={option.id} href={`/directions/${option.id}`} aria-current={direction === option.id ? "page" : undefined}>
            <span>{option.number}</span> {option.name}
          </Link>
        ))}</div>
        <Link className="original-link" href="/">Home ↗</Link>
      </nav>}

      <div className="direction-page">
        <header className="direction-header">
          <a className="wordmark" href="#intro">Sebastian Boehler<span>Research engineer & founder</span></a>
          <div className="direction-controls"><nav aria-label="Portfolio navigation">
            <a href="#work">Work</a><a href="#notes">Writing</a><a href="#contact">Contact ↗</a>
          </nav>{direction === "after-hours" && <ThemeToggle />}</div>
        </header>

        <div className="direction-body">
          <section className="direction-intro" id="intro">
            <p className="eyebrow">Tübingen, Germany / Research & practice</p>
            <h1>{direction === "fieldnotes" ? <>Curiosity,<br />made <em>concrete.</em></> : direction === "index" ? <>Sebastian<br />Boehler<span className="name-period">.</span></> : <>An idea is<br />a <em>starting point.</em></>}</h1>
            <div className="intro-bottom">
              <p>I build AI systems and the environments they learn in. Working across simulation, autonomous systems, markets, and learning.</p>
              <a className="text-link" href={profile.primaryAction.href}>Let’s talk <span aria-hidden="true">↗</span></a>
            </div>
            {direction === "index" && <div className="index-affiliations"><p>Founder, Sunderlabs</p><p>Co-founder & CTO, HB Capital</p><p>M.Sc. Computer Science, Tübingen</p><a href={profile.cv.href}>Curriculum vitae ↗</a></div>}
          </section>

          <div className="direction-content">
            {direction === "after-hours" && <LossLandscape />}

            <section id="work" className="direction-work">
              <div className="section-heading"><h2>Selected work</h2><span>01 — 04</span></div>
              <div className="work-list">{selectedWork.map((work, i) => (
                <article className="direction-project" key={work.id}>
                  <span className="project-number">0{i + 1}</span>
                  <div className="project-main"><p className="eyebrow">{categories[i]}</p><h3><a href={work.links[0].href} target="_blank" rel="noreferrer">{work.name}<span aria-hidden="true">↗</span></a></h3><p>{work.title}</p></div>
                  <p className="project-summary">{work.summary}</p>
                </article>
              ))}</div>
            </section>

            <section id="notes" className="direction-notes">
              <div className="section-heading"><h2>Notes & observations</h2><Link href="/blog">All writing ↗</Link></div>
              {posts.map((post) => <Link className="note-row" href={`/blog/${post.slug}`} key={post.slug}><time dateTime={post.date}>{new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${post.date}T00:00:00Z`))}</time><h3>{post.title}</h3><span aria-hidden="true">↗</span></Link>)}
            </section>

            <section id="about" className="direction-about" aria-labelledby="about-title"><h2 id="about-title">A little context.</h2><div><p>{profile.about.join(" ")}</p><a className="text-link" href={profile.cv.href}>View my CV ↗</a></div></section>
          </div>
        </div>

        <footer className="direction-footer" id="contact">
          <p>Something worth building?</p><a className="contact-link" href={profile.primaryAction.href}>Let’s talk. <span aria-hidden="true">↗</span></a>
          <div><span>Sebastian Boehler</span><nav aria-label="Social links">{profile.socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}<a href="https://www.sunderlabs.com/imprint">Imprint</a></nav></div>
        </footer>
      </div>
    </div>
  )
}
