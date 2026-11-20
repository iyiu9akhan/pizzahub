// Vendor menu items list page — /dashboard/vendor/menu-items
// Fetches items from the API and passes them to the interactive grid.
import { getItems } from "@/lib/api/items"
import VendorMenuItemsGrid from "@/components/dashboard/vendor/menuItems/VendorMenuItemsGrid"
import { MenuItemData } from "@/components/menu/MenuItemCard"

const MenuItemsPage = async () => {
  // Fetch the vendor's menu items from the backend
  let items: MenuItemData[] = []
  try {
    const raw = await getItems()

    // Normalize: merge images and existingImages arrays so the card always reads item.images
    items = raw.map((item: Record<string, unknown>) => ({
      ...item,
      images: [
        ...((item.images as string[]) ?? []),
        ...((item.existingImages as string[]) ?? []),
      ],
    })) as MenuItemData[]
  } catch {
    // If the API is unreachable, show an empty grid rather than crashing
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
