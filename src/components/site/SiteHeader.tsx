"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { profile } from "@/content/profile"
import { ActionLink } from "./ActionLink"
import { ThemeToggle } from "./ThemeToggle"

const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/#about" },
] as const

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          Sebastian Boehler
        </Link>

        <div className="site-header__controls">
          <nav className="site-header__desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link key={item.label} className="site-header__nav-link" href={item.href}>
                {item.label}
              </Link>
            ))}
            <ActionLink href={`mailto:${profile.email}`} variant="primary">
              Discuss a collaboration
            </ActionLink>
          </nav>

          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="site-header__menu-button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            {isMenuOpen ? (
              <X aria-hidden="true" size={21} strokeWidth={1.8} />
            ) : (
              <Menu aria-hidden="true" size={21} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav id="mobile-navigation" className="site-header__mobile-nav" aria-label="Mobile navigation" onClick={closeMenu}>
          {navigation.map((item) => (
            <Link key={item.label} className="site-header__mobile-link" href={item.href}>
              {item.label}
            </Link>
          ))}
          <ActionLink href={`mailto:${profile.email}`} variant="primary">
            Discuss a collaboration
          </ActionLink>
        </nav>
      )}
    </header>
  )
}
