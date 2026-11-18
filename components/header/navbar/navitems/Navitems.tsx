"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface NavItem {
  label: string
  href: string
}

export interface NavitemsProps {
  className?: string
  onLinkClick?: () => void
  isMobile?: boolean
}

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "#menu" },
  { label: "Deals", href: "#deals" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

const Navitems: React.FC<NavitemsProps> = ({
  className = "",
  onLinkClick,
  isMobile = false,
}) => {
  const pathname = usePathname()

  return (
    <ul
      className={`${
        isMobile
          ? "flex flex-col space-y-1.5 w-full"
          : "flex items-center gap-8"
      } ${className}`}
    >
      {NAV_LINKS.map((item) => {
        const isActive =
          pathname === item.href || (item.href === "/" && pathname === "/")

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
