// Dashboard topbar header component.
// Houses the sidebar toggle button and breadcrumb path title.
"use client"

import { usePathname } from "next/navigation"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

// Route segment to page title mapping
const TITLES: Record<string, string> = {
  vendor: "Overview",
  customer: "Dashboard",
  admin: "Dashboard",
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

// Topbar displayed at the top of all dashboard views
export function DashboardTopbar() {
  const { toggleSidebar, open } = useSidebar()
  const pathname = usePathname()

  // Determine current page title from the last path segment
  const last = pathname.split("/").filter(Boolean).pop() ?? ""
  const title = TITLES[last] ?? "Dashboard"

  return (
    <header className="sticky top-0 z-20 flex h-19 shrink-0 items-center gap-3 border-b border-line bg-page/80 px-4 backdrop-blur-md sm:px-6">
      {/* Sidebar toggle button */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        title={open ? "Collapse sidebar" : "Expand sidebar"}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink-muted shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95"
      >
        {open ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </button>

      <span aria-hidden="true" className="h-6 w-px bg-line" />

      {/* Breadcrumb section */}
      <div className="flex min-w-0 items-center gap-2 font-text text-sm">
        <span className="text-ink-muted">Dashboard</span>
        <span className="text-ink-muted/50">/</span>
        <span className="truncate font-heading font-semibold text-ink">
          {title}
        </span>
      </div>
    </header>
  )
}
