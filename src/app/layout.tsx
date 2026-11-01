import type { Metadata, Viewport } from "next"
import { Source_Serif_4 } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import "./concept-lab.css"
import "./concept-lab-primitives.css"
import "./concept-lab-charts.css"
import "@/components/site/site.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SiteFooter } from "@/components/site/SiteFooter"
import { SiteHeader } from "@/components/site/SiteHeader"
import { profile } from "@/content/profile"
import { site } from "@/lib/site"

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-source-serif",
})

const title = "Sebastian Böhler"
const description =
  "M.Sc. Computer Science student at the University of Tübingen and founder of Sunderlabs. NeurIPS 2026 competitions: fusion equilibria, gravitational-wave detector design, EEG decoding."

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
    "Sebastian Böhler",
    "Sebastian Boehler",
    "Machine Learning",
    "Scientific Machine Learning",
    "NeurIPS 2026",
    "University of Tübingen",
    "Sunderlabs",
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
    card: "summary_large_image",
    title,
    description,
    creator: "@sebastianboehle",
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
        name: profile.name,
        alternateName: site.author,
        url: site.url,
        email: profile.email,
        sameAs: profile.socialLinks.map((link) => link.href),
        jobTitle: "Founder, Sunderlabs",
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "University of Tübingen",
        },
        worksFor: { "@type": "Organization", name: "Sunderlabs", url: "https://sunderlabs.com" },
      },
    ],
  }

  return (
    <html lang="en" className={serif.variable} suppressHydrationWarning>
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
