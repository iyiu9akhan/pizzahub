// PremiumBadge — crown icon, amber pill, readable in light/dark.
import { Crown } from "lucide-react"

interface PremiumBadgeProps {
  className?: string
  children?: React.ReactNode
}

export default function PremiumBadge({
  className = "",
  children,
}: PremiumBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 font-heading text-[10px] font-bold text-amber-800 shadow-sm dark:bg-amber-500/20 dark:text-amber-300 ${className}`}
    >
      <Crown className="h-3 w-3 shrink-0" />
      {children || "Premium"}
    </span>
  )
}
