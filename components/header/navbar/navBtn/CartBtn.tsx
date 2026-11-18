import React from "react"
import { ShoppingCart } from "lucide-react"

export interface CartBtnProps {
  className?: string
  count?: number
  onClick?: () => void
}

const CartBtn: React.FC<CartBtnProps> = ({
  className = "",
  count = 2,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Shopping cart with ${count} items`}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-2xs transition-all duration-300 hover:border-brand-muted hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 cursor-pointer ${className}`}
    >
      <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      {typeof count === "number" && count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-heading font-bold text-white shadow-xs">
          {count}
        </span>
      )}
    </button>
  )
}

export default CartBtn
