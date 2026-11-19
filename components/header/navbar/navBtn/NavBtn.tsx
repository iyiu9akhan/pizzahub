"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserRound } from "lucide-react"

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

  const handleLogout = async () => {
    await authClient.signOut()
    onLinkClick?.()
    router.push("/")
    router.refresh()
  }

  const authActions = isPending ? (
    <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
  ) : session ? (
    <div className={`flex items-center gap-3 ${fullWidth ? "w-full" : ""}`}>
      <Link
        href={`/dashboard/${session.user.role}`}
        onClick={onLinkClick}
        aria-label="Dashboard"
        title="Dashboard"
        className="flex size-9 items-center justify-center rounded-full border border-line transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <UserRound size={20} />
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className={`rounded-md border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground ${
          fullWidth ? "w-full" : ""
        }`}
      >
        Logout
      </button>
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
