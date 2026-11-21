import "server-only"
import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Public read: fetch all approved items
export const getItems = async () => {
  const res = await fetch(`${BASE_URL}/items`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch items")
  return res.json()
}

// Public read: fetch a single approved item by ID
export const getItemById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

// Public read: fetch reviews for an item
export const getItemReviews = async (id: string) => {
  const res = await fetch(`${BASE_URL}/items/${id}/reviews`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

// Private read: vendor gets own items, admin gets all items
export const getManageItems = async () => {
  const res = await authFetch(`${BASE_URL}/items/manage`)
  if (!res.ok) throw new Error("Failed to fetch managed items")
  return res.json()
}

// Private read: vendor gets own item count
export const getItemCount = async (): Promise<number> => {
  const res = await authFetch(`${BASE_URL}/items/count`)
  if (!res.ok) return 0
  const data = await res.json()
  return typeof data === "number" ? data : typeof data?.count === "number" ? data.count : 0
}
