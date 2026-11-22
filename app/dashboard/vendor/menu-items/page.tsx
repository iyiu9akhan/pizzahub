// Vendor menu items list page — /dashboard/vendor/menu-items
// Fetches vendor's own items via GET /items/manage
export const dynamic = "force-dynamic"

import { requireRole } from "@/lib/core/server"
import { getManageItems } from "@/lib/api/items"
import VendorMenuItemsGrid from "@/components/dashboard/vendor/menuItems/VendorMenuItemsGrid"
import { MenuItemData } from "@/components/menu/MenuItemCard"

const MenuItemsPage = async () => {
  await requireRole("vendor")

  let items: MenuItemData[] = []
  try {
    const raw = await getManageItems()
    const list = Array.isArray(raw) ? raw : raw?.items || []

    items = list.map((item: Record<string, unknown>) => ({
      ...item,
      images: [
        ...((item.images as string[]) ?? []),
        ...((item.existingImages as string[]) ?? []),
      ],
    })) as MenuItemData[]
  } catch {
    items = []
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          My Menu Items
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Manage your restaurant&apos;s menu items and track their approval status.
        </p>
      </div>

      <VendorMenuItemsGrid initialItems={items} />
    </div>
  )
}

export default MenuItemsPage
