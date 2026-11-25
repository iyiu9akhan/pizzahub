import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-16"
      role="status"
      aria-busy="true"
      aria-label="Loading page"
    >
      {/* Hero skeleton */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left: pizza image placeholder */}
        <div className="flex items-center justify-center">
          <Skeleton className="aspect-square w-full max-w-md rounded-full" />
        </div>

        {/* Right: text content */}
        <div className="flex flex-col gap-5">
          <Skeleton className="h-7 w-36 rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-full max-w-lg rounded-xl" />
            <Skeleton className="h-12 w-4/5 max-w-md rounded-xl" />
            <Skeleton className="h-12 w-1/2 max-w-xs rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full max-w-md rounded-full" />
            <Skeleton className="h-4 w-5/6 max-w-sm rounded-full" />
          </div>
          <Skeleton className="mt-2 h-12 w-48 rounded-xl" />
        </div>
      </div>

      {/* Featured section skeleton */}
      <div className="mt-20">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <Skeleton className="hidden h-10 w-36 rounded-full sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-line bg-surface p-3"
            >
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <div className="mt-4 flex flex-col gap-2.5 px-1 pb-1">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
                <Skeleton className="mt-2 h-11 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}