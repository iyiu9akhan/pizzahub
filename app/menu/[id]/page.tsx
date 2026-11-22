export const dynamic = "force-dynamic"

import React from "react"
import { notFound } from "next/navigation"

import Navbar from "@/components/header/navbar/Navbar"
import Footer from "@/components/home/Footer"
import MenuItemDetails from "@/components/menu/details/MenuItemDetails"
import { getItemById, getItemReviews } from "@/lib/api/items"
import { getHeaderOrderCount } from "@/lib/core/server"
import { getCustomerWishlistIds } from "@/lib/api/wishlist"
import type { MenuItem } from "@/types/menu"

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [rawItem, rawReviews, orderCount, wishlistIds] = await Promise.all([
    getItemById(id),
    getItemReviews(id),
    getHeaderOrderCount(),
    getCustomerWishlistIds(),
  ])

  const itemData = rawItem?.item || rawItem

  if (!itemData?._id) {
    notFound()
  }

  const normalizedItem: MenuItem = {
    ...itemData,
    images: Array.from(
      new Set([
        ...(itemData.images || []),
        ...(itemData.existingImages || []),
      ])
    ),
  }

  const reviewsList = Array.isArray(rawReviews)
    ? rawReviews
    : rawReviews?.reviews || []

  const isFavorite = wishlistIds.includes(normalizedItem._id)

  return (
    <div className="flex min-h-screen flex-col bg-page transition-colors duration-300">
      <Navbar orderCount={orderCount} />
      <main className="flex-1">
        <MenuItemDetails
          item={normalizedItem}
          reviews={reviewsList}
          isFavorite={isFavorite}
        />
      </main>
      <Footer />
    </div>
  )
}
