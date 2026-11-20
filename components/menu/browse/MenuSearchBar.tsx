// MenuSearchBar — search input with 300ms debounce.
// Filters items across item name, category, and location.
"use client"

import React, { useEffect, useState } from "react"
import { Search, X } from "lucide-react"

export interface MenuSearchBarProps {
  value: string
  onChange: (query: string) => void
  placeholder?: string
}

export default function MenuSearchBar({
  value,
  onChange,
  placeholder = "Search pizza by name, category, or location…",
}: MenuSearchBarProps) {
  // Local input state for smooth responsive typing
  const [prevValue, setPrevValue] = useState(value)
  const [localValue, setLocalValue] = useState(value)

  // Sync state with props during render when external query changes
  if (value !== prevValue) {
    setPrevValue(value)
    setLocalValue(value)
  }

  // Debounce input updates by 300ms before notifying parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [localValue, onChange, value])

  const handleClear = () => {
    setLocalValue("")
    onChange("")
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search menu items"
        className="h-11 w-full rounded-2xl border border-line bg-surface pl-10 pr-10 font-text text-sm text-ink placeholder:text-ink-muted/70 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-2xs"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search query"
          aria-label="Clear search query"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-ink-muted transition-colors hover:text-ink hover:bg-line cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
