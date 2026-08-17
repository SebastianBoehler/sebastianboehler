"use client"

import { createContext, useContext, useEffect } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme: Theme = savedTheme === "dark" || (savedTheme !== "light" && prefersDark) ? "dark" : "light"

    document.documentElement.classList.toggle("dark", initialTheme === "dark")
    document.documentElement.style.colorScheme = initialTheme
  }, [])

  const toggleTheme = () => {
    const newTheme: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark"
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    document.documentElement.style.colorScheme = newTheme
  }

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
