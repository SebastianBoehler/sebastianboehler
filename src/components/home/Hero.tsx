import { ActionLink } from "@/components/site/ActionLink"
import { profile } from "@/content/profile"

export function Hero() {
  return (
    <section className="space-y-10 pt-16 sm:space-y-12 sm:pt-24 lg:pt-32">
      <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:max-w-6xl lg:text-8xl">
        {profile.hero}
      </h1>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-16">
        <div className="space-y-7">
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
            {profile.lede}
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ActionLink href={profile.primaryAction.href} variant="primary">
              {profile.primaryAction.label}
            </ActionLink>
            <ActionLink href={profile.secondaryAction.href} variant="text">
              {profile.secondaryAction.label}
            </ActionLink>
          </div>
        </div>

        <div className="flex items-end lg:pb-2">
          <p className="max-w-xl border-l-2 border-[var(--accent)] pl-5 text-sm font-medium leading-7 text-[var(--muted)] sm:text-base">
            {profile.proof}
          </p>
        </div>
      </div>
    </section>
  )
}
