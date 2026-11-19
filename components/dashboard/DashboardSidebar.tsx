"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useSession } from "@/lib/auth-client"

import {
  House,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  Store,
  Package,
  Plus,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react"

const menuItemsByRole = {
  customer: [
    {
      id: "home",
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      id: "orders",
      name: "My Orders",
      url: "/dashboard/customer/orders",
      icon: ShoppingBag,
    },
    {
      id: "wishlist",
      name: "Wishlist",
      url: "/dashboard/customer/wishlist",
      icon: Heart,
    },
    {
      id: "profile",
      name: "Profile",
      url: "/dashboard/customer/profile",
      icon: User,
    },
  ],

  vendor: [
    {
      id: "home",
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      name: "My Products",
      url: "/dashboard/vendor/products",
      icon: Package,
    },
    {
      id: "add-product",
      name: "Add Product",
      url: "/dashboard/vendor/products/add",
      icon: Plus,
    },
    {
      id: "orders",
      name: "Orders",
      url: "/dashboard/vendor/orders",
      icon: ClipboardList,
    },
    {
      id: "store",
      name: "My Store",
      url: "/dashboard/vendor/store",
      icon: Store,
    },
  ],

  admin: [
    {
      id: "home",
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "vendors",
      name: "Manage Vendors",
      url: "/dashboard/admin/vendors",
      icon: Store,
    },
    {
      id: "products",
      name: "Manage Products",
      url: "/dashboard/admin/products",
      icon: Package,
    },
    {
      id: "orders",
      name: "Manage Orders",
      url: "/dashboard/admin/orders",
      icon: ClipboardList,
    },
    {
      id: "settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()

  const role = session?.user?.role || "customer"

  const menuItems = menuItemsByRole[role] ?? menuItemsByRole.customer

  if (isPending) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
