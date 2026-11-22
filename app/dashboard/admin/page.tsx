// Admin dashboard overview page — /dashboard/admin
export const dynamic = "force-dynamic"

import React from "react"
import { requireRole } from "@/lib/core/server"
import { getStats } from "@/lib/api/stats"
import { formatUSD } from "@/lib/format"
import {
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  Pizza,
} from "lucide-react"

import OrdersAreaChart from "@/components/dashboard/charts/OrdersAreaChart"
import OrdersStatusDonutChart from "@/components/dashboard/charts/OrdersStatusDonutChart"
import UsersByRoleDonutChart from "@/components/dashboard/charts/UsersByRoleDonutChart"
import ItemsByStatusChart from "@/components/dashboard/charts/ItemsByStatusChart"

export const metadata = {
  title: "Admin Dashboard - PizzaHub",
  description: "Platform performance, revenue metrics, and system breakdown.",
}

export default async function AdminDashboardPage() {
  await requireRole("admin")
  const stats = await getStats("admin")

  const cards = stats?.cards || {}
  const charts = stats?.charts || {}

  const daily = charts.daily || []
  const ordersByStatus = charts.ordersByStatus || {}
  const usersByRole = charts.usersByRole || {}
  const itemsByStatus = charts.itemsByStatus || {}

  // Order revenue is in USD
  const orderRevenue = cards.orderRevenue ?? cards.revenue ?? cards.totalRevenue ?? 0
  // Subscription revenue is in USD
  const subscriptionRevenue = cards.subscriptionRevenue ?? cards.subRevenue ?? 0
  const totalOrders = cards.orders ?? cards.totalOrders ?? 0
  const registeredUsers = cards.users ?? cards.totalUsers ?? 0
  const activeItems = cards.items ?? cards.totalItems ?? 0

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 font-text text-sm text-ink-muted">
          Platform performance, sales metrics, and system breakdown.
        </p>
      </div>

      {/* Stat Cards Grid (5 cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Order Revenue (USD) */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
            <TrendingUp className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-xl font-extrabold text-ink truncate">
              {formatUSD(orderRevenue)}
            </p>
            <p className="font-text text-xs text-ink-muted">Order Revenue</p>
          </div>
        </div>

        {/* Subscription Revenue (USD) */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <CreditCard className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-xl font-extrabold text-ink truncate">
              {formatUSD(subscriptionRevenue)}
            </p>
            <p className="font-text text-xs text-ink-muted">Sub Revenue</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-xl font-extrabold text-ink truncate">
              {totalOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Total Orders</p>
          </div>
        </div>

        {/* Registered Users */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-xl font-extrabold text-ink truncate">
              {registeredUsers}
            </p>
            <p className="font-text text-xs text-ink-muted">Registered Users</p>
          </div>
        </div>

        {/* Active Items */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Pizza className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-xl font-extrabold text-ink truncate">
              {activeItems}
            </p>
            <p className="font-text text-xs text-ink-muted">Menu Items</p>
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Orders Trend & Orders by Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[340px]">
        <OrdersAreaChart
          data={daily}
          title="Platform Orders Trend"
          description="Total pizza orders across all vendors over the last 7 days"
        />
        <OrdersStatusDonutChart
          data={ordersByStatus}
          title="Orders by Status"
        />
      </div>

      {/* Row 2 Charts: Users by Role & Items by Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[340px]">
        <UsersByRoleDonutChart data={usersByRole} />
        <ItemsByStatusChart data={itemsByStatus} />
      </div>
    </div>
  )
}
