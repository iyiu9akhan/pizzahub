// Vendor subscription page: /dashboard/vendor/subscription
// Shows Free vs Premium plans with live status and Stripe upgrade flow.
export const dynamic = "force-dynamic"

import { headers } from "next/headers"
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Crown,
  LayoutDashboard,
  Minus,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { getPremiumVendorById } from "@/lib/api/premiumVendors"
import { getItemCount } from "@/lib/api/items"
import PremiumBadge from "@/components/ui/PremiumBadge"
import UpgradeButton from "./UpgradeButton"

const FREE_LIMIT = 3
const PREMIUM_PRICE = 29 // USD, one-time payment

const FREE_FEATURES = [
  "Max 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
]

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement on the homepage",
  "All Free features",
]

// Rows of the comparison table (true/false shows a check or a dash)
const COMPARE_ROWS: {
  label: string
  free: string | boolean
  premium: string | boolean
}[] = [
  { label: "Active menu items", free: "Up to 3", premium: "Unlimited" },
  { label: "Vendor dashboard", free: true, premium: true },
  { label: "Order management", free: true, premium: true },
  { label: "Premium vendor badge", free: false, premium: true },
  { label: "Featured placement on homepage", free: false, premium: true },
]

// Feature list with check icons
const FeatureList = ({
  items,
  premium,
}: {
  items: string[]
  premium?: boolean
}) => (
  <ul className="mt-6 space-y-3.5">
    {items.map((f) => (
      <li key={f} className="flex items-start gap-3 font-text text-sm text-ink">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            premium ? "bg-brand text-white" : "bg-brand-soft text-brand-fg"
          }`}
        >
          <Check className="h-3 w-3 stroke-3" />
        </span>
        {f}
      </li>
    ))}
  </ul>
)

// One cell of the comparison table
const Cell = ({ value }: { value: string | boolean }) =>
  typeof value === "string" ? (
    <span className="font-heading text-sm font-semibold text-ink">{value}</span>
  ) : value ? (
    <Check className="mx-auto h-4 w-4 text-brand" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-ink-muted/50" />
  )

const VendorSubscriptionPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; canceled?: string }>
}) => {
  const { reason, canceled } = await searchParams
  const fromLimit = reason === "limit"

  // Fetch live session and plan data
  const session = await auth.api.getSession({ headers: await headers() })
  const vendorId = session?.user?.id

  let usedItems = 0
  let isPremium = false
  let expiresAt: string | null = null

  if (vendorId) {
    const [count, premiumData] = await Promise.all([
      getItemCount().catch(() => 0),
      getPremiumVendorById(vendorId).catch(() => ({
        isVendor: false,
        premium: false,
        plan: "free",
        expiresAt: null,
      })),
    ])
    usedItems = count
    isPremium = Boolean(premiumData.isVendor && premiumData.premium)
    expiresAt = isPremium ? (premiumData.expiresAt ?? null) : null
  }

  const usagePercent = Math.min((usedItems / FREE_LIMIT) * 100, 100)

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Subscription
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Choose the plan that fits your restaurant.
          </p>
        </div>
        {isPremium ? (
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-amber-100 px-4 py-2 font-heading text-xs font-bold text-amber-800 sm:self-auto dark:bg-amber-500/20 dark:text-amber-300">
            <PremiumBadge />
            <span>Current plan: Premium</span>
            {expiresAt && (
              <span className="ml-1 font-text font-normal text-amber-700 dark:text-amber-400">
                · expires{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(expiresAt))}
              </span>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 font-text text-xs text-ink-muted sm:self-auto">
            <LayoutDashboard className="h-4 w-4 text-brand-fg" />
            Current plan:
            <strong className="font-heading text-ink">Free</strong>
          </span>
        )}
      </div>

      {/* Banner shown when the vendor reached the free limit (hidden if already premium) */}
      {!isPremium && fromLimit && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" />
          <div>
            <p className="font-heading text-sm font-bold text-ink">
              You have used all {FREE_LIMIT} free menu items
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Upgrade to Premium to add more items to your menu.
            </p>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        {/* Free plan */}
        <section className="flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-2xs sm:p-8">
          <p className="font-heading text-sm font-semibold tracking-wide text-ink-muted uppercase">
            Free
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-5xl font-extrabold text-ink">
              $0
            </span>
            <span className="text-sm text-ink-muted">forever</span>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Everything you need to get started.
          </p>

          {/* Usage bar */}
          <div className="mt-6 rounded-2xl bg-brand-soft/40 p-4">
            <div className="flex items-center justify-between font-text text-xs">
              <span className="text-ink-muted">Menu items used</span>
              <span className="font-heading font-bold text-ink">
                {usedItems} / {FREE_LIMIT}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          <FeatureList items={FREE_FEATURES} />

          <div className="mt-auto pt-8">
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-full border border-line px-5 py-3 font-heading text-sm font-semibold text-ink-muted"
            >
              {!isPremium ? "Current plan" : "Free Plan"}
            </button>
          </div>
        </section>

        {/* Premium plan */}
        <section className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-brand bg-surface p-6 shadow-xl shadow-brand/10 sm:p-8">
          {/* Soft glow at the top */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-brand/10 to-transparent" />

          <div className="relative flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold tracking-wide text-brand-fg uppercase">
              <Crown className="h-4 w-4" />
              Premium
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 font-heading text-[11px] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              Most popular
            </span>
          </div>

          <div className="relative mt-3 flex items-baseline gap-2">
            <span className="font-heading text-5xl font-extrabold text-ink">
              ${PREMIUM_PRICE}
            </span>
            <span className="text-sm text-ink-muted">one-time payment</span>
          </div>
          <p className="relative mt-2 text-sm text-ink-muted">
            Grow faster with unlimited items and homepage visibility.
          </p>

          <div className="relative">
            <FeatureList items={PREMIUM_FEATURES} premium />
          </div>

          <div className="relative mt-auto pt-8">
            {isPremium ? (
              <>
                <div className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-heading text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  <Crown className="h-4 w-4" />
                  Active Plan — Unlimited Access
                </div>
                {expiresAt && (
                  <p className="text-center text-xs text-ink-muted">
                    Expires{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(expiresAt))}
                  </p>
                )}
                <div className="mt-3">
                  <UpgradeButton isPremium />
                </div>
              </>
            ) : (
              <UpgradeButton />
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure one-time payment powered by Stripe.
            </p>
          </div>
        </section>
      </div>

      {/* Premium perks */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: BadgeCheck,
            title: "Premium badge",
            text: "Customers see a trusted Premium label on your items.",
          },
          {
            icon: Star,
            title: "Featured on homepage",
            text: "Your items get top placement in Featured Menu Items.",
          },
          {
            icon: Crown,
            title: "No item limit",
            text: "Publish as many active menu items as you want.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-ink">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-ink-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line bg-brand-soft/40 px-5 py-4">
          <h2 className="font-heading text-base font-bold text-ink">
            Compare plans
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-left">
            <thead>
              <tr className="font-heading text-xs tracking-wide text-ink-muted uppercase">
                <th className="px-5 py-3 font-semibold">Feature</th>
                <th className="px-5 py-3 text-center font-semibold">Free</th>
                <th className="px-5 py-3 text-center font-semibold text-brand-fg">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-3.5 font-text text-sm text-ink">
                    {row.label}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.free} />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <Cell value={row.premium} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default VendorSubscriptionPage
