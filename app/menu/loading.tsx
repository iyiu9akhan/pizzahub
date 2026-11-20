// Loading skeleton for the /menu browse page.
import { MenuItemCardSkeleton } from "@/components/menu/MenuItemCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-8">
      {/* Page header skeleton */}
      <div className="flex flex-col items-center gap-3 text-center mb-10">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 max-w-full rounded-full" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-8 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-11 w-full lg:max-w-md rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MenuItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
