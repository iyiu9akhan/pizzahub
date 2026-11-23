import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistLoading() {
  return (
    <div className="w-full min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      {/* Cards */}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i} className="flex">
            <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
              <Skeleton className="aspect-4/3 w-full rounded-none" />

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>

                <div className="mt-2 space-y-2">
                  <Skeleton className="h-3.5 w-full rounded-full" />
                  <Skeleton className="h-3.5 w-3/4 rounded-full" />
                </div>

                <div className="mb-4 mt-3 space-y-2">
                  <Skeleton className="h-3 w-28 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}