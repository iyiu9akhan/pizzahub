const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Fetch items from the backend API with optional vendor filtering
export const getItems = async (options?: { vendorId?: string }) => {
  const res = await fetch(`${BASE_URL}/items`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch items")
  const data = await res.json()

  // If vendorId is provided, filter ONLY by vendorId (never by status/approval for vendor dashboard)
  // TODO(admin): re-enable approval filter after admin panel is built
  if (options?.vendorId && Array.isArray(data)) {
    return data.filter((item: Record<string, unknown>) => {
      const itemVendorId = item.vendorId ?? item.vendor_id ?? item.userId
      return itemVendorId ? String(itemVendorId) === String(options.vendorId) : false
    })
  }

  return data
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
