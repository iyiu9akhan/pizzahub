"use client"

import React, { useState } from "react"
import { Menu, X } from "lucide-react"
import BrandLogo from "@/components/header/navbar/brandLogo/BrandLogo"
import Navitems from "@/components/header/navbar/navitems/Navitems"
import NavBtn from "@/components/header/navbar/navBtn/NavBtn"

export interface NavbarProps {
  className?: string
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header
      className={`relative z-30 w-full h-20 bg-page lg:bg-transparent border-b border-line lg:border-none transition-colors duration-300 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        {/* Mobile LEFT: Hamburger + Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <BrandLogo onClick={closeMenu} />
        </div>

        {/* Desktop LEFT: Logo */}
        <div className="hidden lg:flex items-center">
          <BrandLogo onClick={closeMenu} />
        </div>

        {/* Desktop RIGHT: Nav links + actions */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          <nav aria-label="Main Navigation" className="flex items-center">
            <Navitems />
          </nav>
          <NavBtn />
        </div>

        {/* Mobile RIGHT: ThemeToggle + Cart */}
        <div className="flex items-center gap-2 lg:hidden">
          <NavBtn mobileActionsOnly />
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`absolute left-0 right-0 top-full z-40 bg-surface border-b border-line shadow-xl transition-all duration-300 ease-in-out lg:hidden ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-6 py-5">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-4">
            <Navitems isMobile onLinkClick={closeMenu} />
            <div className="pt-3 border-t border-line">
              <NavBtn authOnly fullWidth onLinkClick={closeMenu} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar