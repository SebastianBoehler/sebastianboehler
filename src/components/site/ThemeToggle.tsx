"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === "light" ? "dark" : "light"

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {theme === "light" ? (
        <Moon aria-hidden="true" size={19} strokeWidth={1.8} />
      ) : (
        <Sun aria-hidden="true" size={19} strokeWidth={1.8} />
      )}
    </button>
  )
}
