"use client"

import React, { useCallback, useMemo, useState, useTransition } from "react"
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
  serverLocations?: string[]
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
  serverLocations = [],
}: MenuBrowserProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

<<<<<<< HEAD
  const parseSortParam = useCallback((param: string | null): SortOption => {
    if (param === "price_asc" || param === "price-asc") return "price-asc"
    if (param === "price_desc" || param === "price-desc") return "price-desc"
    return "default"
  }, [])

  const currentParamsKey = searchParams.toString()
  const [prevParamsKey, setPrevParamsKey] = useState(currentParamsKey)
  const [filters, setFilters] = useState<Filters>(() => ({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    sort: parseSortParam(searchParams.get("sort")),
  }))

  if (currentParamsKey !== prevParamsKey) {
    setPrevParamsKey(currentParamsKey)
    setFilters({
      q: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      location: searchParams.get("location") || "",
      sort: parseSortParam(searchParams.get("sort")),
    })
  }

  const { q: query, category, location, sort } = filters
=======
  const [filters, setFilters] = useState<Filters>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    sort: (searchParams.get("sort") as SortOption) || ("default" as SortOption),
  })

  const { q: query, category, location, sort } = filters

  const items = initialItems
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
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

<<<<<<< HEAD
  const fallbackLocations = useMemo(() => {
=======
  const uniqueLocations = useMemo(() => {
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
    const locSet = new Set<string>()
    initialItems.forEach((item) => {
      if (item.location?.trim()) {
        locSet.add(item.location.trim())
      }
    })
    return Array.from(locSet).sort()
  }, [initialItems])

<<<<<<< HEAD
  const locations =
    serverLocations.length > 0 ? serverLocations : fallbackLocations

  const updateFilters = (next: Filters) => {
    setFilters(next)
    const params = new URLSearchParams()
    if (next.q.trim()) params.set("q", next.q.trim())
    if (next.category && next.category !== "All") {
      params.set("category", next.category)
    }
    if (next.location) params.set("location", next.location)
    if (next.sort && next.sort !== "default") {
      const mappedSort =
        next.sort === "price-asc"
          ? "price_asc"
          : next.sort === "price-desc"
            ? "price_desc"
            : next.sort
      params.set("sort", mappedSort)
    }

    const qs = params.toString()
    startTransition(() => {
      router.replace(qs ? `/menu?${qs}` : "/menu", { scroll: false })
    })
=======
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
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
  }

  const setFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value } as Filters
<<<<<<< HEAD
    updateFilters(next)
=======
    setFilters(next)
    syncUrl(next)
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
  }

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
<<<<<<< HEAD
    startTransition(() => {
      router.replace("/menu", { scroll: false })
    })
  }, [router])

  const showLoading = isLoading || isPending
=======
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
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20">
      <MenuHero />

<<<<<<< HEAD
      <div className="sticky top-20 z-30 mb-5 rounded-b-2xl border border-line bg-surface/90 p-3 shadow-sm backdrop-blur-md sm:p-4">
=======
     <div className="sticky top-20 z-30 mb-5 rounded-b-2xl border border-line bg-surface/90 p-3 shadow-sm backdrop-blur-md sm:p-4">
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
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
            locations={locations}
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

<<<<<<< HEAD
      {!showLoading && !fetchError && (
=======
      {!isLoading && !fetchError && (
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
        <div className="mb-6">
          <ActiveFilterChips
            totalCount={initialItems.length}
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

<<<<<<< HEAD
      {showLoading ? (
=======
      {isLoading ? (
>>>>>>> f02b74d50817cf192f8290437bea680462a537a2
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
      ) : initialItems.length === 0 ? (
        <MenuEmptyState onClearFilters={clearAllFilters} />
      ) : (
        <MenuGrid items={initialItems} wishlistIds={wishlistIds} />
      )}
    </div>
  )
}