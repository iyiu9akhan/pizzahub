import React from "react"
import ThemeToggle from "@/components/header/navbar/navBtn/ThemeToggle"
import CartBtn from "@/components/header/navbar/navBtn/CartBtn"
import AuthBtns from "@/components/header/navbar/navBtn/AuthBtns"

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
    return (
      <AuthBtns
        className={className}
        fullWidth={fullWidth}
        onLinkClick={onLinkClick}
      />
    )
  }

  return (
    <div
      className={`flex items-center gap-3 ${
        fullWidth ? "w-full flex-col" : ""
      } ${className}`}
    >
      <ThemeToggle />
      <CartBtn count={cartCount} />
      <div className="h-5 w-px bg-line hidden sm:block mx-0.5" />
      <AuthBtns fullWidth={fullWidth} onLinkClick={onLinkClick} />
    </div>
  )
}

export default NavBtn
export { CartBtn, AuthBtns, ThemeToggle }
