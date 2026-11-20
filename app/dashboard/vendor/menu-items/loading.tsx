// Skeleton shown while the vendor menu-items list loads
import { MenuItemCardSkeleton } from "@/components/menu/MenuItemCard"

export default function Loading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8 space-y-2">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-brand-soft/40" />
        <div className="h-4 w-72 animate-pulse rounded-full bg-brand-soft/40" />
      </div>
      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
