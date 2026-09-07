import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import "./concept-lab.css"
import "./concept-lab-primitives.css"
import "@/components/site/site.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SiteFooter } from "@/components/site/SiteFooter"
import { SiteHeader } from "@/components/site/SiteHeader"
import { profile } from "@/content/profile"
import { site } from "@/lib/site"

const title = "Sebastian Boehler | Research Engineer & Founder"
const description =
  "Research engineer and founder building evidence-led systems across simulation, markets, autonomous systems, and source-grounded learning."

const themeScript = `(() => {
  try {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
})();`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    "Research Engineer",
    "Machine Learning",
    "Research Software",
    "Reinforcement Learning",
    "Autonomous Systems",
    "University of Tübingen",
    "Sebastian Boehler",
  ],
  authors: [{ name: site.author, url: site.url }],
  creator: site.author,
  publisher: site.author,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    title,
    description,
    siteName: site.name,
  },
  twitter: {
    card: "summary",
    title,
    description,
    creator: "@sebastianboehler",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description,
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.author,
        url: site.url,
        email: profile.email,
        sameAs: profile.socialLinks.map((link) => link.href),
        jobTitle: "Research Engineer and Founder",
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "University of Tübingen",
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="describedby" href="/llms.txt" type="text/plain" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
