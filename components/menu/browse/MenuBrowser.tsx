"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import MenuHero from "@/components/menu/browse/MenuHero"
import MenuSearchBar from "@/components/menu/browse/MenuSearchBar"
import MenuFilters from "@/components/menu/browse/MenuFilters"
import MenuCategoryChips from "@/components/menu/browse/MenuCategoryChips"
import MenuGrid from "@/components/menu/browse/MenuGrid"
import MenuEmptyState from "@/components/menu/browse/MenuEmptyState"
import ActiveFilterChips from "@/components/menu/browse/ActiveFilterChips"
import { MenuItemCardSkeleton } from "@/components/menu/MenuItemCard"
import type { MenuItem, SortOption } from "@/types/menu"
import { RotateCcw } from "lucide-react"

export interface MenuBrowserProps {
  initialItems?: MenuItem[]
  initialError?: string | null
  wishlistIds?: string[]
}

type Filters = {
  q: string
  category: string
  location: string
  sort: SortOption
}

const EMPTY_FILTERS: Filters = {
  q: "",
  category: "",
  location: "",
  sort: "default" as SortOption,
}

export default function MenuBrowser({
  initialItems = [],
  initialError = null,
  wishlistIds = [],
}: MenuBrowserProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<Filters>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    sort: (searchParams.get("sort") as SortOption) || ("default" as SortOption),
  })

  const { q: query, category, location, sort } = filters

  const items = initialItems
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(initialError)

  const handleRetry = () => {
    setIsLoading(true)
    setFetchError(null)
    router.refresh()
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>()
    items.forEach((item) => {
      if (item.location?.trim()) {
        locSet.add(item.location.trim())
      }
    })
    return Array.from(locSet).sort()
  }, [items])

  // URL update করে, কিন্তু server request করে না
  const syncUrl = (next: Filters) => {
    const params = new URLSearchParams()
    Object.entries(next).forEach(([key, value]) => {
      if (value && value !== "default" && value !== "All") {
        params.set(key, value)
      }
    })
    const qs = params.toString()
    window.history.replaceState(null, "", qs ? `/menu?${qs}` : "/menu")
  }

  const setFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value } as Filters
    setFilters(next)
    syncUrl(next)
  }

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    window.history.replaceState(null, "", "/menu")
  }, [])

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.status && item.status !== "approved") {
          return false
        }

        if (category && category !== "All" && item.category !== category) {
          return false
        }

        if (location && item.location !== location) {
          return false
        }

        if (query.trim()) {
          const qLower = query.toLowerCase().trim()
          const nameMatch = item.itemName?.toLowerCase().includes(qLower)
          const catMatch = item.category?.toLowerCase().includes(qLower)
          const locMatch = item.location?.toLowerCase().includes(qLower)
          if (!nameMatch && !catMatch && !locMatch) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price
        if (sort === "price-desc") return b.price - a.price
        return 0
      })
  }, [items, query, category, location, sort])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <MenuHero />

     <div className="sticky top-20 z-30 mb-5 rounded-b-2xl border border-line bg-surface/90 p-3 shadow-sm backdrop-blur-md sm:p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="sm:col-span-2 lg:col-span-1">
            <MenuSearchBar
              value={query}
              onChange={(val) => setFilter("q", val)}
            />
          </div>
          <MenuFilters
            selectedLocation={location}
            onLocationChange={(loc) => setFilter("location", loc)}
            locations={uniqueLocations}
            selectedSort={sort}
            onSortChange={(s) => setFilter("sort", s)}
          />
        </div>
      </div>

      <div className="mb-5">
        <MenuCategoryChips
          selectedCategory={category}
          onCategoryChange={(cat) => setFilter("category", cat)}
        />
      </div>

      {!isLoading && !fetchError && (
        <div className="mb-6">
          <ActiveFilterChips
            totalCount={filteredItems.length}
            query={query}
            onClearQuery={() => setFilter("q", "")}
            category={category}
            onClearCategory={() => setFilter("category", "")}
            location={location}
            onClearLocation={() => setFilter("location", "")}
            sort={sort}
            onClearSort={() => setFilter("sort", "default")}
            onClearAll={clearAllFilters}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MenuItemCardSkeleton key={i} />
          ))}
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface p-12 text-center shadow-xs">
          <p className="font-heading text-lg font-bold text-danger">
            {fetchError}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try again</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <MenuEmptyState onClearFilters={clearAllFilters} />
      ) : (
        <MenuGrid items={filteredItems} wishlistIds={wishlistIds} />
      )}
    </div>
  )
}