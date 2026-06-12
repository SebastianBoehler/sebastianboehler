import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer';
import { site } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ['Machine Learning', 'Research Assistant', 'Research Software', 'Dialogue Systems', 'QLoRA', 'AI Engineer', 'University of Tübingen', 'Python', 'PyTorch', 'TypeScript', 'Sebastian Boehler'],
  authors: [{ name: site.author, url: site.url }],
  creator: site.author,
  publisher: site.author,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: 'summary',
    title: site.title,
    description: site.description,
    creator: '@sebastianboehler',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: site.author,
        url: site.url,
        email: site.email,
        sameAs: site.sameAs,
        jobTitle: 'Machine Learning and Research Software Engineer',
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'University of Tübingen',
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors`}>
        <p className="hidden">This site provides a llms.txt file at /llms.txt for AI chatbots and parsers.</p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
