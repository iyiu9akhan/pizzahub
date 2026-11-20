// Global navigation header component.
// Features:
// - Sticky top-0 z-50 with backdrop-blur, semi-opaque surface background, and bottom border on scroll (>10px).
// - Responsive desktop navigation and role-aware profile/cart/orders actions.
// - Mobile navigation powered by ShadCN Sheet with dynamic nav links and full profile controls.
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, LayoutDashboard, Settings, LogOut } from "lucide-react"

import BrandLogo from "@/components/header/navbar/brandLogo/BrandLogo"
import Navitems from "@/components/header/navbar/navitems/Navitems"
import NavBtn from "@/components/header/navbar/navBtn/NavBtn"
import AuthBtns from "@/components/header/navbar/navBtn/AuthBtns"
import UserAvatar from "@/components/ui/UserAvatar"
import LoadingButton from "@/components/ui/LoadingButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useSession, authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import { cn } from "@/lib/utils"

export interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)

  const { data: session } = useSession()
  const router = useRouter()

  const role = (session?.user as { role?: string } | undefined)?.role || "customer"
  const dashboardHref = `/dashboard/${role}`
  const profileSettingsHref = `/dashboard/${role}/profile`

  // Track scroll position to toggle sticky header background blur and border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Execute logout with spinner and toast notification
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      toastSuccess("Logged out. See you next time!")
      setIsOpen(false)
      router.push("/login")
      router.refresh()
    } catch {
      toastError("Logout failed. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full h-20 transition-all duration-300",
        isScrolled
          ? "bg-surface/85 backdrop-blur-md border-b border-line shadow-xs"
          : "bg-transparent border-b border-transparent",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        {/* Desktop & Mobile Left: Brand Logo */}
        <div className="flex items-center">
          <BrandLogo onClick={() => setIsOpen(false)} />
        </div>

        {/* Desktop Center/Right: Nav links and action buttons */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          <nav aria-label="Main Navigation" className="flex items-center">
            <Navitems />
          </nav>
          <NavBtn />
        </div>

        {/* Mobile Right: Actions (Theme toggle, cart/orders) and Sheet hamburger trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <NavBtn mobileActionsOnly />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[85vw] max-w-sm p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-6">
            <SheetHeader className="p-0 border-b border-line pb-4 text-left">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="flex items-center justify-between">
                <BrandLogo onClick={() => setIsOpen(false)} />
              </div>
            </SheetHeader>

            {/* Main navigation links */}
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
              <Navitems isMobile onLinkClick={() => setIsOpen(false)} />
            </nav>
          </div>

          {/* Bottom user / auth area inside mobile sheet */}
          <div className="pt-6 border-t border-line mt-6 flex flex-col gap-4">
            {session ? (
              <div className="flex flex-col gap-3">
                {/* User summary card */}
                <div className="flex items-center gap-3 rounded-xl bg-brand-soft/50 p-3">
                  <UserAvatar
                    src={session.user.image}
                    name={session.user.name || "User"}
                    size="md"
                  />
                  <div className="min-w-0 flex-1 leading-tight">
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

                {/* Dashboard & Profile Links */}
                <div className="flex flex-col gap-1">
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href={profileSettingsHref}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg"
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </Link>
                </div>

                {/* Mobile Logout Button */}
                <LoadingButton
                  type="button"
                  isLoading={isLoggingOut}
                  loadingText="Logging out…"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-danger-foreground cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </LoadingButton>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AuthBtns fullWidth onLinkClick={() => setIsOpen(false)} />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Navbar
