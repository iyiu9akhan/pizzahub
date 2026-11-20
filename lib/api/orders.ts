const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get all orders (used by vendor orders page)
export async function getOrders(options?: { vendorId?: string }) {
  if (!options?.vendorId) return []

  const response = await fetch(
    `${BASE_URL}/orders?vendorId=${encodeURIComponent(options.vendorId)}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}

// Get orders for a specific customer — always fresh (no cache)
export async function getOrdersByCustomerId(customerId: string) {
  const response = await fetch(`${BASE_URL}/orders?customerId=${customerId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch customer orders")
  }

  return response.json()
}

// Get count of active orders for a customer (used by cart badge in navbar)
// Active = not delivered and not rejected/cancelled
export async function getCustomerActiveOrdersCount(
  customerId: string
): Promise<number> {
  try {
    const orders = await getOrdersByCustomerId(customerId)
    if (!Array.isArray(orders)) return 0

    // Count orders that belong to this customer and are still in progress
    const active = orders.filter(
      (o: {
        customerId?: string
        status?: string
        fulfillmentStatus?: string
      }) => {
        if (o.customerId && o.customerId !== customerId) return false
        const done =
          o.status === "rejected" ||
          o.status === "cancelled" ||
          o.fulfillmentStatus === "delivered"
        return !done
      }
    )
    return active.length
  } catch {
    return 0
  }
}

// Update an order (status or fulfillmentStatus)
export async function updateOrderStatus(
  id: string,
  update: { status?: string; fulfillmentStatus?: string }
) {
  const response = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  })

  if (!response.ok) {
    throw new Error("Failed to update order")
  }

  return response.json()
}

export default getOrders
