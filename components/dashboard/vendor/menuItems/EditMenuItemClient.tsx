"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { PackagePlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AddMenuItemForm from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemForm"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { editItem } from "@/lib/actions/ItemActions"
import { uploadImageFile } from "@/lib/utils/upload"
import { toastSuccess, toastError } from "@/lib/toast"

interface EditMenuItemClientProps {
  id: string
  defaultValues: {
    itemName: string
    category: string
    description: string
    price: number
    location: string
    imageUrls: string[]
  }
}

export default function EditMenuItemClient({
  id,
  defaultValues,
}: EditMenuItemClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingText, setLoadingText] = useState("Saving changes…")

  const handleEdit = async (values: AddMenuItemFormValues) => {
    setIsSubmitting(true)
    try {
      if (values.images && values.images.length > 0) {
        setLoadingText("Uploading images…")
      }
      // 1. Upload new File images to /api/upload
      const uploadedUrls = await Promise.all(
        values.images.map((file) => uploadImageFile(file))
      )

      // 2. Merge uploaded URLs with existing image URLs
      const allImages = [...(values.existingImages ?? []), ...uploadedUrls]

      setLoadingText("Saving changes…")
      // 3. Call server action
      const res = await editItem(id, {
        itemName: values.itemName,
        category: values.category,
        description: values.description,
        price: values.price,
        location: values.location,
        images: allImages,
      })

      if (!res.success) {
        toastError("Failed to update item.", res.message)
        return
      }

      toastSuccess("Menu item updated.")
      router.push("/dashboard/vendor/menu-items")
      router.refresh()
    } catch (err) {
      toastError(
        "Failed to update item.",
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
              Edit menu item
            </h1>
            <p className="mt-1 font-text text-sm text-ink-muted">
              Update your item details. Changes will be saved immediately.
            </p>
          </div>
        </div>

        {/* Back link */}
        <Link
          href="/dashboard/vendor/menu-items"
          className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 font-heading text-sm font-semibold text-ink hover:bg-brand-soft/40 sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <AddMenuItemForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleEdit}
        onCancel={() => router.push("/dashboard/vendor/menu-items")}
        isSubmitting={isSubmitting}
        loadingText={loadingText}
      />
    </div>
  )
}
