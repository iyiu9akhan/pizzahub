import "server-only"
import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface TransactionRow {
  _id?: string
  id?: string
  userId?: string
  customer_email?: string
  amount: number
  currency?: string
  payment_status: string
  sessionId?: string
  createdAt?: string
}

export const getTransactions = async (): Promise<TransactionRow[]> => {
  try {
    const res = await authFetch(`${BASE_URL}/transactions`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : data?.transactions || []
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw err
    }
    return []
  }
}

export interface StatsResponse {
  cards?: Record<string, number>
  charts?: {
    daily?: Array<{ date: string; orders: number; revenue: number }>
    ordersByStatus?: Record<string, number>
    itemsByStatus?: Record<string, number>
    usersByRole?: Record<string, number>
    topItems?: Array<{ name: string; sold: number }>
  }
}

export const getStats = async (
  role: "admin" | "vendor" | "customer"
): Promise<StatsResponse | null> => {
  try {
    const res = await authFetch(`${BASE_URL}/stats/${role}`)
    if (!res.ok) return null
    return res.json()
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw err
    }
    return null
  }
}
