import Link from "next/link"
import type { MouseEventHandler, ReactNode } from "react"

type ActionLinkProps = {
  href: string
  children: ReactNode
  variant: "primary" | "secondary" | "text"
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function ActionLink({ href, children, variant, onClick }: ActionLinkProps) {
  return (
    <Link href={href} className={`action-link action-link--${variant}`} onClick={onClick}>
      {children}
    </Link>
  )
}
