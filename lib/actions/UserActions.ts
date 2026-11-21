"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@/types/user"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update role",
        code: data?.code,
      }
    }
    revalidatePath("/dashboard/admin/users")
    return { success: true }
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
    return { success: false, message: "Network error occurred" }
  }
}

export async function setUserRestricted(
  userId: string,
  restricted: boolean,
  reason?: string
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/users/${userId}/restrict`, {
      method: "PATCH",
      body: JSON.stringify({ restricted, reason }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update restriction",
        code: data?.code,
      }
    }
    revalidatePath("/dashboard/admin/users")
    return { success: true }
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
    return { success: false, message: "Network error occurred" }
  }
}
