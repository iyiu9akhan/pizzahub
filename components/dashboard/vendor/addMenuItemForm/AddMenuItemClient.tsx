"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { PackagePlus, Clock } from "lucide-react"
import AddMenuItemForm from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemForm"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { createItem } from "@/lib/actions/ItemActions"
import { uploadImageFile } from "@/lib/utils/upload"
import { toastSuccess, toastError } from "@/lib/toast"
import LimitReachedCard from "@/components/dashboard/vendor/addMenuItemForm/LimitReachedCard"

const FREE_LIMIT = 3

interface AddMenuItemClientProps {
  isPremium: boolean
  itemCount: number
  limitReached: boolean
}

export default function AddMenuItemClient({
  isPremium,
  itemCount,
  limitReached,
}: AddMenuItemClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (values: AddMenuItemFormValues) => {
    setIsSubmitting(true)
    try {
      // 1. Upload new File images to /api/upload
      const uploadedUrls = await Promise.all(
        values.images.map((file) => uploadImageFile(file))
      )

      // 2. Merge uploaded URLs with existing image URLs
      const allImages = [...(values.existingImages ?? []), ...uploadedUrls]

      // 3. Call server action (backend sets vendorId, vendorName, status)
      const res = await createItem({
        itemName: values.itemName,
        category: values.category,
        description: values.description,
        price: values.price,
        location: values.location,
        images: allImages,
      })

      if (!res.success) {
        if (res.code === "LIMIT_REACHED") {
          toastError(
            "Free limit reached",
            "Upgrade to Premium to add more items."
          )
          router.push("/dashboard/vendor/subscription?reason=limit")
          return
        }
        toastError("Failed to add menu item.", res.message)
        return
      }

      toastSuccess("Menu item added. Waiting for admin approval.")
      router.push("/dashboard/vendor/menu-items")
      router.refresh()
    } catch (err) {
      toastError(
        "Failed to add menu item.",
        err instanceof Error ? err.message : undefined
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/25">
            <PackagePlus className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Add menu item
            </h1>
            <p className="mt-1 font-text text-sm text-ink-muted">
              Create a new item for your restaurant menu.
            </p>
          </div>
        </div>

        {/* Usage badge or status */}
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 font-text text-xs text-ink-muted sm:self-auto">
          <Clock className="h-4 w-4 text-brand-fg" />
          {isPremium
            ? "Unlimited items (Premium Vendor)"
            : `${Math.min(itemCount, FREE_LIMIT)} / ${FREE_LIMIT} free items used`}
        </div>
      </div>

      {limitReached ? (
        <LimitReachedCard limit={FREE_LIMIT} used={itemCount} />
      ) : (
        <AddMenuItemForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => router.push("/dashboard/vendor/menu-items")}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
