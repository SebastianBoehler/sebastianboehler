"use client"

import { createContext, useContext, useEffect } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type ThemeRoot = {
  classList: Pick<DOMTokenList, "contains" | "toggle">
  style: Pick<CSSStyleDeclaration, "colorScheme">
}

type StorageAccess = () => Pick<Storage, "getItem" | "setItem">

const getBrowserStorage: StorageAccess = () => window.localStorage

function applyTheme(root: ThemeRoot, theme: Theme) {
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function initializeDocumentTheme(
  root: ThemeRoot,
  prefersDark: boolean,
  getStorage: StorageAccess = getBrowserStorage,
) {
  let savedTheme: string | null = null
  try {
    savedTheme = getStorage().getItem("theme")
  } catch {}

  const theme: Theme = savedTheme === "dark" || (savedTheme !== "light" && prefersDark) ? "dark" : "light"
  applyTheme(root, theme)
}

export function toggleDocumentTheme(
  root: ThemeRoot,
  getStorage: StorageAccess = getBrowserStorage,
) {
  const theme: Theme = root.classList.contains("dark") ? "light" : "dark"
  try {
    getStorage().setItem("theme", theme)
  } catch {}

  applyTheme(root, theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    initializeDocumentTheme(document.documentElement, prefersDark)
  }, [])

  const toggleTheme = () => toggleDocumentTheme(document.documentElement)

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
