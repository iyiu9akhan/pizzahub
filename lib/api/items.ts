import "server-only"
import { ObjectId } from "mongodb"
import { authFetch } from "@/lib/core/server"
import { db } from "@/lib/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Helper to fetch the set of vendor IDs who have an active premium subscription.
 */
async function getPremiumVendorIds(): Promise<Set<string>> {
  try {
    const vendors = await db
      .collection("user")
      .find({ role: "vendor", premium: true }, { projection: { _id: 1 } })
      .toArray()
    return new Set(vendors.map((v) => v._id.toString()))
  } catch {
    return new Set()
  }
}

export interface GetItemsParams {
  q?: string
  category?: string
  location?: string
  sort?: string
  vendorId?: string
}

// Public read: fetch all approved items, enriched with vendor premium status
export const getItems = async (params?: GetItemsParams) => {
  const searchParams = new URLSearchParams()
  if (params?.q) searchParams.set("q", params.q)
  if (params?.category && params.category !== "All") {
    searchParams.set("category", params.category)
  }
  if (params?.location) searchParams.set("location", params.location)
  if (params?.sort) searchParams.set("sort", params.sort)
  if (params?.vendorId) searchParams.set("vendorId", params.vendorId)

  const qs = searchParams.toString()
  const url = `${BASE_URL}/items${qs ? `?${qs}` : ""}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch items")
  const data = await res.json()
  const list = Array.isArray(data) ? data : data?.items || []

  const premiumVendorIds = await getPremiumVendorIds()

  return list.map((item: Record<string, unknown>) => ({
    ...item,
    isPremiumVendor: item.vendorId ? premiumVendorIds.has(String(item.vendorId)) : false,
  }))
}

// Public read: distinct locations of approved items
export const getItemLocations = async (): Promise<string[]> => {
  try {
    const res = await fetch(`${BASE_URL}/items/locations`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// Public read: fetch a single approved item by ID, enriched with vendor premium status
export const getItemById = async (id: string) => {
  const res = await authFetch(`${BASE_URL}/items/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const item = await res.json()

  if (item && item.vendorId) {
    try {
      const vendor = await db
        .collection("user")
        .findOne(
          { _id: new ObjectId(String(item.vendorId)) },
          { projection: { premium: 1 } }
        )
      item.isPremiumVendor = Boolean(vendor?.premium)
    } catch {
      item.isPremiumVendor = false
    }
  }

  return item
}

// Public read: fetch reviews for an item, enriched with the customer's actual profile info
export const getItemReviews = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/items/${id}/reviews`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    const reviews = Array.isArray(data) ? data : data?.reviews || []

    // Collect all customer IDs from the reviews
    const customerIdStrings = reviews
      .map((r: Record<string, unknown>) => (r.customerId || r.userId) as string)
      .filter(Boolean)

    // Lookup users from the user collection for fresh name & profile picture
    const userMap = new Map<string, { name?: string; image?: string | null }>()

    if (customerIdStrings.length > 0) {
      try {
        const objectIds = customerIdStrings
          .map((cid: string) => {
            try {
              return new ObjectId(cid)
            } catch {
              return null
            }
          })
          .filter(Boolean) as ObjectId[]

        if (objectIds.length > 0) {
          const users = await db
            .collection("user")
            .find(
              { _id: { $in: objectIds } },
              { projection: { name: 1, image: 1 } }
            )
            .toArray()

          users.forEach((u) => {
            userMap.set(u._id.toString(), {
              name: u.name,
              image: u.image ?? null,
            })
          })
        }
      } catch (err) {
        console.error("Error looking up review customers:", err)
      }
    }

    // Return unified reviews with real customer info
    return reviews.map((r: Record<string, unknown>) => {
      const cid = String(r.customerId || r.userId || "")
      const user = userMap.get(cid)

      const customerName =
        user?.name ||
        (r.customerName as string) ||
        (r.userName as string) ||
        "Verified Customer"

      const customerImage =
        user?.image !== undefined && user?.image !== null
          ? user.image
          : (r.customerImage as string) || (r.userImage as string) || null

      return {
        ...r,
        _id: String(r._id || ""),
        itemId: String(r.itemId || id),
        customerId: cid,
        userId: cid,
        customerName,
        userName: customerName,
        customerImage,
        userImage: customerImage,
        rating: Number(r.rating || 5),
        comment: String(r.comment || ""),
        createdAt: r.createdAt ? String(r.createdAt) : undefined,
      }
    })
  } catch {
    return []
  }
}

// Private read: vendor gets own items, admin gets all items, enriched with vendor premium status
export const getManageItems = async () => {
  const res = await authFetch(`${BASE_URL}/items/manage`)
  if (!res.ok) throw new Error("Failed to fetch managed items")
  const data = await res.json()
  const list = Array.isArray(data) ? data : data?.items || []

  const premiumVendorIds = await getPremiumVendorIds()

  return list.map((item: Record<string, unknown>) => ({
    ...item,
    isPremiumVendor: item.vendorId ? premiumVendorIds.has(String(item.vendorId)) : false,
  }))
}

// Private read: vendor gets own item count
export const getItemCount = async (): Promise<number> => {
  const res = await authFetch(`${BASE_URL}/items/count`)
  if (!res.ok) return 0
  const data = await res.json()
  return typeof data === "number" ? data : typeof data?.count === "number" ? data.count : 0
}
