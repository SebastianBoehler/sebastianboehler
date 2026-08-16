import Link from "next/link"
import type { ReactNode } from "react"

type ActionLinkProps = {
  href: string
  children: ReactNode
  variant: "primary" | "secondary" | "text"
}

export function ActionLink({ href, children, variant }: ActionLinkProps) {
  return (
    <Link href={href} className={`action-link action-link--${variant}`}>
      {children}
    </Link>
  )
}
