// Navigation menu links component.
// Dynamically renders links based on auth state:
// - Logged in: Home, Browse Menu, Dashboard (role-specific URL).
// - Logged out: Home, Browse Menu.
// Active indicator highlights based on usePathname ("Browse Menu" active on /menu and /menu/[id]).
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export interface NavItem {
  label: string
  href: string
}

export interface NavitemsProps {
  className?: string
  onLinkClick?: () => void
  isMobile?: boolean
}

const Navitems: React.FC<NavitemsProps> = ({
  className = "",
  onLinkClick,
  isMobile = false,
}) => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const role = (session?.user as { role?: string } | undefined)?.role || "customer"

  // Dynamic navigation links based on user authentication status
  const navLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    ...(session
      ? [{ label: "Dashboard", href: `/dashboard/${role}` }]
      : []),
  ]

  // Helper to determine whether a link is currently active
  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/menu") return pathname === "/menu" || pathname.startsWith("/menu/")
    if (href.startsWith("/dashboard")) return pathname.startsWith("/dashboard")
    return pathname === href
  }

  return (
    <ul
      className={`${
        isMobile
          ? "flex flex-col space-y-1.5 w-full"
          : "flex items-center gap-8"
      } ${className}`}
    >
      {navLinks.map((item) => {
        const isActive = checkIsActive(item.href)

        return (
          <li key={item.label} className={isMobile ? "w-full" : "relative"}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className={`font-heading transition-colors duration-200 block cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm ${
                isMobile
                  ? `w-full px-4 py-2.5 rounded-xl text-base font-semibold ${
                      isActive
                        ? "bg-brand-soft text-brand-fg"
                        : "text-ink hover:bg-brand-soft/50 hover:text-brand-fg"
                    }`
                  : `relative text-sm font-semibold tracking-wide py-2 ${
                      isActive
                        ? "text-brand-fg"
                        : "text-ink hover:text-brand-fg"
                    }`
              }`}
            >
              <span>{item.label}</span>
              {/* Active dot indicator on desktop */}
              {!isMobile && isActive && (
                <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand transition-all duration-300" />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default Navitems
