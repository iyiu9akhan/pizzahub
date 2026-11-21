// Success UI (client component). Data is verified on the server in page.tsx.
"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Crown,
  PackagePlus,
  Star,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import UserAvatar from "@/components/ui/UserAvatar"

// What the vendor unlocked
const UNLOCKED = [
  { icon: PackagePlus, text: "Unlimited menu items" },
  { icon: Star, text: "Featured on the homepage" },
  { icon: BadgeCheck, text: "Premium vendor badge" },
]

interface SuccessContentProps {
  sessionId: string
  amount: number // in dollars, from Stripe
  currency: string
}

const SuccessContent = ({ sessionId, amount, currency }: SuccessContentProps) => {
  const { data: session } = useSession()

  const user = session?.user as
    | {
        name?: string
        email?: string
        image?: string | null
        businessName?: string
      }
    | undefined

  return (
    <div className="mx-auto flex min-h-[70vh] w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl rounded-3xl border border-line bg-surface px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-6 w-6 stroke-3" />
          </span>
        </div>

        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Payment successful
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
          Thank you for upgrading. Your payment was received and your Premium
          plan is now active.
        </p>

        {/* Vendor profile with verified badge */}
        <div className="mx-auto mt-8 flex max-w-sm items-center gap-4 rounded-2xl border border-line bg-brand-soft/30 p-4 text-left">
          <div className="relative shrink-0">
            <UserAvatar src={user?.image} name={user?.name} size="lg" />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 ring-2 ring-surface">
              <Crown className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-heading text-base font-bold text-ink">
              <span className="truncate">
                {user?.businessName || user?.name || "Vendor"}
              </span>
              <BadgeCheck className="h-5 w-5 shrink-0 fill-brand text-white" />
            </p>
            <p className="truncate font-text text-xs text-ink-muted">
              {user?.email}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-heading text-[11px] font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              <Crown className="h-3 w-3" />
              Premium Vendor
            </span>
          </div>
        </div>

        {/* Plan summary (amount comes from Stripe) */}
        <div className="mx-auto mt-4 max-w-sm overflow-hidden rounded-2xl border border-line bg-surface text-left">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                <Crown className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-bold text-ink">
                  PizzaHub Premium
                </p>
                <p className="font-text text-xs text-ink-muted">
                  One-time payment
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-heading text-xl font-extrabold leading-none text-ink">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: currency.toUpperCase(),
                  maximumFractionDigits: 0,
                }).format(amount)}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-heading text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                <Check className="h-2.5 w-2.5 stroke-3" />
                Paid
              </span>
            </div>
          </div>

          {/* Reference id */}
          <div className="flex items-center justify-between gap-3 border-t border-line bg-brand-soft/30 px-4 py-2.5 font-text text-xs">
            <span className="text-ink-muted">Reference</span>
            <span className="truncate font-mono text-ink">
              {sessionId.slice(-12)}
            </span>
          </div>
        </div>

        {/* Unlocked perks */}
        <ul className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {UNLOCKED.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 font-text text-xs font-medium text-ink"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 font-heading text-sm font-semibold text-ink transition-colors hover:bg-brand-soft/40"
          >
            Go to dashboard
          </Link>
          <Link
            href="/dashboard/vendor/add-menu-item"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-heading text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <PackagePlus className="h-4 w-4" />
            Add menu item
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessContent