// Vendor dashboard overview page: /dashboard/vendor
// Displays vendor summary stats and subscription status (Free vs Premium).
export const dynamic = "force-dynamic"

import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import {
  Package,
  ClipboardList,
  Crown,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { getPremiumVendorById } from "@/lib/api/users"
import { getItemCount } from "@/lib/api/items"
import { getOrders } from "@/lib/api/orders"

const FREE_LIMIT = 3

// Stat card helper
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number | string
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

const VendorDashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user
  const vendorId = user?.id

  // Defaults
  let itemCount = 0
  let isPremium = false
  let totalOrders = 0
  let pendingOrders = 0
  let deliveredOrders = 0

  if (vendorId) {
    const [count, premiumData, ordersData] = await Promise.all([
      getItemCount({ vendorId }).catch(() => 0),
      getPremiumVendorById(vendorId).catch(() => ({ isVendor: false, premium: false })),
      getOrders({ vendorId }).catch(() => []),
    ])

    itemCount = count
    isPremium = Boolean(premiumData.isVendor && premiumData.premium)

    if (Array.isArray(ordersData)) {
      totalOrders = ordersData.length
      pendingOrders = ordersData.filter((o) => o.status === "pending").length
      deliveredOrders = ordersData.filter(
        (o) => o.fulfillmentStatus === "delivered"
      ).length
    }
  }

  const usagePercent = Math.min((itemCount / FREE_LIMIT) * 100, 100)

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Welcome back, {user?.name || "Vendor"}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Manage your restaurant items, track customer orders, and view your plan.
          </p>
        </div>

        {/* Current plan badge */}
        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-100 px-3.5 py-1.5 font-heading text-xs font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 sm:self-auto">
            <Crown className="h-4 w-4" />
            Premium Vendor
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-line bg-surface px-3.5 py-1.5 font-text text-xs text-ink-muted sm:self-auto">
            Current plan: <strong className="font-heading text-ink">Free Plan</strong>
          </span>
        )}
      </div>

      {/* Plan status card */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isPremium
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                  : "bg-brand-soft text-brand-fg"
              }`}
            >
              <Crown className="h-6 w-6" />
            </span>
            <div>
              <p className="font-heading text-base font-bold text-ink">
                {isPremium ? "Premium Subscription Active" : "Free Subscription"}
              </p>
              <p className="font-text text-sm text-ink-muted">
                {isPremium
                  ? "You have unlocked unlimited menu items and homepage placement."
                  : `${itemCount}/${FREE_LIMIT} menu items used. Upgrade to post unlimited items.`}
              </p>
            </div>
          </div>

          {/* Upgrade button only shown for free vendors */}
          {!isPremium && (
            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-heading text-xs font-bold text-white shadow-md shadow-brand/25 transition-all hover:-translate-y-0.5 hover:opacity-95"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Premium
            </Link>
          )}
        </div>

        {/* Free plan usage bar */}
        {!isPremium && (
          <div className="mt-5 pt-5 border-t border-line">
            <div className="flex items-center justify-between text-xs font-text">
              <span className="text-ink-muted">Free item limit</span>
              <span className="font-heading font-bold text-ink">
                {itemCount} / {FREE_LIMIT} used
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all ${
                  itemCount >= FREE_LIMIT ? "bg-amber-500" : "bg-brand"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Menu Items"
          value={isPremium ? `${itemCount} (Unlimited)` : `${itemCount} / ${FREE_LIMIT}`}
          icon={<Package className="h-6 w-6" />}
          color="bg-brand-soft text-brand-fg"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={<ClipboardList className="h-6 w-6" />}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="h-6 w-6" />}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <StatCard
          label="Delivered Orders"
          value={deliveredOrders}
          icon={<CheckCircle2 className="h-6 w-6" />}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
      </div>

      {/* Quick navigation links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/dashboard/vendor/menu-items"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 font-heading text-xs font-semibold text-ink transition-all hover:border-brand hover:text-brand-fg"
        >
          Manage Menu Items
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/dashboard/vendor/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 font-heading text-xs font-semibold text-ink transition-all hover:border-brand hover:text-brand-fg"
        >
          Review Customer Orders
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 font-heading text-xs font-semibold text-ink transition-all hover:border-brand hover:text-brand-fg"
        >
          View Subscription Details
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default VendorDashboardPage
