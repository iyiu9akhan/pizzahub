export const dynamic = "force-dynamic"

import React, { Suspense } from "react"
import Navbar from "@/components/header/navbar/Navbar"
import Footer from "@/components/home/Footer"
import MenuBrowser from "@/components/menu/browse/MenuBrowser"
import MenuLoading from "@/app/menu/loading"
import { getItems } from "@/lib/api/items"
import { getHeaderOrderCount } from "@/lib/core/server"
import { getCustomerWishlistIds } from "@/lib/api/wishlist"
import type { MenuItem } from "@/types/menu"

export const metadata = {
  title: "Browse Pizza Menu - PizzaHub",
  description:
    "Explore our complete collection of fresh artisan pizzas, sides, and beverages.",
}

export default async function MenuPage() {
  const [orderCount, wishlistIds] = await Promise.all([
    getHeaderOrderCount(),
    getCustomerWishlistIds(),
  ])
  let initialItems: MenuItem[] = []
  let initialError: string | null = null

  try {
    const data = await getItems()
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
      <Navbar orderCount={orderCount} />
      <main className="flex-1">
        <Suspense fallback={<MenuLoading />}>
          <MenuBrowser
            initialItems={initialItems}
            initialError={initialError}
            wishlistIds={wishlistIds}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
