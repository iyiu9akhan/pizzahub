import React from "react"
import { TableSkeleton } from "@/components/dashboard/skeletons/DashboardSkeletons"

export default function AdminOrdersLoading() {
  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <TableSkeleton rows={6} cols={6} />
    </div>
  )
}
