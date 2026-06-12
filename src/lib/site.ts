export const siteUrl = "https://www.sebastian-boehler.com"

export const site = {
  name: "Sebastian Boehler",
  title: "Sebastian Boehler | Machine Learning & Research Software",
  description:
    "Computer science graduate student at the University of Tübingen focused on machine learning, research software, dialogue systems, and AI-assisted engineering.",
  url: siteUrl,
  author: "Sebastian Boehler",
  email: "contact@sebastian-boehler.com",
  sameAs: [
    "https://github.com/SebastianBoehler",
    "https://www.linkedin.com/in/sebastian-boehler/",
  ],
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}
