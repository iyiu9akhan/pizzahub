export const dynamic = "force-dynamic"
import React, { Suspense } from "react"
import Navbar from "@/components/header/navbar/Navbar"
import Footer from "@/components/home/Footer"
import MenuBrowser from "@/components/menu/browse/MenuBrowser"
import MenuLoading from "@/app/menu/loading"
import { getItems, getItemLocations } from "@/lib/api/items"
import { getHeaderOrderCount } from "@/lib/core/server"
import { getCustomerWishlistIds } from "@/lib/api/wishlist"
import type { MenuItem } from "@/types/menu"

export const metadata = {
  title: "Browse Pizza Menu - PizzaHub",
  description:
    "Explore our complete collection of fresh artisan pizzas, sides, and beverages.",
}

interface MenuPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const resolvedParams = (await searchParams) || {}
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : ""
  const category =
    typeof resolvedParams.category === "string" ? resolvedParams.category : ""
  const location =
    typeof resolvedParams.location === "string" ? resolvedParams.location : ""
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "default"

  // Map sort option to price_asc / price_desc
  let serverSort: string | undefined
  if (sort === "price-asc" || sort === "price_asc") {
    serverSort = "price_asc"
  } else if (sort === "price-desc" || sort === "price_desc") {
    serverSort = "price_desc"
  }

  const [orderCount, wishlistIds, locations] = await Promise.all([
    getHeaderOrderCount(),
    getCustomerWishlistIds(),
    getItemLocations(),
  ])
  let initialItems: MenuItem[] = []
  let initialError: string | null = null

  try {
    const data = await getItems({
      q: q || undefined,
      category: category && category !== "All" ? category : undefined,
      location: location || undefined,
      sort: serverSort,
    })
    const rawList: MenuItem[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : []

    // Merge legacy existingImages with images array
    initialItems = rawList.map((item) => {
      const mergedImages = [
        ...(item.images || []),
        ...(item.existingImages || []),
      ]
      return {
        ...item,
        images: Array.from(new Set(mergedImages)),
      }
    })
  } catch {
    initialError = "Failed to load menu items. Please try again."
  }

  return (
    <div className="min-h-screen bg-page flex flex-col transition-colors duration-300">
      {/* <Navbar orderCount={orderCount} /> */}
      <main className="flex-1">
        <Suspense fallback={<MenuLoading />}>
          <MenuBrowser
            initialItems={initialItems}
            initialError={initialError}
            wishlistIds={wishlistIds}
            serverLocations={locations}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
