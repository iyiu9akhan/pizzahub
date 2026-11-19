"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Settings, LogOut } from "lucide-react"

import ThemeToggle from "@/components/header/navbar/navBtn/ThemeToggle"
import CartBtn from "@/components/header/navbar/navBtn/CartBtn"
import AuthBtns from "@/components/header/navbar/navBtn/AuthBtns"

import { useSession, authClient } from "@/lib/auth-client"

export interface NavBtnProps {
  className?: string
  fullWidth?: boolean
  cartOnly?: boolean
  authOnly?: boolean
  mobileActionsOnly?: boolean
  cartCount?: number
  onLinkClick?: () => void
}

const ROLE_AVATARS: Record<string, string> = {
  admin: "/images/profilePic/admin-demo.png",
  vendor: "/images/profilePic/vendor-demo.png",
  customer: "/images/profilePic/profile-demo.png",
}

const NavBtn: React.FC<NavBtnProps> = ({
  className = "",
  fullWidth = false,
  cartOnly = false,
  authOnly = false,
  mobileActionsOnly = false,
  cartCount = 2,
  onLinkClick,
}) => {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handleLogout = async () => {
    try {
      setMenuOpen(false)
      await authClient.signOut()
      onLinkClick?.()
      router.push("/login")
      router.refresh()
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const role = session?.user?.role || "customer"
  const dashboardHref = `/dashboard/${role}`
  const profileSettingsHref = `/dashboard/${role}/profile`
  const avatarSrc = ROLE_AVATARS[role] || ROLE_AVATARS.customer

  const renderAvatar = (sizeClass = "size-9", ringClass = "border-2 border-line") => (
    <img
      src={avatarSrc}
      alt={session?.user?.name || `${role} profile`}
      className={`${sizeClass} shrink-0 rounded-full object-cover bg-surface ${ringClass}`}
    />
  )

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
              {renderAvatar("size-7", "border border-line")}
              <span className="truncate text-sm font-medium">
                {session.user.name || "User"}
              </span>
            </span>
            <span className="text-xs text-ink-muted">Menu</span>
          </>
        ) : (
          renderAvatar("size-full", "border border-line/70")
        )}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className={`z-50 mt-2 rounded-xl border border-line bg-surface p-2 shadow-lg ${
            fullWidth ? "w-full" : "absolute right-0 w-64"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
            {renderAvatar("size-10", "border-2 border-line")}
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

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger hover:text-danger-foreground"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
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
    return <CartBtn count={cartCount} className={className} />
  }

  if (mobileActionsOnly) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ThemeToggle />
        <CartBtn count={cartCount} />
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
      <CartBtn count={cartCount} />
      <div className="mx-0.5 hidden h-5 w-px bg-line sm:block" />
      {authActions}
    </div>
  )
}

export default NavBtn

export { CartBtn, AuthBtns, ThemeToggle }