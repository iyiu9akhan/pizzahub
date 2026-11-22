"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function addReviewAction(data: {
  itemId: string
  rating: number
  comment?: string
}): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to submit review",
        code: result.code,
      }
    }

    revalidatePath(`/menu/${data.itemId}`)
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

export async function deleteReviewAction(
  reviewId: string,
  itemId?: string
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete review",
        code: result.code,
      }
    }

    if (itemId) {
      revalidatePath(`/menu/${itemId}`)
    }
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
