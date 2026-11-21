// Dashboard sidebar navigation component for customer, vendor, and admin roles.
// Renders role-specific navigation links, branding, and current user profile details.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useSession } from "@/lib/auth-client"
import UserAvatar from "@/components/ui/UserAvatar"

import {
  House,
  LayoutDashboard,
  ShoppingBag,
  User,
  Store,
  Package,
  Plus,
  ClipboardList,
  Users,
  Settings,
  CreditCard,
  Crown,
  Pizza,
} from "lucide-react"

// Navigation items configuration split by role
const menuItemsByRole = {
  customer: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "overview", name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
    { id: "my-orders", name: "My Orders", url: "/dashboard/customer/my-orders", icon: ShoppingBag },
    { id: "profile", name: "Profile Settings", url: "/dashboard/customer/profile", icon: User },
  ],

  vendor: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "overview", name: "Overview", url: "/dashboard/vendor", icon: LayoutDashboard },
    { id: "menu-items", name: "My Menu Items", url: "/dashboard/vendor/menu-items", icon: Package },
    { id: "add-menu-item", name: "Add Menu Item", url: "/dashboard/vendor/add-menu-item", icon: Plus },
    { id: "orders", name: "Customer Orders", url: "/dashboard/vendor/orders", icon: ClipboardList },
    { id: "subscription", name: "Subscription", url: "/dashboard/vendor/subscription", icon: Crown },
    { id: "profile", name: "Profile Settings", url: "/dashboard/vendor/profile", icon: Settings },
  ],

  admin: [
    { id: "home", name: "Home", url: "/", icon: House },
    { id: "overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { id: "users", name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    { id: "items", name: "Manage Items", url: "/dashboard/admin/items", icon: Package },
    { id: "orders", name: "Manage Orders", url: "/dashboard/admin/orders", icon: ClipboardList },
    { id: "transactions", name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
    { id: "profile", name: "Profile Settings", url: "/dashboard/admin/profile", icon: User },
  ],
}

type Role = keyof typeof menuItemsByRole

// Human-readable labels for each role
const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  vendor: "Vendor",
  admin: "Administrator",
}

// Sidebar layout for all dashboard pages
export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  // Determine user role and fallback to customer
  const role = ((session?.user as { role?: string } | undefined)?.role ??
    "customer") as Role
  const safeRole: Role = role in menuItemsByRole ? role : "customer"
  const menuItems = menuItemsByRole[safeRole]

  // Check if current route matches menu item URL
  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    if (url === `/dashboard/${safeRole}`) return pathname === url
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  if (isPending) return null

  // User display info
  const userName = session?.user?.name ?? "Guest"
  const userEmail = session?.user?.email ?? ""
  const userImage = session?.user?.image

  return (
    <Sidebar>
      {/* Header with PizzaHub logo and role label */}
      <SidebarHeader className="border-b border-line px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/25">
            <Pizza className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-extrabold tracking-tight text-ink">
              Pizza<span className="text-brand-fg">Hub</span>
            </span>
            <span className="font-text text-[11px] font-medium text-ink-muted">
              {ROLE_LABEL[safeRole]} panel
            </span>
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation menu items */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-1 px-3 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Navigation
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1">
            {menuItems.map((item) => {
              const active = isActive(item.url)
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={active}
                    render={<Link href={item.url} />}
                    className={`h-11 gap-3 rounded-xl px-3 font-heading text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-brand! text-white! shadow-md shadow-brand/25 hover:bg-brand!"
                        : "text-ink-muted hover:bg-brand-soft! hover:text-brand-fg!"
                    }`}
                  >
                    <item.icon
                      className={`h-4.5 w-4.5 shrink-0 ${
                        active ? "text-white" : ""
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-white"
                      />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User profile info with avatar fallback */}
      <SidebarFooter className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl bg-brand-soft/60 p-3">
          <UserAvatar
            src={userImage}
            name={userName}
            size="md"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-heading text-sm font-bold text-ink">
              {userName}
            </p>
            <p className="truncate font-text text-[11px] text-ink-muted">
              {userEmail || ROLE_LABEL[safeRole]}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
