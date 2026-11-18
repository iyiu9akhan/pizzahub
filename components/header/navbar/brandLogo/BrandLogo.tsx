import React from "react"
import Link from "next/link"
import { Pizza } from "lucide-react"

export interface BrandLogoProps {
  className?: string
  isLight?: boolean
  onClick?: () => void
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  isLight = false,
  onClick,
}) => {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group flex items-center gap-2.5 rounded-xl transition-opacity hover:opacity-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 ${className}`}
      aria-label="PizzaHub Home"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 ${
          isLight ? "bg-white text-brand" : "bg-brand text-white shadow-brand/25"
        }`}
      >
        <Pizza className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-heading text-xl font-extrabold leading-tight tracking-tight ${
            isLight ? "text-white" : "text-ink"
          }`}
        >
          Pizza<span className={isLight ? "text-white" : "text-brand-fg"}>Hub</span>
        </span>
        <span
          className={`font-text text-[11px] font-medium tracking-wide ${
            isLight ? "text-white/80" : "text-ink-muted"
          }`}
        >
          Hot, Fresh, Delivered Fast
        </span>
      </div>
    </Link>
  )
}

export default BrandLogo