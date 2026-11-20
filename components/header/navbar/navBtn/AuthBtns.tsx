// Authentication action buttons displayed when the user is logged out.
// Renders "Sign In" as a quiet text/ghost button and "Sign Up" as the primary brand button.
"use client"

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
      {/* Quiet "Sign In" button */}
      <Link
        href="/login"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center rounded-full px-4 py-2 font-heading text-sm font-semibold text-ink transition-colors duration-200 hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 text-center cursor-pointer ${
          fullWidth ? "w-full py-2.5 rounded-xl border border-line bg-surface hover:bg-brand-soft" : ""
        }`}
      >
        Sign In
      </Link>

      {/* Primary brand "Sign Up" button */}
      <Link
        href="/register"
        onClick={onLinkClick}
        className={`inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 font-heading text-sm font-semibold text-white shadow-xs transition-all duration-300 hover:bg-brand-dark hover:shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 text-center cursor-pointer ${
          fullWidth ? "w-full py-2.5 rounded-xl shadow-md" : ""
        }`}
      >
        Sign Up
      </Link>
    </div>
  )
}

export default AuthBtns
