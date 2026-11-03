export type TimelineItem = {
  organization: string
  role: string
  period: string
}

export type ProfileLink = {
  label: string
  href: string
}

export const profile = {
  name: "Sebastian Böhler",
  role: "M.Sc. Computer Science, University of Tübingen · Founder, Sunderlabs",
  intro: [
    "I'm a master's student in computer science at the University of Tübingen and the founder of Sunderlabs. I work on optimization and simulation for scientific problems, learned control for small robots, and speech models.",
    "In 2026 I took part in four NeurIPS competitions: quant-finance agents, fusion plasma equilibria, gravitational-wave detector design, and EEG decoding.",
  ],
  neurips: "I'll be at NeurIPS 2026 in Sydney on 11 and 12 December.",
  openTo: "I'm interested in research internships and roles, including quantitative research.",
  email: "contact@sebastian-boehler.com",
  cv: { label: "CV (PDF)", href: "/sebastian_boehler_cv.pdf" },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/SebastianBoehler" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sebastian-boehler/" },
    { label: "Hugging Face", href: "https://huggingface.co/sebastianboehler" },
  ] as readonly ProfileLink[],
} as const

// Dates follow the CV (public/sebastian_boehler_cv.pdf).
export const experience: readonly TimelineItem[] = [
  { organization: "Hector Research Institute of Education Sciences and Psychology, Tübingen", role: "Research Assistant", period: "Sep 2026–present" },
  { organization: "Sunderlabs", role: "Founder", period: "May 2025–present" },
  { organization: "HB Capital", role: "Co-founder", period: "Jul 2023–present" },
  { organization: "LI.FI", role: "Backend Developer", period: "Jul 2022–Jul 2023" },
  { organization: "Remotly", role: "Full-Stack Developer", period: "Dec 2020–May 2021" },
  { organization: "Boehler IT Solutions", role: "Freelance Full-Stack Developer", period: "Jan 2020–Jul 2022" },
]

export const education: readonly TimelineItem[] = [
  { organization: "University of Tübingen", role: "M.Sc. Computer Science", period: "Oct 2025–present" },
  { organization: "IU International University of Applied Sciences", role: "B.Sc. Computer Science", period: "Oct 2024–Dec 2025" },
]
