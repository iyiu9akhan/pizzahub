import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton, ChartSkeleton } from "@/components/dashboard/skeletons/DashboardSkeletons"

export default function AdminLoading() {
  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-60 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      {/* stats card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* cart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  )
}
