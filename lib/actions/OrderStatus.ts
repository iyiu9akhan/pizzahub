"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function updateOrderStatus(
  id: string,
  update: { status?: string; fulfillmentStatus?: string }
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const response = await authFetch(`${BASE_URL}/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update order",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/vendor/orders")
    revalidatePath("/dashboard/admin/orders")
    revalidatePath("/dashboard/customer/my-orders")
    revalidatePath("/dashboard/customer")
    revalidatePath("/dashboard/vendor")

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

// Customer cancels own pending order (PATCH /orders/:id/cancel)
export async function cancelOrderAction(
  id: string
): Promise<{ success: boolean; message?: string; code?: string }> {
  try {
    const response = await authFetch(`${BASE_URL}/orders/${id}/cancel`, {
      method: "PATCH",
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to cancel order",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/customer/my-orders")
    revalidatePath("/dashboard/customer")
    revalidatePath("/dashboard/vendor/orders")
    revalidatePath("/dashboard/admin/orders")

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
