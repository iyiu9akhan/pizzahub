// Skeleton shown while vendor orders list loads
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <Skeleton className="h-9 w-40 rounded-xl" />
      {/* Table rows skeleton */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
