import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
  getCustomerPendingOrdersCount,
  getVendorActiveOrdersCount,
} from "@/lib/api/orders"

export const getSession = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

// Server-side helper to fetch header badge order count based on logged-in role
export const getHeaderOrderCount = async (): Promise<number> => {
  "use server"
  try {
    const session = await getSession()
    if (!session?.user?.id) return 0
    const role = (session.user as { role?: string }).role || "customer"
    if (role === "customer") {
      return await getCustomerPendingOrdersCount(session.user.id)
    }
    if (role === "vendor") {
      return await getVendorActiveOrdersCount(session.user.id)
    }
    return 0
  } catch {
    return 0
  }
}
