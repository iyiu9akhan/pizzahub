import "server-only"
import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get orders based on logged-in user role (customer: own, vendor: own, admin: all with optional filters)
export async function getOrders(options?: {
  vendorId?: string
  customerId?: string
  status?: string
}) {
  const params = new URLSearchParams()
  if (options?.vendorId) params.append("vendorId", options.vendorId)
  if (options?.customerId) params.append("customerId", options.customerId)
  if (options?.status) params.append("status", options.status)
  const qs = params.toString() ? `?${params.toString()}` : ""

  const response = await authFetch(`${BASE_URL}/orders${qs}`)
  if (!response.ok) throw new Error("Failed to fetch orders")
  return response.json()
}

// Customer header badge: pending order count
export async function getCustomerPendingOrdersCount(): Promise<number> {
  try {
    const orders = await getOrders()
    if (!Array.isArray(orders)) return 0
    return orders.filter((o: { status?: string }) => o.status === "pending").length
  } catch {
    return 0
  }
}

// Vendor header badge: undelivered order count
export async function getVendorActiveOrdersCount(): Promise<number> {
  try {
    const orders = await getOrders()
    if (!Array.isArray(orders)) return 0
    return orders.filter((o: { status?: string; fulfillmentStatus?: string }) => {
      if (o.status === "rejected" || o.status === "cancelled") return false
      return o.fulfillmentStatus !== "delivered"
    }).length
  } catch {
    return 0
  }
}

export default getOrders
