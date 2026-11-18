"use client"

import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export interface ThemeToggleProps {
  className?: string
}

const STORAGE_KEY = "pizzahub-theme"

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [isDark, setIsDark] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else if (stored === "light") {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem(STORAGE_KEY, "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem(STORAGE_KEY, "light")
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`group flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-all duration-300 hover:border-brand-muted hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 cursor-pointer shadow-2xs ${className}`}
    >
      {!mounted ? (
        <span className="h-4 w-4 rounded-full border border-current opacity-40" />
      ) : isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 text-ink" />
      )}
    </button>
  )
}

export default ThemeToggle
