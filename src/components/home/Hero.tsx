import { profile } from "@/content/profile"

export function ProfileLinks() {
  return (
    <ul className="profile-links" aria-label="Profile links">
      <li><a href={profile.cv.href}>{profile.cv.label}</a></li>
      <li><a href={`mailto:${profile.email}`}>Email</a></li>
      {profile.socialLinks.map((link) => (
        <li key={link.label}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>
      ))}
    </ul>
  )
}

export function Hero() {
  return (
    <section className="home-intro" aria-labelledby="intro-heading">
      <h1 id="intro-heading">{profile.name}</h1>
      <p className="home-intro__role">{profile.role}</p>
      {profile.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <ProfileLinks />
      <p className="home-intro__note">{profile.neurips}</p>
    </section>
  )
}
