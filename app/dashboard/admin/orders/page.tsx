// Admin orders management page — /dashboard/admin/orders
export const dynamic = "force-dynamic"

import React from "react"
import { requireRole } from "@/lib/core/server"
import { getOrders } from "@/lib/api/orders"
import ManageOrders from "@/components/dashboard/admin/orders/ManageOrders"

const AdminOrdersPage = async () => {
  await requireRole("admin")

  let orders = []
  try {
    const raw = await getOrders()
    orders = Array.isArray(raw) ? raw : raw?.orders || []
  } catch {
    orders = []
  }

  return <ManageOrders initialOrders={orders} />
}

export default AdminOrdersPage
