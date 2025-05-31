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
  title: 'Sebastian Boehler | Full Stack Developer & AI Engineer',
  description: 'Full Stack Developer and AI Engineer specializing in React, Python, and AI applications. Explore my portfolio featuring Chrome extensions, AI-powered camera tools, and smart home automation projects.',
  keywords: ['Full Stack Developer', 'AI Engineer', 'React', 'Python', 'Chrome Extensions', 'Smart Home Automation', 'Sony Camera AI', 'Sebastian Boehler'],
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
    title: 'Sebastian Boehler | Full Stack Developer & AI Engineer',
    description: 'Full Stack Developer and AI Engineer specializing in React, Python, and AI applications. Explore my portfolio featuring Chrome extensions, AI-powered camera tools, and smart home automation projects.',
    siteName: 'Sebastian Boehler Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sebastian Boehler | Full Stack Developer & AI Engineer',
    description: 'Full Stack Developer and AI Engineer specializing in React, Python, and AI applications.',
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
