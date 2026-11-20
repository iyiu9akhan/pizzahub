// Home page featured menu items section — fetches first 4 items from the API.
// Falls back to an empty state if the API is unreachable.
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getItems } from "@/lib/api/items"
import MenuItemCard, {
  MenuItemCardSkeleton,
  MenuItemData,
} from "@/components/menu/MenuItemCard"
import { Suspense } from "react"

// Grid skeleton shown while items are loading (Suspense fallback)
const FeaturedSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <MenuItemCardSkeleton key={i} />
    ))}
  </div>
)

// Async component that fetches and renders the first 4 items
async function FeaturedItems() {
  let items: MenuItemData[] = []
  try {
    const raw = await getItems()

    // TODO(admin): re-enable approval filter after admin panel is built
    // Same rule as /menu page: hide items whose status is set and not "approved".
    // Items without a status field (legacy data) are still shown.
    const visible = raw.filter(
      (item: Record<string, unknown>) =>
        !item.status || item.status === "approved"
    )

    // Normalize images and take at most 4 for the featured grid
    items = visible.slice(0, 4).map((item: Record<string, unknown>) => ({
      ...item,
      images: [
        ...((item.images as string[]) ?? []),
        ...((item.existingImages as string[]) ?? []),
      ],
    })) as MenuItemData[]
  } catch {
    // API unavailable — render empty state below
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center">
        <p className="font-heading text-base font-semibold text-ink">
          No featured items yet
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Check back soon for delicious menu items.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="animate-in duration-500 fade-in slide-in-from-bottom-4"
        >
          <MenuItemCard item={item} />
        </div>
      ))}
    </div>
  )
}

// Main exported section component
const FeatureMenu = () => {
  return (
    <section className="w-full bg-page transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        {/* Section heading */}
        <div className="mb-10 flex flex-col gap-4 pt-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Featured Menu Items
            </h2>
            <p className="mt-2 font-text text-sm text-ink-muted">
              Fresh, delicious pizzas made by our top-rated vendors — ready to
              order now.
            </p>
          </div>

          {/* "View all menu" button */}
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 self-start rounded-full border border-brand px-5 py-2.5 font-heading text-sm font-semibold text-brand-fg transition-all hover:bg-brand hover:text-white sm:self-auto"
          >
            View all menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Items grid with Suspense skeleton */}
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedItems />
        </Suspense>
      </div>
    </section>
  )
}

export default FeatureMenu
