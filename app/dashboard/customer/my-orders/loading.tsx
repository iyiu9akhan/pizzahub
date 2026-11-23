import React from "react"

const OrderSkeleton = () => (
  <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs animate-pulse">
    <div className="flex gap-4">
      {/* Thumbnail placeholder */}
      <div className="h-20 w-20 shrink-0 rounded-xl bg-muted" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/4 rounded bg-muted" />
        <div className="mt-1 h-5 w-24 rounded-full bg-muted" />
      </div>
      <div className="h-6 w-20 shrink-0 rounded bg-muted" />
    </div>
    <div className="mt-3 flex gap-4 border-t border-line pt-3">
      <div className="h-3 w-40 rounded bg-muted" />
      <div className="ml-auto h-3 w-24 rounded bg-muted" />
    </div>
  </div>
)

export default function Loading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="mt-2 h-4 w-72 rounded bg-muted animate-pulse" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
