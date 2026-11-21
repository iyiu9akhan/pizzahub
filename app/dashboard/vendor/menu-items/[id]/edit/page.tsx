// Edit menu item page — /dashboard/vendor/menu-items/[id]/edit
// Server component: loads item data on server and renders client edit form
export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getItemById } from "@/lib/api/items"
import EditMenuItemClient from "@/components/dashboard/vendor/menuItems/EditMenuItemClient"
import { requireRole } from "@/lib/core/server"

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(["vendor", "admin"])
  const { id } = await params
  const item = await getItemById(id)

  if (!item) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-heading text-xl font-bold text-ink">
          Item not found
        </p>
        <p className="font-text text-sm text-ink-muted">
          The menu item you are trying to edit does not exist or has been removed.
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

  const rawImages = (item.images as string[] | undefined) ?? []
  const rawExisting = (item.existingImages as string[] | undefined) ?? []
  const imageUrls = Array.from(new Set([...rawImages, ...rawExisting]))

  const defaultValues = {
    itemName: (item.itemName as string) ?? "",
    category: (item.category as string) ?? "",
    description: (item.description as string) ?? "",
    price: (item.price as number) ?? 0,
    location: (item.location as string) ?? "",
    imageUrls,
  }

  return <EditMenuItemClient id={id} defaultValues={defaultValues} />
}
