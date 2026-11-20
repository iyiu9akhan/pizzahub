// Edit menu item page — /dashboard/vendor/menu-items/[id]/edit
// Loads item data, pre-fills the shared AddMenuItemForm, and saves via PUT.
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PackagePlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AddMenuItemForm from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemForm"
import { MenuItemCardSkeleton } from "@/components/menu/MenuItemCard"
import { getItemById } from "@/lib/api/items"
import { editItem } from "@/lib/actions/CreateItem"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { toastSuccess, toastError } from "@/lib/toast"

// Skeleton shown while the item data is loading
const EditPageSkeleton = () => (
  <div className="w-full p-4 sm:p-6 lg:p-8">
    <div className="mb-8 h-16 w-64 animate-pulse rounded-2xl bg-brand-soft/40" />
    <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2">
      <MenuItemCardSkeleton />
      <MenuItemCardSkeleton />
    </div>
  </div>
)

export default function EditMenuItemPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  // Page states: loading, not-found, or loaded with item data
  const [item, setItem] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch item when page mounts
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getItemById(id)
        if (!data) {
          setNotFound(true)
        } else {
          setItem(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  // Submit handler: upload images, PUT to API, then redirect
  const handleEdit = async (values: AddMenuItemFormValues) => {
    setIsSubmitting(true)
    try {
      await editItem(id, values)
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

  // Show skeleton while data is fetching
  if (isLoading) return <EditPageSkeleton />

  // Friendly error state if item not found
  if (notFound) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-heading text-xl font-bold text-ink">
          Item not found
        </p>
        <p className="font-text text-sm text-ink-muted">
          The menu item you are trying to edit does not exist or has been
          removed.
        </p>
        <Link
          href="/dashboard/vendor/menu-items"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-heading text-sm font-semibold text-ink hover:bg-brand-soft/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to menu items
        </Link>
      </div>
    )
  }

  // Merge images + existingImages from the API response into imageUrls for the form
  const rawImages = (item?.images as string[] | undefined) ?? []
  const rawExisting = (item?.existingImages as string[] | undefined) ?? []
  const imageUrls = [...rawImages, ...rawExisting]

  // Build defaultValues from the fetched item
  const defaultValues = {
    itemName: (item?.itemName as string) ?? "",
    category: (item?.category as string) ?? "",
    description: (item?.description as string) ?? "",
    price: (item?.price as number) ?? 0,
    location: (item?.location as string) ?? "",
    imageUrls,
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
              Update your item details. Changes will be reviewed by an admin.
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

      {/* Reuse AddMenuItemForm in edit mode with pre-filled values */}
      <AddMenuItemForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleEdit}
        onCancel={() => router.push("/dashboard/vendor/menu-items")}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
