import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortfolioDirection } from "@/components/directions/PortfolioDirection"
import { getBlogPosts } from "@/lib/blog"
import "@/components/directions/directions.css"

const directions = ["fieldnotes", "index", "after-hours"] as const

export const metadata: Metadata = {
  title: "Portfolio directions",
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return directions.map((direction) => ({ direction }))
}

export default async function DirectionPage({ params }: {
  params: Promise<{ direction: string }>
}) {
  const { direction } = await params
  if (!directions.includes(direction as typeof directions[number])) notFound()
  const posts = (await getBlogPosts()).slice(0, 3)
  return <PortfolioDirection direction={direction as typeof directions[number]} posts={posts} />
}
