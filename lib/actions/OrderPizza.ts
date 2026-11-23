"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"
import type { OrderPizzaInput } from "@/types/OrderPizzaType"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Customer places an order (POST /order)
// NEVER send customerId, price, total, vendorId, or status.
export async function OrderPizza(data: OrderPizzaInput): Promise<{
  success: boolean
  message?: string
  code?: string
  order?: unknown
}> {
  try {
    const payload = {
      items: data.items.map((i) => ({
        itemId: i.itemId,
        quantity: i.quantity,
      })),
      deliveryAddress: data.deliveryAddress.trim(),
      customerPhone: data.customerPhone.trim(),
      deliveryDate: data.deliveryDate,
      message: data.message ? data.message.trim().slice(0, 500) : "",
    }

    const response = await authFetch(`${BASE_URL}/order`, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to place order",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/customer/my-orders")
    revalidatePath("/dashboard/customer")
    revalidatePath("/dashboard/vendor/orders")
    revalidatePath("/dashboard/admin/orders")

    return {
      success: true,
      order: result,
    }
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
    return {
      success: false,
      message: "Network error occurred",
    }
  }
}

export async function placeOrderAction(data: OrderPizzaInput) {
  return OrderPizza(data)
}
