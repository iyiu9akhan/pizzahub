"use client"

import React from "react"
import { ArrowUpDown, MapPin } from "lucide-react"
import type { SortOption } from "@/types/menu"

interface MenuFiltersProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
  locations: string[]
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const selectCls =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-surface pl-10 pr-4 font-text text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"

// Location and price sort dropdowns (width is controlled by the parent grid)
const MenuFilters = ({
  selectedLocation,
  onLocationChange,
  locations,
  selectedSort,
  onSortChange,
}: MenuFiltersProps) => {
  return (
    <>
      {/* Location */}
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <select
          aria-label="Filter by location"
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className={selectCls}
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <select
          aria-label="Sort by price"
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={selectCls}
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </>
  )
}

export default MenuFilters