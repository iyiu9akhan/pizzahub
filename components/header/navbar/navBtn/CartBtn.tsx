// Shopping cart button component with item count badge.
// Rendered in the navbar for customer users — links to the my-orders page.
import React from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export interface CartBtnProps {
  className?: string
  count?: number
}

const CartBtn: React.FC<CartBtnProps> = ({
  className = "",
  count = 0,
}) => {
  return (
    <Link
      href="/dashboard/customer/my-orders"
      aria-label={`My orders${count > 0 ? ` — ${count} active` : ""}`}
      title="My Orders"
      className={`group relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-2xs transition-all duration-300 hover:border-brand-muted hover:bg-brand-soft hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95 ${className}`}
    >
      <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      {/* Badge: rendered only when active order count is greater than 0 */}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-heading font-bold text-white shadow-xs">
          {count}
        </span>
      )}
    </Link>
  )
}

export default CartBtn
