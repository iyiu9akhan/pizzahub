const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Get all orders
export async function getOrders() {
  const response = await fetch(`${BASE_URL}/orders`, { cache: "no-store" })

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
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