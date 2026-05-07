import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://sebastianboehler.com'),
  title: 'Sebastian Boehler | Machine Learning & Research Software',
  description: 'Computer science graduate student at the University of Tübingen focused on machine learning, research software, dialogue systems, and AI-assisted engineering.',
  keywords: ['Machine Learning', 'Research Assistant', 'Research Software', 'Dialogue Systems', 'QLoRA', 'AI Engineer', 'University of Tübingen', 'Python', 'PyTorch', 'TypeScript', 'Sebastian Boehler'],
  authors: [{ name: 'Sebastian Boehler' }],
  creator: 'Sebastian Boehler',
  publisher: 'Sebastian Boehler',
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
    url: 'https://sebastianboehler.com',
    title: 'Sebastian Boehler | Machine Learning & Research Software',
    description: 'Computer science graduate student at the University of Tübingen focused on machine learning, research software, and dialogue systems.',
    siteName: 'Sebastian Boehler - Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Boehler | Machine Learning & Research Software',
    description: 'Computer science graduate student focused on machine learning, research software, and dialogue systems.',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors`}>
        <p className="hidden">This site provides a llms.txt file at /llms.txt for AI chatbots and parsers.</p>
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
