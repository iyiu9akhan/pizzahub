export const dynamic = "force-dynamic"
import { requireRole } from "@/lib/core/server"
import { getManageItems } from "@/lib/api/items"
import ManageProducts from "@/components/dashboard/admin/product/ManageProducts"
import { MenuItemData } from "@/components/menu/MenuItemCard"

const AdminProductsPage = async () => {
  await requireRole("admin")

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

  return <ManageProducts initialItems={items} />
}

export default AdminProductsPage
