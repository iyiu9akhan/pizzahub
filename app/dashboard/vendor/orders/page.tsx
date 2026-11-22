// Vendor customer orders page — /dashboard/vendor/orders
export const dynamic = "force-dynamic"

import React from "react"
import { getOrders } from "@/lib/api/orders"
import VendorOrdersClient from "@/components/dashboard/vendor/customerOrders/VendorOrdersClient"
import { requireRole } from "@/lib/core/server"

const VendorOrdersPage = async () => {
  await requireRole("vendor")

  let orders = []
  let hasError = false

  try {
    const raw = await getOrders()
    orders = Array.isArray(raw) ? raw : raw?.orders || []
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    hasError = true
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Customer Orders
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Review incoming orders and update their status.
        </p>
      </div>

      {hasError ? (
        <div className="rounded-2xl border border-line bg-surface p-12 text-center">
          <p className="font-heading text-base font-semibold text-ink">
            Could not load orders
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Please check your connection and refresh the page.
          </p>
        </div>
      ) : (
        <VendorOrdersClient
          initialOrders={Array.isArray(orders) ? orders : []}
        />
      )}
    </div>
  )
}

export default VendorOrdersPage
