const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Fetch all items (used on vendor list page and home featured section)
export const getItems = async () => {
  const res = await fetch(`${BASE_URL}/items`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch items")
  return res.json()
}

// Fetch a single item by ID (used on edit page)
export const getItemById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, { cache: "no-store" })
  if (!res.ok) return null // Caller shows "not found" state
  return res.json()
}

// Update an existing item (PUT /items/:id)
export const updateItem = async (id: string, payload: Record<string, unknown>) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to update menu item")
  return result
}

// Delete an item by ID (DELETE /items/:id)
export const deleteItem = async (id: string) => {
  const res = await fetch(`${BASE_URL}/items/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const result = await res.json().catch(() => ({}))
    throw new Error(result.message || "Failed to delete menu item")
  }
  return true
}

// Return the count of pending vendor orders.
// If the endpoint does not exist yet, we fall back to 0 so the navbar never crashes.
export const getPendingOrdersCount = async (): Promise<number> => {
  try {
    const res = await fetch(`${BASE_URL}/orders/pending-count`, {
      cache: "no-store",
    })
    if (!res.ok) return 0
    const data = await res.json()
    return typeof data?.count === "number" ? data.count : 0
  } catch {
    // Endpoint may not exist yet — return 0 safely
    return 0
  }
}
