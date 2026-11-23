// Dashboard topbar header component.
// Houses the sidebar toggle, breadcrumb title, and right-side actions
// (last-updated indicator, hard-reload refresh button).
"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen, RefreshCw } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

// Route segment to page title mapping
const TITLES: Record<string, string> = {
  vendor: "Overview",
  customer: "Dashboard",
  admin: "Dashboard",
  items: "Manage Items",
  "menu-items": "My Menu Items",
  "add-menu-item": "Add Menu Item",
  orders: "Orders",
  subscription: "Subscription",
  profile: "Profile",
  wishlist: "Wishlist",
  users: "Manage Users",
  vendors: "Manage Vendors",
  products: "Manage Products",
  settings: "Settings",
}

// Turns a timestamp into a short "x ago" label
function timeAgo(from: number, now: number) {
  const seconds = Math.max(0, Math.floor((now - from) / 1000))
  if (seconds < 10) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

// Topbar displayed at the top of all dashboard views
export function DashboardTopbar() {
  const { toggleSidebar, open } = useSidebar()
  const pathname = usePathname()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Timestamps are set after mount to avoid hydration mismatch
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [now, setNow] = useState<number>(0)

  useEffect(() => {
    // Set on every page load, so it resets after a hard reload
    const t = Date.now()
    setLastUpdated(t)
    setNow(t)
    // Tick every 15s so the "x ago" label stays fresh
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  // Determine current page title from the last path segment
  const last = pathname.split("/").filter(Boolean).pop() ?? ""
  const title = TITLES[last] ?? "Dashboard"

  // Hard reload: same as the browser reload button
  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-20 flex h-19 shrink-0 items-center gap-3 border-b border-line bg-page/80 px-4 backdrop-blur-md sm:px-6">
      {/* sidebar toggle */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand-fg focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-hidden active:scale-95"
      >
        {open ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </button>

      <span aria-hidden="true" className="h-6 w-px bg-line" />

      {/* breadcrumb section */}
      <div className="flex min-w-0 items-center gap-2 font-text text-sm">
        <span className="text-ink-muted">Dashboard</span>
        <span className="text-ink-muted/50">/</span>
        <span className="truncate font-heading font-semibold text-ink">
          {title}
        </span>
      </div>

      {/* right side actions */}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {/* last updated label: hidden on small screens */}
        <div
          className="hidden items-center gap-2 font-text text-xs text-ink-muted md:flex"
          aria-live="polite"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-brand ${
                isRefreshing ? "animate-ping opacity-75" : "opacity-0"
              }`}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <span>
            {isRefreshing
              ? "Refreshing..."
              : lastUpdated
                ? `Updated ${timeAgo(lastUpdated, now)}`
                : "Live data"}
          </span>
        </div>

        <span aria-hidden="true" className="hidden h-6 w-px bg-line md:block" />

        {/* refresh button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh dashboard data"
          title="Refresh dashboard data"
          className="group flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-brand px-3.5 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-all duration-200 hover:shadow-md hover:shadow-brand/30 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-hidden active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <RefreshCw
            className={`h-4 w-4 transition-transform duration-500 ${
              isRefreshing ? "animate-spin" : "group-hover:rotate-180"
            }`}
          />
          <span className="hidden sm:inline">
            {isRefreshing ? "Refreshing" : "Refresh"}
          </span>
        </button>
      </div>
    </header>
  )
}
