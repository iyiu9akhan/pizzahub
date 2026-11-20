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

import { getItems } from "@/lib/api/items"
import { toastError } from "@/lib/toast"
import type { MenuItem, SortOption } from "@/types/menu"
import { RotateCcw } from "lucide-react"

export interface MenuBrowserProps {
  initialItems?: MenuItem[]
  initialError?: string | null
}

export default function MenuBrowser({
  initialItems = [],
  initialError = null,
}: MenuBrowserProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read active filter states from URL search params
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const location = searchParams.get("location") || ""
  const sort = (searchParams.get("sort") as SortOption) || "default"

  // Raw items and loading/error states initialized from server props
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(initialError)

  // Explicit retry handler triggers loading spinner
  const handleRetry = async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const data = await getItems()
      const rawList: MenuItem[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : []

      const normalizedList = rawList.map((item) => {
        const mergedImages = [
          ...(item.images || []),
          ...(item.existingImages || []),
        ]
        return {
          ...item,
          images: Array.from(new Set(mergedImages)),
        }
      })

      setItems(normalizedList)
      setFetchError(null)
    } catch {
      const msg = "Failed to load menu items. Please try again."
      setFetchError(msg)
      toastError("Error loading menu", msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Extract unique locations from loaded items
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>()
    items.forEach((item) => {
      if (item.location?.trim()) {
        locSet.add(item.location.trim())
      }
    })
    return Array.from(locSet).sort()
  }, [items])

  // Update URL search parameters without page scroll jumps
  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "default" && value !== "All") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.replace(`/menu?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Clear all filters from URL
  const clearAllFilters = useCallback(() => {
    router.replace("/menu", { scroll: false })
  }, [router])

  // Filter and sort items according to criteria
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Status check: if item has status field, only show when approved.
        // If status field is missing (legacy backend items), include it.
        // NOTE: This will become strictly status === "approved" once backend adds status to all records.
        // TODO(admin): re-enable approval filter after admin panel is built
        if (item.status && item.status !== "approved") {
          return false
        }

        // Category filter
        if (category && category !== "All" && item.category !== category) {
          return false
        }

        // Location filter
        if (location && item.location !== location) {
          return false
        }

        // Search text matching item name, category, and location
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
        if (sort === "price-asc") {
          return a.price - b.price
        }
        if (sort === "price-desc") {
          return b.price - a.price
        }
        return 0
      })
  }, [items, query, category, location, sort])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      {/* 1. Page header */}
      <MenuHero />

      {/* 2. Top bar: search, location and sort (sticky under the navbar) */}
      {/* 2. Top bar: search, location and sort (sticky under the navbar) */}
      <div className="sticky top-20 z-30 mb-5 rounded-2xl border border-line bg-surface/90 p-3 shadow-sm backdrop-blur-md sm:p-4">
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

      {/* 3. Category capsules (below the top bar) */}
      <div className="mb-5">
        <MenuCategoryChips
          selectedCategory={category}
          onCategoryChange={(cat) => setFilter("category", cat)}
        />
      </div>

      {/* 4. Result count and active filter chips */}
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

      {/* 5. Main content: loading skeleton, error state, empty state, or grid */}
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
        <MenuGrid items={filteredItems} />
      )}
    </div>
  )
}
