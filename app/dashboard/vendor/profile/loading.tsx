// Skeleton shown while the vendor profile settings page loads
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <Skeleton className="mb-8 h-9 w-44 rounded-xl" />
      <div className="max-w-2xl rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6 space-y-5">
        <Skeleton className="mx-auto h-28 w-28 rounded-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex justify-end pt-4 border-t border-line">
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
