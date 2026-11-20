const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getOrders() {
  const response = await fetch(`${BASE_URL}/orders`)

  if (!response.ok) {
    throw new Error("Failed to fetch orders")
  }

  return response.json()
}

export default getOrders