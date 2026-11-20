// ActiveFilterChips — displays current result count and active filter pills with removal buttons.
"use client"

import React from "react"
import { X } from "lucide-react"
import { SortOption } from "@/types/menu"

export interface ActiveFilterChipsProps {
  totalCount: number
  query: string
  onClearQuery: () => void
  category: string
  onClearCategory: () => void
  location: string
  onClearLocation: () => void
  sort: SortOption
  onClearSort: () => void
  onClearAll: () => void
}

export default function ActiveFilterChips({
  totalCount,
  query,
  onClearQuery,
  category,
  onClearCategory,
  location,
  onClearLocation,
  sort,
  onClearSort,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasActiveFilters = Boolean(
    query || category || location || (sort && sort !== "default")
  )

  const sortLabel =
    sort === "price-asc"
      ? "Price: Low to High"
      : sort === "price-desc"
      ? "Price: High to Low"
      : null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2">
      {/* Result count */}
      <span className="font-heading text-sm font-semibold text-ink">
        {totalCount} {totalCount === 1 ? "item" : "items"} found
      </span>

      {/* Active filter chips & Clear all */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {query && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 font-text text-xs text-ink">
              Search: <span className="font-semibold">{query}</span>
              <button
                type="button"
                onClick={onClearQuery}
                aria-label="Remove search filter"
                className="ml-1 text-ink-muted hover:text-danger cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {category && category !== "All" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 font-text text-xs text-ink">
              Category: <span className="font-semibold">{category}</span>
              <button
                type="button"
                onClick={onClearCategory}
                aria-label="Remove category filter"
                className="ml-1 text-ink-muted hover:text-danger cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {location && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 font-text text-xs text-ink">
              Location: <span className="font-semibold">{location}</span>
              <button
                type="button"
                onClick={onClearLocation}
                aria-label="Remove location filter"
                className="ml-1 text-ink-muted hover:text-danger cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {sortLabel && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 font-text text-xs text-ink">
              Sort: <span className="font-semibold">{sortLabel}</span>
              <button
                type="button"
                onClick={onClearSort}
                aria-label="Reset sort"
                className="ml-1 text-ink-muted hover:text-danger cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-heading font-semibold text-brand-fg hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
