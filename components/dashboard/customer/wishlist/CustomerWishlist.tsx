"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Heart, Trash2, ArrowRight, Pizza, MapPin, Store, Star, Loader2 } from "lucide-react"
import { formatUSD } from "@/lib/format"
import { toastSuccess, toastError } from "@/lib/toast"
import { removeFromWishlistAction } from "@/lib/actions/WishlistActions"
import type { WishlistItem } from "@/lib/api/wishlist"

export interface CustomerWishlistProps {
  items: WishlistItem[]
}

export default function CustomerWishlist({ items: initialItems }: CustomerWishlistProps) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const handleRemove = async (itemId: string) => {
    if (removingId) return
    setRemovingId(itemId)
    const prevItems = items
    // Optimistic removal
    setItems((curr) => curr.filter((i) => i._id !== itemId))

    try {
      const res = await removeFromWishlistAction(itemId)
      if (res.success) {
        toastSuccess("Removed from your wishlist.")
      } else {
        setItems(prevItems)
        toastError("Remove failed", res.message || "Could not remove item.")
      }
    } catch {
      setItems(prevItems)
      toastError("Remove failed", "Something went wrong. Please try again.")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="w-full min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1.5 max-w-xl font-text text-sm text-ink-muted">
            Items you&apos;ve saved for later. Open one to order, or remove what you no longer want.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2 self-start rounded-xl border border-line bg-surface px-3.5 py-2 sm:self-auto">
            <Heart className="h-4 w-4 fill-brand text-brand" />
            <span className="font-heading text-sm font-semibold text-ink">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
        )}
      </header>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-heading text-lg font-bold text-ink">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-sm font-text text-sm text-ink-muted">
            Tap the heart on any menu item to save it here for later.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-95"
          >
            Browse menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {items.map((item) => {
            const coverImage = item.images?.[0]
            const isRemoving = removingId === item._id
            const hasRating = typeof item.ratingAvg === "number" && item.ratingAvg > 0

            return (
              <li key={item._id} className="flex">
                <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow duration-200 hover:shadow-md">
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-brand-soft/40">
                    {coverImage && !failedImages[item._id] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverImage}
                        alt={item.itemName}
                        loading="lazy"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [item._id]: true }))
                        }
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-brand-fg/40">
                        <Pizza className="h-12 w-12" />
                      </div>
                    )}

                    {/* Category */}
                    <span className="absolute bottom-3 left-3 max-w-[70%] truncate rounded-md bg-white/90 px-2.5 py-1 font-heading text-[11px] font-semibold text-ink shadow-sm backdrop-blur-sm dark:bg-surface/90">
                      {item.category}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item._id)}
                      disabled={isRemoving}
                      aria-label={`Remove ${item.itemName} from wishlist`}
                      title="Remove from wishlist"
                      className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink-muted shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 dark:bg-surface/90 dark:hover:bg-red-500/15 dark:hover:text-red-400"
                    >
                      {isRemoving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-1 font-heading text-base font-bold text-ink">
                        {item.itemName}
                      </h3>
                      <div className="flex shrink-0 items-center gap-1 text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-heading font-semibold text-ink">
                          {hasRating ? item.ratingAvg!.toFixed(1) : "New"}
                        </span>
                        {typeof item.ratingCount === "number" && item.ratingCount > 0 && (
                          <span className="text-ink-muted">({item.ratingCount})</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-1.5 line-clamp-2 min-h-10 font-text text-sm leading-5 text-ink-muted">
                      {item.description || "Freshly baked with authentic ingredients."}
                    </p>

                    {/* Meta */}
                    <div className="mb-4 mt-3 space-y-1.5 font-text text-xs text-ink-muted">
                      {item.location && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </p>
                      )}
                      {item.vendorName && (
                        <p className="flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{item.vendorName}</span>
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                      <span className="font-heading text-lg font-bold text-ink">
                        {formatUSD(item.price)}
                      </span>
                      <Link
                        href={`/menu/${item._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 font-heading text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        View details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}