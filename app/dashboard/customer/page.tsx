// Customer dashboard overview page — /dashboard/customer
export const dynamic = "force-dynamic"

import React from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Clock,
  PackageCheck,
  ChevronRight,
  TrendingUp,
  Pizza,
} from "lucide-react"

import { requireRole } from "@/lib/core/server"
import { getStats } from "@/lib/api/stats"
import { getOrders } from "@/lib/api/orders"
import { formatUSD } from "@/lib/format"
import type { CustomerOrder } from "@/types/order"

import CustomerSpendingChart from "@/components/dashboard/charts/CustomerSpendingChart"
import OrdersStatusDonutChart from "@/components/dashboard/charts/OrdersStatusDonutChart"

export const metadata = {
  title: "Customer Overview - PizzaHub",
  description: "Track your orders, pizza spending, and dining activity.",
}

export default async function CustomerDashboardPage() {
  const session = await requireRole("customer")
  const userName = session.user.name || "Customer"

  const [stats, rawOrders] = await Promise.all([
    getStats("customer"),
    getOrders().catch(() => []),
  ])

  const orders: CustomerOrder[] = Array.isArray(rawOrders)
    ? rawOrders
    : rawOrders?.orders || []

  const cards = stats?.cards || {}
  const charts = stats?.charts || {}

  const daily = charts.daily || []
  const ordersByStatus = charts.ordersByStatus || {}

  const totalOrders = cards.orders ?? cards.totalOrders ?? orders.length
  const totalSpent = cards.spending ?? cards.revenue ?? cards.totalSpending ?? 0
  const pendingOrders =
    cards.pendingOrders ??
    orders.filter((o) => o.status === "pending").length
  const deliveredOrders =
    cards.deliveredOrders ??
    orders.filter((o) => o.fulfillmentStatus === "delivered").length

  // 3 most recent orders for quick display
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 3)

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 font-text text-sm text-ink-muted">
            Here is a snapshot of your pizza orders, spending, and recent deliveries.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 self-start rounded-full bg-brand px-5 py-2.5 font-heading text-xs font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 sm:self-auto"
        >
          <Pizza className="h-4 w-4" />
          <span>Order Fresh Pizza</span>
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {formatUSD(totalSpent)}
            </p>
            <p className="font-text text-xs text-ink-muted">Total Spent</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {totalOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Total Orders</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {pendingOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Pending Kitchen Approval</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
            <PackageCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {deliveredOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Delivered</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-85">
        <CustomerSpendingChart data={daily} />
        <OrdersStatusDonutChart
          data={ordersByStatus}
          title="My Orders by Status"
        />
      </div>

      {/* Recent Orders List */}
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">Recent Orders</h2>
            <p className="mt-0.5 font-text text-xs text-ink-muted">
              Quick view of your latest pizza orders
            </p>
          </div>
          <Link
            href="/dashboard/customer/my-orders"
            className="inline-flex items-center gap-1 font-heading text-xs font-semibold text-brand-fg hover:underline"
          >
            <span>View all</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No orders placed yet
            </p>
            <p className="mt-1 font-text text-xs text-ink-muted">
              Your pizza orders will appear here once submitted.
            </p>
            <Link
              href="/menu"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 font-heading text-xs font-semibold text-white shadow-sm"
            >
              Browse Pizzas
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line">
            {recentOrders.map((order) => {
              const firstItem = order.items?.[0]
              const itemsCount =
                order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1

              return (
                <div
                  key={order._id}
                  className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-heading text-sm font-bold text-ink">
                      {firstItem?.itemName || "Delicious Pizza"}
                      {order.items && order.items.length > 1 && (
                        <span className="font-text text-xs text-ink-muted ml-1">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </p>
                    <p className="font-text text-xs text-ink-muted">
                      {itemsCount} {itemsCount === 1 ? "item" : "items"} •{" "}
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-heading text-sm font-bold text-ink">
                      {formatUSD(order.totalAmount)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-heading text-[11px] font-semibold capitalize ${
                        order.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                          : order.fulfillmentStatus === "delivered"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : order.status === "rejected" || order.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
                      }`}
                    >
                      {order.fulfillmentStatus || order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
