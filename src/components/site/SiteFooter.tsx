import { profile } from "@/content/profile"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>Research engineering, built with evidence and explicit boundaries.</p>
        <nav className="site-footer__links" aria-label="Footer navigation">
          {profile.socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="https://www.sunderlabs.com/imprint" target="_blank" rel="noreferrer">
            Imprint
          </a>
        </nav>
      </div>
    </footer>
  )
}
