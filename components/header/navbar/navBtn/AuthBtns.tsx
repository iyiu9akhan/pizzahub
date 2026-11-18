import React from "react"
import Link from "next/link"

export interface AuthBtnsProps {
  className?: string
  fullWidth?: boolean
  onLinkClick?: () => void
}

const AuthBtns: React.FC<AuthBtnsProps> = ({
  className = "",
  fullWidth = false,
  onLinkClick,
}) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        fullWidth ? "w-full flex-col sm:flex-row" : ""
      } ${className}`}
    >
      <Link
        href="/login"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center rounded-full border border-brand px-4 py-2 font-heading text-sm font-semibold text-brand-fg transition-all duration-300 hover:bg-brand hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 text-center cursor-pointer ${
          fullWidth ? "w-full py-2.5" : ""
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 font-heading text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:bg-brand-dark hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 text-center cursor-pointer ${
          fullWidth ? "w-full py-2.5" : ""
        }`}
      >
        Sign up
      </Link>
    </div>
  )
}

export default AuthBtns
