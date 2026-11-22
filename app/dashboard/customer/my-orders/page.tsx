// Customer my-orders page — /dashboard/customer/my-orders
// Server component: fetches the logged-in customer's orders and renders a card per order.
export const dynamic = "force-dynamic"

import { requireRole } from "@/lib/core/server"
import { getOrders } from "@/lib/api/orders"
import MyOrderCard from "@/components/dashboard/customer/MyOrderCard"
import { CustomerOrder } from "@/types/order"
import { ShoppingBag } from "lucide-react"

const MyOrdersPage = async () => {
  await requireRole("customer")

  let orders: CustomerOrder[] = []
  try {
    const raw = await getOrders()
    orders = Array.isArray(raw) ? raw : raw?.orders || []
  } catch {
    orders = []
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Track the status of all your pizza orders.
        </p>
      </div>

      {/* Order list or empty state */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-surface py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
            <ShoppingBag className="h-8 w-8" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-ink">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Your pizza orders will appear here once you place one.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[...orders]
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
            )
            .map((order) => (
              <MyOrderCard key={order._id} order={order} />
            ))}
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
