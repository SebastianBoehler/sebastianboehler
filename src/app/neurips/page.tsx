import type { Metadata } from "next"
import { NetworkingOverview } from "@/components/home/NetworkingOverview"
import "@/components/home/overview.css"
import { profile } from "@/content/profile"
import { getBlogPosts } from "@/lib/blog"

const description = "Quant-finance agents, scientific machine learning and simulation. Selected results, current work and contact details."

export const metadata: Metadata = {
  title: "NeurIPS 2026",
  description,
  alternates: { canonical: "/neurips" },
  openGraph: { type: "website", siteName: profile.name, title: `${profile.name} · NeurIPS 2026`, description, url: "/neurips" },
  twitter: { card: "summary_large_image", title: `${profile.name} · NeurIPS 2026`, description },
}

export default async function NeuripsPage() {
  const posts = await getBlogPosts()
  return <NetworkingOverview posts={posts} />
}
