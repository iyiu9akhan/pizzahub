// Customer dashboard overview page — /dashboard/customer
// Server component: fetches order stats and shows a simple summary.
export const dynamic = "force-dynamic"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getOrdersByCustomerId } from "@/lib/api/orders"
import { CustomerOrder } from "@/types/order"
import Link from "next/link"
import {
  ShoppingBag,
  Clock,
  PackageCheck,
  XCircle,
  ChevronRight,
  Activity,
} from "lucide-react"

// A stat card shown on the overview page
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p className="font-heading text-2xl font-bold tracking-tight text-ink">
          {value}
        </p>
        <p className="mt-0.5 text-sm font-medium text-ink-muted">{label}</p>
      </div>
    </div>
  )
}

const CustomerDashboardPage = async () => {
  // Get session server-side to identify the customer
  const session = await auth.api.getSession({ headers: await headers() })
  const customerId = session?.user?.id
  const userName = session?.user?.name || "Customer"

  let orders: CustomerOrder[] = []

  if (customerId) {
    try {
      const raw = await getOrdersByCustomerId(customerId)
      const list: CustomerOrder[] = Array.isArray(raw) ? raw : []

      // Show only orders for this customer
      orders = list.filter((o) => o.customerId === customerId)
    } catch {
      orders = []
    }
  }

  // Compute stats from the fetched orders
  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length

  const activeOrders = orders.filter((o) => {
    const isCancelled =
      o.status === "rejected" || o.status === "cancelled"

    const isDelivered = o.fulfillmentStatus === "delivered"

    const isActive =
      o.status === "accepted" ||
      o.fulfillmentStatus === "cooking" ||
      o.fulfillmentStatus === "on_the_way"

    return isActive && !isCancelled && !isDelivered
  }).length

  const deliveredOrders = orders.filter(
    (o) => o.fulfillmentStatus === "delivered"
  ).length

  const cancelledOrders = orders.filter(
    (o) => o.status === "rejected" || o.status === "cancelled"
  ).length

  // The 3 most recent orders for a quick-look list
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 3)

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Welcome back, {userName}!
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Here&apos;s an overview of your pizza orders.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          color="bg-brand-soft text-brand-fg"
        />

        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="h-5 w-5" />}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        />

        <StatCard
          label="Active Orders"
          value={activeOrders}
          icon={<Activity className="h-5 w-5" />}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        />

        <StatCard
          label="Delivered"
          value={deliveredOrders}
          icon={<PackageCheck className="h-5 w-5" />}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />

        <StatCard
          label="Cancelled Orders"
          value={cancelledOrders}
          icon={<XCircle className="h-5 w-5" />}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
      </div>

      {/* Recent orders quick-look */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-ink">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Your latest order activity
            </p>
          </div>

          <Link
            href="/dashboard/customer/my-orders"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-brand-fg transition-colors hover:bg-brand-soft"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          // Empty state shown when there are no orders
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-4 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
              <ShoppingBag className="h-6 w-6" />
            </span>

            <p className="font-heading text-base font-semibold text-ink">
              No orders yet
            </p>

            <p className="max-w-sm text-sm text-ink-muted">
              Your order history will appear here once you place your first order.
            </p>

            <Link
              href="/menu"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-heading font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse Menu
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="divide-y divide-line">
              {recentOrders.map((order) => {
                const firstName =
                  order.items?.[0]?.itemName ||
                  order.items?.[0]?.name ||
                  "Order"

                const isDelivered =
                  order.fulfillmentStatus === "delivered"

                const isCancelled =
                  order.status === "rejected" ||
                  order.status === "cancelled"

                const isPending = order.status === "pending"

                const statusLabel = isDelivered
                  ? "Delivered"
                  : isCancelled
                    ? order.status === "rejected"
                      ? "Rejected"
                      : "Cancelled"
                    : isPending
                      ? "Pending"
                      : order.fulfillmentStatus === "cooking"
                        ? "Cooking"
                        : order.fulfillmentStatus === "on_the_way"
                          ? "On the way"
                          : "Accepted"

                const statusStyle = isDelivered
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : isCancelled
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : isPending
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"

                return (
                  <div
                    key={order._id}
                    className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                        <ShoppingBag className="h-4 w-4" />
                      </span>

                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-semibold text-ink">
                          {firstName}
                          {order.items.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </p>

                        <p className="mt-1 text-xs text-ink-muted">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-BD",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboardPage