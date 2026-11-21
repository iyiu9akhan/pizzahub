import "server-only"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { authFetch } from "@/lib/core/server"
import type { ManagedUser, UserRole } from "@/types/user"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getUsers = async () => {
  return auth.api.listUsers({
    query: { sortBy: "name", sortDirection: "desc" },
    headers: await headers(),
  })
}

// Fixed locale + UTC: server/client same output (hydration safe)
const formatDate = (d: Date | string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(d))

export const getManagedUsers = async (): Promise<ManagedUser[]> => {
  try {
    const res = await authFetch(`${BASE_URL}/users`)
    if (res.ok) {
      const data = await res.json()
      const rawList = Array.isArray(data) ? data : data?.users || []
      return rawList.map((u: {
        _id?: string
        id?: string
        name?: string
        email?: string
        image?: string | null
        role?: string
        restricted?: boolean
        banned?: boolean
        emailVerified?: boolean
        createdAt?: string | Date
      }) => ({
        id: u._id || u.id || "",
        name: u.name || "User",
        email: u.email || "",
        image: u.image ?? null,
        role: (u.role as UserRole) ?? "customer",
        restricted: Boolean(u.restricted || u.banned),
        emailVerified: Boolean(u.emailVerified),
        joinedAt: u.createdAt ? formatDate(u.createdAt) : "",
      }))
    }
  } catch {
    // Fallback to Better Auth local user collection if backend endpoint is unavailable
  }

  const { users } = await getUsers()
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image ?? null,
    role: (u.role as UserRole) ?? "customer",
    restricted: Boolean(u.banned),
    emailVerified: u.emailVerified,
    joinedAt: formatDate(u.createdAt),
  }))
}

// Private read: fetch vendor premium status via authFetch (GET /users/:id/premium)
export const getPremiumVendorById = async (
  userId: string
): Promise<{ isVendor: boolean; premium: boolean }> => {
  try {
    const res = await authFetch(`${BASE_URL}/users/${userId}/premium`)
    if (!res.ok) return { isVendor: false, premium: false }
    const data = await res.json()
    return {
      isVendor: Boolean(data?.isVendor),
      premium: Boolean(data?.premium),
    }
  } catch {
    return { isVendor: false, premium: false }
  }
}
