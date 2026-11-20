// Vendor menu items list page — /dashboard/vendor/menu-items
// Fetches only THIS vendor's items (filtered by vendorId from server session).
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getItems } from "@/lib/api/items"
import VendorMenuItemsGrid from "@/components/dashboard/vendor/menuItems/VendorMenuItemsGrid"
import { MenuItemData } from "@/components/menu/MenuItemCard"

const MenuItemsPage = async () => {
  // Get the logged-in vendor's id from the server-side session
  const session = await auth.api.getSession({ headers: await headers() })
  const vendorId = session?.user?.id

  // If vendorId is missing (no session), return an empty list instead of all items
  if (!vendorId) {
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

        <VendorMenuItemsGrid initialItems={[]} />
      </div>
    )
  }

  let items: MenuItemData[] = []
  try {
    // Fetch items for this vendor only; do not filter by status or approval
    // TODO(admin): re-enable approval filter after admin panel is built
    const raw = await getItems({ vendorId })

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
