// Vendor dashboard overview page: /dashboard/vendor
export const dynamic = "force-dynamic"

import React from "react"
import Link from "next/link"
import {
  Package,
  ClipboardList,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

import { requireRole } from "@/lib/core/server"
import { getStats } from "@/lib/api/stats"
import { getPremiumVendorById } from "@/lib/api/premiumVendors"
import { getItemCount } from "@/lib/api/items"
import { formatUSD } from "@/lib/format"
import PremiumBadge from "@/components/ui/PremiumBadge"

import OrdersAreaChart from "@/components/dashboard/charts/OrdersAreaChart"
import OrdersStatusDonutChart from "@/components/dashboard/charts/OrdersStatusDonutChart"
import TopItemsBarChart from "@/components/dashboard/charts/TopItemsBarChart"

const FREE_LIMIT = 3

export const metadata = {
  title: "Vendor Overview - PizzaHub",
  description: "Sales performance, store analytics, and orders overview.",
}

export default async function VendorDashboardPage() {
  const session = await requireRole("vendor")
  const vendorId = session.user.id

  const [stats, itemCount, premiumData] = await Promise.all([
    getStats("vendor"),
    getItemCount().catch(() => 0),
    getPremiumVendorById(vendorId).catch(() => ({
      isVendor: false,
      premium: false,
    })),
  ])

  const isPremium = Boolean(premiumData.isVendor && premiumData.premium)
  const cards = stats?.cards || {}
  const charts = stats?.charts || {}

  const daily = charts.daily || []
  const ordersByStatus = charts.ordersByStatus || {}
  const topItems = charts.topItems || []

  const totalRevenue = cards.revenue ?? cards.totalRevenue ?? 0
  const totalOrders = cards.orders ?? cards.totalOrders ?? 0
  const deliveredOrders =
    cards.deliveredOrders ??
    ordersByStatus.delivered ??
    0

  const itemsRemaining = Math.max(0, FREE_LIMIT - itemCount)

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header with Subscription Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Vendor Dashboard
          </h1>
          <p className="mt-1 font-text text-sm text-ink-muted">
            Overview of your pizza kitchen performance, customer orders, and revenue.
          </p>
        </div>

        {/* Subscription Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isPremium ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 font-heading text-xs font-semibold text-amber-800 shadow-2xs dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <PremiumBadge />
              <span>Unlimited Items</span>
            </span>
          ) : (
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 font-heading text-xs font-semibold text-ink shadow-2xs transition-transform hover:-translate-y-0.5 hover:border-brand"
            >
              <Sparkles className="h-4 w-4 text-brand-fg" />
              <span>Free Plan ({itemCount}/{FREE_LIMIT}) • Upgrade</span>
              <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
            </Link>
          )}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
            <TrendingUp className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {formatUSD(totalRevenue)}
            </p>
            <p className="font-text text-xs text-ink-muted">Total Sales</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {totalOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Customer Orders</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {deliveredOrders}
            </p>
            <p className="font-text text-xs text-ink-muted">Delivered</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs transition-all hover:shadow-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Package className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="font-heading text-2xl font-extrabold text-ink truncate">
              {itemCount}
              {!isPremium && (
                <span className="font-text text-xs font-normal text-ink-muted ml-1">
                  /{FREE_LIMIT}
                </span>
              )}
            </p>
            <p className="font-text text-xs text-ink-muted">
              {isPremium ? "Unlimited Menu Items" : `${itemsRemaining} remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[340px]">
        {/* Daily orders trend */}
        <OrdersAreaChart
          data={daily}
          title="Daily Orders Trend"
          description="Your kitchen's daily order count over the last 7 days"
        />

        {/* Orders by Status */}
        <OrdersStatusDonutChart
          data={ordersByStatus}
          title="Orders by Fulfillment Status"
        />
      </div>

      {/* Top Selling Items Bar Chart */}
      <div className="w-full">
        <TopItemsBarChart
          data={topItems}
          title="Top Selling Pizzas"
          description="Your most popular items ordered by customers"
        />
      </div>
    </div>
  )
}
