import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton, ChartSkeleton } from "@/components/dashboard/skeletons/DashboardSkeletons"

export default function CustomerLoading() {
  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

    
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

     
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

    
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-xs space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="divide-y divide-line">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
