"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Heart, Trash2, ArrowRight, Pizza, MapPin, Store, Star } from "lucide-react"
import { formatUSD } from "@/lib/format"
import { toastSuccess, toastError } from "@/lib/toast"
import { removeFromWishlistAction } from "@/lib/actions/WishlistActions"
import LoadingButton from "@/components/ui/LoadingButton"
import type { WishlistItem } from "@/lib/api/wishlist"

export interface CustomerWishlistProps {
  items: WishlistItem[]
}

export default function CustomerWishlist({ items: initialItems }: CustomerWishlistProps) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId)
    const prevItems = items
    // Optimistic removal
    setItems((curr) => curr.filter((i) => i._id !== itemId))

    try {
      const res = await removeFromWishlistAction(itemId)
      if (res.success) {
        toastSuccess("Item removed from your wishlist.")
      } else {
        setItems(prevItems)
        toastError("Remove failed", res.message || "Could not remove item.")
      }
    } catch {
      setItems(prevItems)
      toastError("Remove failed", "An error occurred while removing the item.")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Count */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            My Wishlist
          </h1>
          <p className="mt-1 font-text text-sm text-ink-muted">
            All the artisan pizzas and delicious items you have saved for later.
          </p>
        </div>

        {items.length > 0 && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-soft px-3.5 py-1.5 font-heading text-xs font-bold text-brand-fg">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>
              {items.length} {items.length === 1 ? "saved item" : "saved items"}
            </span>
          </span>
        )}
      </div>

      {/* Main Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-surface p-12 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-bold text-ink">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-sm font-text text-sm text-ink-muted">
            You haven&apos;t saved any pizzas yet. Explore our freshly baked selection and tap the heart icon to save your favorites!
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <span>Explore Menu</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const coverImage = item.images?.[0]
            const isRemoving = removingId === item._id

            return (
              <article
                key={item._id}
                className="group flex flex-col rounded-3xl border border-line bg-surface p-3 shadow-2xs transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Image & Category */}
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-brand-soft/40">
                  {coverImage && !failedImages[item._id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverImage}
                      alt={item.itemName}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [item._id]: true,
                        }))
                      }
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-brand-fg/50">
                      <Pizza className="h-12 w-12" />
                    </div>
                  )}

                  <span className="absolute bottom-3 left-3 max-w-[75%] truncate rounded-full bg-white/90 px-3 py-1 font-heading text-[11px] font-bold text-brand-fg shadow-sm dark:bg-surface/90">
                    {item.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 font-heading text-lg font-bold text-ink">
                      {item.itemName}
                    </h3>
                    <span className="shrink-0 rounded-full bg-brand px-3 py-1 font-heading text-sm font-bold text-white">
                      {formatUSD(item.price)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-heading font-bold text-ink">
                      {typeof item.ratingAvg === "number" && item.ratingAvg > 0
                        ? item.ratingAvg.toFixed(1)
                        : "New"}
                    </span>
                    {typeof item.ratingCount === "number" && item.ratingCount > 0 && (
                      <span className="text-ink-muted">({item.ratingCount})</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 min-h-10 font-text text-sm leading-5 text-ink-muted">
                    {item.description || "Freshly baked pizza made with authentic ingredients."}
                  </p>

                  {/* Location & Vendor */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-brand-soft/60 px-2.5 py-1 font-text text-[11px] font-medium text-ink-muted">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    {item.vendorName && (
                      <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 font-text text-[11px] font-medium text-brand-fg">
                        <Store className="h-3 w-3 shrink-0" />
                        <span className="truncate">{item.vendorName}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <Link
                      href={`/menu/${item._id}`}
                      className="flex-1 rounded-full bg-brand px-3 py-2 text-center font-heading text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      View Details
                    </Link>

                    <LoadingButton
                      type="button"
                      isLoading={isRemoving}
                      loadingText=""
                      onClick={() => handleRemove(item._id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-muted transition-colors hover:border-red-500/30 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </LoadingButton>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
