"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function addToWishlistAction(
  itemId: string
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/wishlist`, {
      method: "POST",
      body: JSON.stringify({ itemId }),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to add to wishlist",
        code: result.code,
      }
    }

    revalidatePath("/menu")
    revalidatePath(`/menu/${itemId}`)
    revalidatePath("/dashboard/customer/wishlist")
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

export async function removeFromWishlistAction(
  itemId: string
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/wishlist/${itemId}`, {
      method: "DELETE",
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to remove from wishlist",
        code: result.code,
      }
    }

    revalidatePath("/menu")
    revalidatePath(`/menu/${itemId}`)
    revalidatePath("/dashboard/customer/wishlist")
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
