import { ActionLink } from "@/components/site/ActionLink"
import { profile } from "@/content/profile"

export function Contact() {
  return (
    <section aria-labelledby="contact-heading" className="rounded-2xl bg-[var(--surface)] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <div className="max-w-3xl space-y-7">
        <div className="space-y-4">
          <h2 id="contact-heading" className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Build the next system on evidence.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            If the work above connects to a problem you are working on, let&apos;s discuss a collaboration.
          </p>
        </div>
        <ActionLink href={profile.primaryAction.href} variant="primary">
          {profile.primaryAction.label}
        </ActionLink>
      </div>
    </section>
  )
}
