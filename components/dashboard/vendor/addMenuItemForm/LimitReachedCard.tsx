// Shown instead of the Add Menu Item form when a free vendor used all free slots
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Infinity as InfinityIcon,
  Star,
} from "lucide-react"

interface LimitReachedCardProps {
  limit: number
  used: number
}

// Short list of what the vendor gets after upgrading
const PERKS = [
  { icon: InfinityIcon, text: "Unlimited menu items" },
  { icon: Star, text: "Featured on the homepage" },
  { icon: BadgeCheck, text: "Premium vendor badge" },
]

const LimitReachedCard = ({ limit, used }: LimitReachedCardProps) => {
  // Progress bar width (max 100%)
  const percent = Math.min((used / limit) * 100, 100)

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface shadow-xl shadow-brand/5">
      {/* Soft glow at the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-amber-400/15 to-transparent" />

      <div className="relative px-6 py-10 text-center sm:px-10">
        {/* Icon */}
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
          <Crown className="h-8 w-8" />
        </span>

        <h2 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-ink">
          You have reached your free limit
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          Your Free plan allows up to {limit} menu items. Upgrade to Premium to
          keep growing your restaurant menu.
        </p>

        {/* Usage bar */}
        <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-brand-soft/40 p-4 text-left">
          <div className="flex items-center justify-between font-text text-xs">
            <span className="text-ink-muted">Menu items used</span>
            <span className="font-heading font-bold text-ink">
              {used} / {limit}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Perks */}
        <ul className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, text }) => (
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
            href="/dashboard/vendor/menu-items"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 font-heading text-sm font-semibold text-ink transition-colors hover:bg-brand-soft/40"
          >
            View my menu items
          </Link>
          <Link
            href="/dashboard/vendor/subscription?reason=limit"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-heading text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Premium
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LimitReachedCard