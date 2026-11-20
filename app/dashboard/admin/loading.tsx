// Skeleton shown while the admin dashboard loads
import { Skeleton } from "@/components/ui/skeleton"

const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
    <Skeleton className="h-4 w-24 rounded-full" />
    <Skeleton className="mt-3 h-8 w-16 rounded-full" />
    <Skeleton className="mt-2 h-3 w-32 rounded-full" />
  </div>
)

export default function Loading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <Skeleton className="h-9 w-56 rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-3">
        <Skeleton className="h-6 w-40 rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
