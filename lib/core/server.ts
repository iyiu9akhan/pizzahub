import "server-only"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { handleApiResponse } from "@/lib/core/handleApiError"

export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() })
}

export const requireRole = async (
  roles: "admin" | "vendor" | "customer" | Array<"admin" | "vendor" | "customer">
) => {
  const session = await getSession()
  if (!session?.user) redirect("/login")
  const allowed = Array.isArray(roles) ? roles : [roles]
  if (!allowed.includes(session.user.role as "admin" | "vendor" | "customer")) {
    redirect("/unauthorized")
  }
  return session
}

export const getToken = async () => {
  const session = await getSession()
  if (!session?.session?.token) redirect("/login")
  return session.session.token
}

export const authFetch = async (api: string, options: RequestInit = {}) => {
  const token = await getToken()
  const res = await fetch(api, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      authorization: `Bearer ${token}`,
    },
  })
  return handleApiResponse(res)
}

// Header order badge: customer = pending, vendor = undelivered
export const getHeaderOrderCount = async (): Promise<number> => {
  const session = await getSession()
  const user = session?.user
  if (!user) return 0

  try {
    const res = await authFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`
    )
    if (!res.ok) return 0
    const orders = await res.json()
    if (!Array.isArray(orders)) return 0

    if (user.role === "customer") {
      return orders.filter((o: { status?: string }) => o.status === "pending").length
    }
    if (user.role === "vendor") {
      return orders.filter(
        (o: { status?: string; fulfillmentStatus?: string }) =>
          o.status !== "rejected" &&
          o.status !== "cancelled" &&
          o.fulfillmentStatus !== "delivered"
      ).length
    }
    return 0
  } catch {
    return 0
  }
}
