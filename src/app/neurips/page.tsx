import type { Metadata } from "next"
import Link from "next/link"
import { ProfileLinks } from "@/components/home/Hero"
import { ResultLine } from "@/components/home/Section"
import "@/components/home/home.css"
import { profile } from "@/content/profile"
import { competitions, projects } from "@/content/work"

const description = "NeurIPS 2026 competitions and current work, in short."

export const metadata: Metadata = {
  title: "NeurIPS 2026",
  description,
  alternates: { canonical: "/neurips" },
  openGraph: { type: "website", siteName: profile.name, title: `${profile.name} · NeurIPS 2026`, description, url: "/neurips" },
  twitter: { card: "summary_large_image", title: `${profile.name} · NeurIPS 2026`, description },
}

const sunderlabs = projects.filter((item) => item.context === "Sunderlabs")

export default function NeuripsPage() {
  return (
    <div className="home home--short">
      <section className="home-intro" aria-labelledby="intro-heading">
        <p className="home-eyebrow">NeurIPS 2026 · Sydney</p>
        <h1 id="intro-heading">{profile.name}</h1>
        <p className="home-intro__role">{profile.role}</p>
        <p>Thanks for looking me up. This is the short version; the <Link href="/">full page</Link> has more.</p>
      </section>

      <section className="home-section" aria-labelledby="competitions-heading">
        <h2 id="competitions-heading" className="home-section__title">Competitions</h2>
        <ol className="home-section__body entry-list">
          {competitions.map((item) => (
            <li key={item.id} className="entry">
              <h3 className="entry__title">{item.name}</h3>
              <ResultLine result={item.result} />
              <p>{item.short} <a href={item.links[0].href} target="_blank" rel="noreferrer">{item.links[0].label}</a></p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section" aria-labelledby="now-heading">
        <h2 id="now-heading" className="home-section__title">At Sunderlabs</h2>
        <ul className="home-section__body entry-list entry-list--compact">
          {sunderlabs.map((item) => (
            <li key={item.id} className="entry">
              <h3 className="entry__title entry__title--small">{item.name}</h3>
              <p>{item.summary} <span className="entry__status">{item.status}</span></p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="home-section__title">Get in touch</h2>
        <div className="home-section__body">
          <p>
            {profile.openTo} Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <ProfileLinks />
        </div>
      </section>
    </div>
  )
}
