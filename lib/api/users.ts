const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Fetch vendor premium status from backend (returns { isVendor, premium })
export const getPremiumVendorById = async (
  userId: string
): Promise<{ isVendor: boolean; premium: boolean }> => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/premium`, {
      cache: "no-store",
    })
    if (!response.ok) return { isVendor: false, premium: false }
    const data = await response.json()
    return {
      isVendor: Boolean(data?.isVendor),
      premium: Boolean(data?.premium),
    }
  } catch {
    return { isVendor: false, premium: false }
  }
}
