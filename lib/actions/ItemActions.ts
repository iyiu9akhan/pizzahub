"use server"

import { authFetch } from "@/lib/core/server"
import { revalidatePath } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface MenuItemPayload {
  itemName: string
  category: string
  description?: string
  price: number
  location: string
  images: string[]
}

export async function createItem(data: MenuItemPayload): Promise<{
  success: boolean
  message?: string
  code?: string
}> {
  try {
    const res = await authFetch(`${BASE_URL}/items`, {
      method: "POST",
      body: JSON.stringify(data),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to create menu item",
        code: result.code || (res.status === 403 ? "LIMIT_REACHED" : undefined),
      }
    }

    revalidatePath("/dashboard/vendor/menu-items")
    revalidatePath("/dashboard/vendor")
    revalidatePath("/dashboard/admin/items")
    revalidatePath("/menu")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { success: false, message: "Network error occurred" }
  }
}

export async function editItem(
  id: string,
  data: MenuItemPayload
): Promise<{
  success: boolean
  message?: string
  code?: string
}> {
  try {
    const res = await authFetch(`${BASE_URL}/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update menu item",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/vendor/menu-items")
    revalidatePath("/dashboard/admin/items")
    revalidatePath(`/menu/${id}`)
    revalidatePath("/menu")

    return { success: true }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { success: false, message: "Network error occurred" }
  }
}

export async function deleteItem(id: string): Promise<{
  success: boolean
  message?: string
  code?: string
}> {
  try {
    const res = await authFetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE",
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete item",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/vendor/menu-items")
    revalidatePath("/dashboard/admin/items")
    revalidatePath("/menu")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { success: false, message: "Network error occurred" }
  }
}

export async function updateItemStatus(
  id: string,
  status: "pending" | "approved" | "rejected" | "inactive"
): Promise<{
  success: boolean
  message?: string
  code?: string
}> {
  try {
    const res = await authFetch(`${BASE_URL}/items/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update item status",
        code: result.code,
      }
    }

    revalidatePath("/dashboard/admin/items")
    revalidatePath("/dashboard/vendor/menu-items")
    revalidatePath(`/menu/${id}`)
    revalidatePath("/menu")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { success: false, message: "Network error occurred" }
  }
}

export async function toggleItemAvailability(
  id: string,
  status: "approved" | "inactive"
): Promise<{
  success: boolean
  message?: string
  code?: string
}> {
  try {
    const res = await authFetch(`${BASE_URL}/items/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })

    const result = await res.json().catch(() => ({}))

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to update item availability",
        code: result.code || (res.status === 403 ? "LIMIT_REACHED" : undefined),
      }
    }

    revalidatePath("/dashboard/vendor/menu-items")
    revalidatePath("/dashboard/admin/items")
    revalidatePath(`/menu/${id}`)
    revalidatePath("/menu")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { success: false, message: "Network error occurred" }
  }
}
