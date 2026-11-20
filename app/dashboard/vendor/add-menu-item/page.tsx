// Add Menu Item page — /dashboard/vendor/add-menu-item
// Collects form values, uploads images via ImgBB proxy, then POSTs to the API.
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PackagePlus, Clock } from "lucide-react"
import AddMenuItemForm from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemForm"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { createItem } from "@/lib/actions/CreateItem"
import { toastSuccess, toastError } from "@/lib/toast"

export default function AddMenuItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission: upload images then create the item
  const handleCreate = async (values: AddMenuItemFormValues) => {
    setIsSubmitting(true)
    try {
      await createItem(values)
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

        {/* Admin review notice */}
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 font-text text-xs text-ink-muted sm:self-auto">
          <Clock className="h-4 w-4 text-brand-fg" />
          Reviewed by an admin before it goes live
        </div>
      </div>

      <AddMenuItemForm
        mode="create"
        onSubmit={handleCreate}
        onCancel={() => router.push("/dashboard/vendor/menu-items")}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
