"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getSession } from "@/lib/core/server"
import { uploadToImgBB } from "@/lib/core/imgbb"

/**
 * Server action to update the authenticated user's profile image.
 * Derived strictly from session cookie; never accepts userId or image URL from client.
 */
export async function updateProfileImage(
  formData: FormData
): Promise<{ success: boolean; message?: string; image?: string }> {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, message: "Not logged in" }
    }

    const file = formData.get("file") as File | null
    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, message: "Invalid image type or size" }
    }

    const imageUrl = await uploadToImgBB(file)

    await auth.api.updateUser({
      body: { image: imageUrl },
      headers: await headers(),
    })

    revalidatePath("/", "layout")
    return { success: true, image: imageUrl }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update profile image"
    return { success: false, message }
  }
}

/**
 * Server action to remove the authenticated user's profile image (resets to null/empty).
 */
export async function removeProfileImage(): Promise<{
  success: boolean
  message?: string
}> {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, message: "Not logged in" }
    }

    await auth.api.updateUser({
      body: { image: "" },
      headers: await headers(),
    })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to remove profile image"
    return { success: false, message }
  }
}
