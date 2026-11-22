// Edit menu item page — /dashboard/vendor/menu-items/[id]/edit
// Server component: loads item data on server and renders client edit form
export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
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
    notFound()
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
