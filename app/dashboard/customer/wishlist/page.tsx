export const dynamic = "force-dynamic"
import React from "react"
import { requireRole } from "@/lib/core/server"
import { getWishlist } from "@/lib/api/wishlist"
import CustomerWishlist from "@/components/dashboard/customer/wishlist/CustomerWishlist"

export const metadata = {
  title: "My Wishlist - PizzaHub",
  description: "View and manage your saved pizzas and favorite items.",
}

export default async function CustomerWishlistPage() {
  await requireRole("customer")
  const wishlistItems = await getWishlist()

  return <CustomerWishlist items={wishlistItems} />
}
