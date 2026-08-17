"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { MouseEventHandler, RefObject } from "react"
import { profile } from "@/content/profile"
import { ActionLink } from "./ActionLink"
import { ThemeToggle } from "./ThemeToggle"

const navigation = [
  { label: "Work", href: "/#work" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "/#about" },
] as const

type HashNavigationBrowser = {
  location: Pick<Location, "hash" | "href">
  document: Pick<Document, "getElementById">
  requestAnimationFrame: Window["requestAnimationFrame"]
}

export function handleMobileLinkSelection(
  event: { currentTarget: Pick<HTMLAnchorElement, "href">; preventDefault: () => void },
  closeMenu: () => void,
  browser: HashNavigationBrowser = window,
) {
  closeMenu()

  const current = new URL(browser.location.href)
  const destination = new URL(event.currentTarget.href, current)
  if (!destination.hash
    || destination.origin !== current.origin
    || destination.pathname !== current.pathname
    || destination.search !== current.search) return

  let anchorId: string
  try {
    anchorId = decodeURIComponent(destination.hash.slice(1))
  } catch {
    return
  }

  const anchor = browser.document.getElementById(anchorId)
  const focusTarget = anchor?.querySelector<HTMLElement>("[data-anchor-focus]") ?? anchor
  if (!anchor || !focusTarget) return

  event.preventDefault()
  browser.location.hash = destination.hash
  browser.requestAnimationFrame(() => {
    anchor.scrollIntoView()
    focusTarget.focus({ preventScroll: true })
  })
}

export function MobileMenuButton({
  isOpen,
  onToggle,
  buttonRef,
}: {
  isOpen: boolean
  onToggle: () => void
  buttonRef: RefObject<HTMLButtonElement>
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="site-header__menu-button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-controls="mobile-navigation"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      {isOpen ? (
        <X aria-hidden="true" size={21} strokeWidth={1.8} />
      ) : (
        <Menu aria-hidden="true" size={21} strokeWidth={1.8} />
      )}
    </button>
  )
}

export function MobileNavigation({ onSelect }: { onSelect: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <nav id="mobile-navigation" className="site-header__mobile-nav" aria-label="Mobile navigation">
      {navigation.map((item) => (
        <Link key={item.label} className="site-header__mobile-link" href={item.href} onClick={onSelect}>
          {item.label}
        </Link>
      ))}
      <ActionLink href={`mailto:${profile.email}`} variant="primary" onClick={onSelect}>
        Discuss a collaboration
      </ActionLink>
    </nav>
  )
}

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
  const handleMobileSelection: MouseEventHandler<HTMLAnchorElement> = (event) => {
    handleMobileLinkSelection(event, closeMenu)
  }

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
          <MobileMenuButton
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((isOpen) => !isOpen)}
            buttonRef={menuButtonRef}
          />
        </div>
      </div>

      {isMenuOpen && <MobileNavigation onSelect={handleMobileSelection} />}
    </header>
  )
}
