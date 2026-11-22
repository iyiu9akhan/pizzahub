import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 shadow-xs">
      <Skeleton className="h-12 w-12 shrink-0 rounded-2xl bg-brand-soft" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function ChartSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-3.5 w-60 rounded-md" />
        </div>
      )}
      <div className="mt-6 flex h-64 w-full items-center justify-center rounded-2xl bg-brand-soft/20">
        <Skeleton className="h-48 w-4/5 rounded-xl bg-brand-soft/40" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4 rounded-3xl border border-line bg-surface p-6 shadow-xs">
      {/* Header controls skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table rows */}
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="flex border-b border-line bg-brand-soft/30 p-4 gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-md" />
          ))}
        </div>
        <div className="divide-y divide-line">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex p-4 gap-4 items-center">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4 flex-1 rounded-md" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ItemDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      <Skeleton className="mb-8 h-5 w-32 rounded-md" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left gallery skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-4/3 w-full rounded-3xl" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right metadata skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>

          <div className="space-y-2 border-t border-line pt-4">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>

          <div className="rounded-2xl border border-line p-4 space-y-3">
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>

          <div className="rounded-2xl border border-line p-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
