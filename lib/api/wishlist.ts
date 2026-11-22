import "server-only"
import { authFetch, getSession } from "@/lib/core/server"
import { db } from "@/lib/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface WishlistItem {
  _id: string
  itemName: string
  category: string
  description?: string
  price: number
  location: string
  images?: string[]
  existingImages?: string[]
  vendorName?: string
  vendorId?: string
  isPremiumVendor?: boolean
  ratingAvg?: number
  ratingCount?: number
  createdAt?: string
}

// Fetch all wishlist items for the logged-in customer.
// Returns an empty array if guest, non-customer, or on network failure.
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const session = await getSession()
  if (!session?.user || session.user.role !== "customer") {
    return []
  }

  try {
    const res = await authFetch(`${BASE_URL}/wishlist`)
    if (!res.ok) return []
    const data = await res.json().catch(() => [])
    const list = Array.isArray(data) ? data : data?.items || []

    const premiumVendors = await db
      .collection("user")
      .find({ role: "vendor", premium: true }, { projection: { _id: 1 } })
      .toArray()
      .catch(() => [])
    const premiumVendorIds = new Set(premiumVendors.map((v) => v._id.toString()))

    return list.map((item: Record<string, unknown>) => ({
      ...item,
      isPremiumVendor: item.vendorId
        ? premiumVendorIds.has(String(item.vendorId))
        : false,
      images: Array.from(
        new Set([
          ...(((item.images as string[]) || [])),
          ...(((item.existingImages as string[]) || [])),
        ])
      ),
    })) as WishlistItem[]
  } catch {
    return []
  }
}

// Returns an array of item IDs saved in the logged-in customer's wishlist.
export const getCustomerWishlistIds = async (): Promise<string[]> => {
  try {
    const list = await getWishlist()
    return list
      .map((item) => item._id)
      .filter((id): id is string => Boolean(id))
  } catch {
    return []
  }
}
