import React from "react"
import { ItemDetailsSkeleton } from "@/components/dashboard/skeletons/DashboardSkeletons"

export default function ItemDetailsLoading() {
  return (
    <div className="min-h-screen bg-page transition-colors duration-300">
      <ItemDetailsSkeleton />
    </div>
  )
}
