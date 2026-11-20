"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolved: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light"
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }
  return theme
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [resolved, setResolved] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("platter-theme") as Theme | null
    const next = stored || "light"
    setThemeState(next)
    const r = resolveTheme(next)
    setResolved(r)
    applyTheme(r)
  }, [])

  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      const r = resolveTheme("system")
      setResolved(r)
      applyTheme(r)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem("platter-theme", next)
    const r = resolveTheme(next)
    setResolved(r)
    applyTheme(r)
  }, [])

  return (
    <ThemeContext value={{ theme, resolved, setTheme }}>{children}</ThemeContext>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
