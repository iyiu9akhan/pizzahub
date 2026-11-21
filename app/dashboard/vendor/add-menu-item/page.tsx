// Add Menu Item page: /dashboard/vendor/add-menu-item
// Server component: loads vendor premium status and item count with authFetch
export const dynamic = "force-dynamic"

import { requireRole } from "@/lib/core/server"
import { getItemCount } from "@/lib/api/items"
import { getPremiumVendorById } from "@/lib/api/users"
import AddMenuItemClient from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemClient"

const FREE_LIMIT = 3

export default async function AddMenuItemPage() {
  const session = await requireRole("vendor")
  const vendorId = session.user.id

  const [itemCount, vendorData] = await Promise.all([
    getItemCount(),
    getPremiumVendorById(vendorId),
  ])

  const isPremium = Boolean(vendorData.isVendor && vendorData.premium)
  const limitReached = !isPremium && itemCount >= FREE_LIMIT

  return (
    <AddMenuItemClient
      isPremium={isPremium}
      itemCount={itemCount}
      limitReached={limitReached}
    />
  )
}
