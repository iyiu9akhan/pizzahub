// Server-side action that creates a menu item.
// Uploads new image Files to ImgBB first, then sends ONE merged images[] to the API.
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { getPremiumVendorById } from "@/lib/api/users"
import { getItemCount } from "@/lib/api/items"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Upload a single File to ImgBB via our internal proxy route handler.
// Returns the hosted image URL.
async function uploadFileToImgBB(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Image upload failed")
  }
  return data.url as string
}

// Create a new menu item.
// Uploads any new File images first, then merges with existing URL images.
// Sends only `images: string[]` to the backend — never sends `existingImages`.
export const createItem = async (data: AddMenuItemFormValues) => {
  // Server-side limit check: skip limit when vendor is premium
  if (data.vendorId) {
    const { isVendor, premium } = await getPremiumVendorById(data.vendorId)
    if (isVendor && !premium) {
      const count = await getItemCount({ vendorId: data.vendorId })
      if (count >= 3) {
        throw new Error("LIMIT_REACHED: Free plan limit reached. Upgrade to Premium.")
      }
    }
  }

  // Upload new File images in parallel
  const uploadedUrls = await Promise.all(data.images.map(uploadFileToImgBB))

  // Merge existing URLs + newly uploaded URLs into one array
  const images = [...(data.existingImages ?? []), ...uploadedUrls]

  const payload = {
    itemName: data.itemName,
    category: data.category,
    description: data.description,
    price: data.price,
    location: data.location,
    images, // single field — no existingImages sent to backend
    ...(data.vendorId ? { vendorId: data.vendorId } : {}),
    ...(data.vendorName ? { vendorName: data.vendorName } : {}),
    // TODO(admin): re-enable approval filter after admin panel is built
    status: data.status ?? "pending",
  }

  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  })

  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to create menu item")
  return result
}

// Update an existing menu item (used by the edit page).
// Same image merge logic as createItem.
export const editItem = async (id: string, data: AddMenuItemFormValues) => {
  // Upload new File images in parallel
  const uploadedUrls = await Promise.all(data.images.map(uploadFileToImgBB))

  // Merge existing URLs + newly uploaded URLs
  const images = [...(data.existingImages ?? []), ...uploadedUrls]

  const payload = {
    itemName: data.itemName,
    category: data.category,
    description: data.description,
    price: data.price,
    location: data.location,
    images,
  }

  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  })

  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to update menu item")
  return result
}
