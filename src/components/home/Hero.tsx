import { ActionLink } from "@/components/site/ActionLink"
import { profile } from "@/content/profile"

export function Hero() {
  return (
    <section className="grid gap-10 pt-16 sm:pt-24 lg:grid-cols-12 lg:gap-12 lg:pt-32">
      <div className="space-y-8 lg:col-span-7">
        <div className="space-y-6">
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
            {profile.hero}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
            {profile.lede}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ActionLink href={profile.primaryAction.href} variant="primary">
            {profile.primaryAction.label}
          </ActionLink>
          <ActionLink href={profile.secondaryAction.href} variant="text">
            {profile.secondaryAction.label}
          </ActionLink>
        </div>
      </div>

      <div className="flex items-end lg:col-span-5 lg:pb-2">
        <p className="max-w-xl border-l-2 border-[var(--accent)] pl-5 text-sm font-medium leading-7 text-[var(--muted)] sm:text-base">
          {profile.proof}
        </p>
      </div>
    </section>
  )
}
