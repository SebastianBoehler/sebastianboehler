export const siteUrl = "https://www.sebastian-boehler.com"

export const site = {
  name: "Sebastian Böhler",
  title: "Sebastian Böhler",
  description:
    "M.Sc. Computer Science student at the University of Tübingen and founder of Sunderlabs.",
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
