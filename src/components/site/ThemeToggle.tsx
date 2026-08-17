"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

export function ThemeToggle() {
  const { toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title="Toggle color theme"
    >
      <span className="theme-toggle__to-dark">
        <Moon aria-hidden="true" size={19} strokeWidth={1.8} />
        <span className="sr-only">Switch to dark theme</span>
      </span>
      <span className="theme-toggle__to-light">
        <Sun aria-hidden="true" size={19} strokeWidth={1.8} />
        <span className="sr-only">Switch to light theme</span>
      </span>
    </button>
  )
}
