// NavBtn component — right-side navigation actions in the navbar.
// Displays role-aware icons: cart for customer, orders badge for vendor, neither for admin/guest.
// Also includes the user profile menu with dashboard links and interactive logout.
"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Settings, LogOut, ClipboardList } from "lucide-react"

import ThemeToggle from "@/components/header/navbar/navBtn/ThemeToggle"
import CartBtn from "@/components/header/navbar/navBtn/CartBtn"
import AuthBtns from "@/components/header/navbar/navBtn/AuthBtns"
import LoadingButton from "@/components/ui/LoadingButton"
import UserAvatar from "@/components/ui/UserAvatar"

import { useSession, authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"

export interface NavBtnProps {
  className?: string
  fullWidth?: boolean
  cartOnly?: boolean
  authOnly?: boolean
  mobileActionsOnly?: boolean
  orderCount?: number
  onLinkClick?: () => void
}

const NavBtn: React.FC<NavBtnProps> = ({
  className = "",
  fullWidth = false,
  cartOnly = false,
  authOnly = false,
  mobileActionsOnly = false,
  orderCount,
  onLinkClick,
}) => {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const role = session?.user?.role || "customer"

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  // Execute logout with spinner and toast notification
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      toastSuccess("Logged out. See you next time!")
      setMenuOpen(false)
      onLinkClick?.()
      router.push("/login")
      router.refresh()
    } catch {
      toastError("Logout failed. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const dashboardHref = `/dashboard/${role}`
  const profileSettingsHref = `/dashboard/${role}/profile`

  // Avatar size helper — maps button context to UserAvatar size prop
  const renderAvatar = (size: "sm" | "md" | "lg" = "md") => (
    <UserAvatar
      image={session?.user?.image}
      role={role}
      name={session?.user?.name || role}
      size={size}
    />
  )

  // Order icon for Customer and Vendor (Admin & Guest do not see it)
  const isOrderRole = (role === "customer" || role === "vendor") && !!session
  const orderHref =
    role === "customer"
      ? "/dashboard/customer/my-orders"
      : "/dashboard/vendor/orders"
  const orderAriaLabel =
    role === "customer" ? "Customer orders" : "Vendor orders"
  const orderTitle = role === "customer" ? "My Orders" : "Customer Orders"
  const count = orderCount ?? 0

  const orderIcon = isOrderRole && (
    <Link
      href={orderHref}
      aria-label={orderAriaLabel}
      title={orderTitle}
      onClick={onLinkClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-2xs transition-all hover:border-brand-muted hover:bg-brand-soft hover:text-brand-fg cursor-pointer"
    >
      <ClipboardList className="h-4 w-4" />
      {/* Badge: visible only when order count is greater than 0 */}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-heading font-bold text-white shadow-xs">
          {count}
        </span>
      )}
    </Link>
  )

  // Profile dropdown menu or authentication buttons
  const authActions = isPending ? (
    <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
  ) : session ? (
    <div
      ref={dropdownRef}
      className={`relative ${fullWidth ? "w-full" : ""}`}
    >
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Profile menu"
        title="Profile"
        className={`flex items-center transition ${
          fullWidth
            ? "w-full justify-between rounded-xl border border-line bg-surface px-3 py-2 text-ink hover:border-primary"
            : "size-10 justify-center rounded-full border-2 border-line bg-surface p-0.5 hover:border-primary"
        }`}
      >
        {fullWidth ? (
          <>
            <span className="flex items-center gap-2.5 truncate">
              {renderAvatar("sm")}
              <span className="truncate text-sm font-medium">
                {session.user.name || "User"}
              </span>
            </span>
            <span className="text-xs text-ink-muted">Menu</span>
          </>
        ) : (
          renderAvatar("md")
        )}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className={`z-50 mt-2 rounded-xl border border-line bg-surface p-2 shadow-lg ${
            fullWidth ? "w-full" : "absolute right-0 w-64"
          }`}
        >
          {/* User info banner inside dropdown */}
          <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
            {renderAvatar("lg")}
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold text-ink">
                {session.user.name || "PizzaHub User"}
              </p>
              {session.user.email && (
                <p className="truncate text-xs text-ink-muted">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-1.5 flex flex-col gap-1">
            <Link
              href={dashboardHref}
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                onLinkClick?.()
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg"
            >
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </Link>

            <Link
              href={profileSettingsHref}
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                onLinkClick?.()
              }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg"
            >
              <Settings size={17} />
              <span>Profile Settings</span>
            </Link>

            <div className="my-1 border-t border-line" />

            {/* Logout button using LoadingButton */}
            <LoadingButton
              type="button"
              role="menuitem"
              isLoading={isLoggingOut}
              loadingText="Logging out…"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-danger-foreground cursor-pointer"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  ) : (
    <AuthBtns
      className={className}
      fullWidth={fullWidth}
      onLinkClick={onLinkClick}
    />
  )

  if (cartOnly) {
    return <CartBtn count={count} className={className} />
  }

  if (mobileActionsOnly) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ThemeToggle />
        {/* Customer and Vendor: clipboard orders icon. Admin/guest: neither. */}
        {orderIcon}
      </div>
    )
  }

  if (authOnly) {
    return authActions
  }

  return (
    <div
      className={`flex items-center gap-3 ${
        fullWidth ? "w-full flex-col" : ""
      } ${className}`}
    >
      <ThemeToggle />
      {/* Customer and Vendor: clipboard orders icon. Admin/guest: neither. */}
      {orderIcon}
      {session && (
        <span className="mx-0.5 hidden h-5 w-px bg-line sm:block" />
      )}
      {authActions}
    </div>
  )
}

export default NavBtn

export { CartBtn, AuthBtns, ThemeToggle }
