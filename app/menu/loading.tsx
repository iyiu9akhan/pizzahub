// Loading skeleton for the /menu browse page.
import { MenuItemCardSkeleton } from "@/components/menu/MenuItemCard"
import { Skeleton } from "@/components/ui/skeleton"

export default function MenuLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Page header skeleton: badge + title + 2-line subtitle */}
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-9 w-60 rounded-xl sm:h-11 sm:w-72" />
        <div className="flex w-full flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-full max-w-lg rounded-full" />
          <Skeleton className="h-4 w-4/5 max-w-sm rounded-full" />
        </div>
      </div>

      {/* Filter bar skeleton: search + location + sort */}
      <div className="mb-5 rounded-2xl border border-line bg-surface p-3.5 shadow-2xs sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-11 w-full rounded-2xl lg:max-w-md" />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:items-center">
            <Skeleton className="h-10 w-full rounded-xl sm:w-40" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
          </div>
        </div>
      </div>

      {/* Category pills row skeleton */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-14 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-40 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>

      {/* Results count skeleton */}
      <div className="mb-5">
        <Skeleton className="h-4 w-28 rounded-full" />
      </div>

      {/* Responsive card grid skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MenuItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}


