export type TimelineItem = {
  organization: string
  role: string
  period: string
}

export const profile = {
  hero: "I build AI systems from the environment up.",
  lede:
    "I'm Sebastian Boehler, a research engineer and founder working across high-speed simulation, trading infrastructure, autonomous systems, and source-grounded learning.",
  proof:
    "IEEE-published research · Founder at Sunderlabs · Co-founder and CTO at HB Capital · M.Sc. Computer Science at Tübingen",
  email: "contact@sebastian-boehler.com",
  primaryAction: {
    label: "Discuss a collaboration",
    href: "mailto:contact@sebastian-boehler.com",
  },
  secondaryAction: { label: "Explore selected work", href: "#work" },
  cv: { label: "View CV", href: "/sebastian_boehler_cv.pdf" },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/SebastianBoehler" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sebastian-boehler/" },
  ],
} as const

export const timeline: readonly TimelineItem[] = [
  { organization: "Sunderlabs", role: "Founder & AI Engineer", period: "May 2025–present" },
  { organization: "HB Capital", role: "Co-founder & CTO", period: "Jul 2023–present" },
  { organization: "University of Tübingen", role: "M.Sc. Computer Science", period: "Oct 2025–present" },
  { organization: "IU International University", role: "B.Sc. Computer Science", period: "Nov 2024–Nov 2025" },
  { organization: "LI.FI", role: "Backend Developer", period: "Jul 2022–Jul 2023" },
  { organization: "Boehler IT Solutions", role: "Founder & Developer", period: "Jan 2020–Jul 2023" },
  { organization: "remotly", role: "Backend Developer", period: "Dec 2020–May 2021" },
]

export const methods = [
  "High-throughput simulation and staged deployment gates",
  "Research infrastructure with explicit evidence boundaries",
  "Source-grounded learning systems and typed tutor capabilities",
] as const
