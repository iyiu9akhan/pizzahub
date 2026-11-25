"use client"

import React, { useState } from "react"
import Link from "next/link"
import { MapPin, Pizza, Star, Heart } from "lucide-react"
import { formatUSD } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/auth-client"
import { toastInfo, toastSuccess, toastError } from "@/lib/toast"
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/lib/actions/WishlistActions"
import PremiumBadge from "@/components/ui/PremiumBadge"

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive"

export interface MenuItemData {
  _id: string
  itemName: string
  category: string
  description?: string
  price: number
  location: string
  images?: string[]
  status?: MenuItemStatus
  vendorName?: string
  vendorId?: string
  isPremiumVendor?: boolean
  vendorPremium?: boolean
  ratingAvg?: number
  ratingCount?: number
}

export interface MenuItemCardProps {
  item: MenuItemData
  /** If passed, renders a status badge on the image */
  status?: MenuItemStatus
  /** Show a heart/favorite icon button (default true) */
  showFavorite?: boolean
  /** Initial favorite state */
  isFavorite?: boolean
  /** Subtle "Featured" label on premium items in featured section */
  showFeaturedLabel?: boolean
  /** Custom footer content; if omitted, a "View Details" link is shown */
  actions?: React.ReactNode
}

// Status badge styles for each state
const STATUS_STYLES: Record<MenuItemStatus, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  },
  inactive: {
    label: "Inactive",
    cls: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
  },
}

// ----- Card -----------------------------------------------------------------

const MenuItemCard = ({
  item,
  status,
  showFavorite = true,
  isFavorite = false,
  showFeaturedLabel = false,
  actions,
}: MenuItemCardProps) => {
  const { data: session } = useSession()
  const [favorite, setFavorite] = useState<boolean>(isFavorite)
  const [isWishlistLoading, setIsWishlistLoading] = useState<boolean>(false)
  const [imgError, setImgError] = useState<boolean>(false)

  // Use first image from the already-merged images array
  const coverImage = item.images?.[0]

  // Resolve status badge if prop is passed
  const statusBadge = status ? STATUS_STYLES[status] : null

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      toastInfo("Please sign in as a customer to save items to your wishlist.")
      return
    }

    const userRole =
      (session.user as { role?: string } | undefined)?.role || "customer"
    if (userRole !== "customer") {
      toastInfo("Only customer accounts can use the wishlist.")
      return
    }

    const nextState = !favorite
    setFavorite(nextState)
    setIsWishlistLoading(true)

    try {
      const res = nextState
        ? await addToWishlistAction(item._id)
        : await removeFromWishlistAction(item._id)

      if (res.success) {
        toastSuccess(nextState ? "Added to wishlist" : "Removed from wishlist")
      } else {
        setFavorite(!nextState)
        toastError(
          "Wishlist update failed",
          res.message || "Could not update wishlist."
        )
      }
    } catch {
      setFavorite(!nextState)
      toastError(
        "Wishlist update failed",
        "An error occurred while updating wishlist."
      )
    } finally {
      setIsWishlistLoading(false)
    }
  }

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-2xs transition-shadow duration-300 hover:shadow-lg">
      {/* Image with category chip and optional status badge */}
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-brand-soft/40">
        {coverImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={item.itemName}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-fg/50">
            <Pizza className="h-12 w-12" />
          </div>
        )}

        {/* Category chip — bottom-left of image */}
        <span className="absolute bottom-3 left-3 max-w-[75%] truncate rounded-full bg-white/90 px-3 py-1 font-heading text-[11px] font-bold text-brand-fg shadow-sm dark:bg-surface/90">
          {item.category}
        </span>

        {/* Status badge — top-left, only when status prop is provided */}
        {statusBadge && (
          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 font-heading text-[11px] font-bold ${statusBadge.cls}`}
          >
            {statusBadge.label}
          </span>
        )}

        {/* Subtle "Featured" label on premium items in featured section */}
        {!statusBadge &&
          showFeaturedLabel &&
          (item.isPremiumVendor || item.vendorPremium) && (
            <span className="absolute top-3 left-3 rounded-full border border-brand/20 bg-surface/90 px-2.5 py-0.5 font-heading text-[10px] font-semibold text-brand-fg shadow-2xs backdrop-blur-xs">
              Featured
            </span>
          )}

        {/* Premium vendor badge — top-right */}
        {(item.isPremiumVendor || item.vendorPremium) && (
          <span className="absolute top-3 right-3">
            <PremiumBadge />
          </span>
        )}

        {/* Wishlist Heart Toggle Button */}
        {showFavorite && (
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={isWishlistLoading}
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none active:scale-95 dark:bg-surface/90 ${
              item.isPremiumVendor || item.vendorPremium
                ? "top-10 right-3"
                : "top-3 right-3"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorite
                  ? "fill-red-500 text-red-500"
                  : "text-ink-muted hover:text-red-500"
              }`}
            />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-2 pt-4 pb-1">
        {/* Title + price on one row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-heading text-lg font-bold text-ink">
            {item.itemName}
          </h3>
          <span className="shrink-0 rounded-full bg-brand px-3 py-1 font-heading text-sm font-bold text-white">
            {formatUSD(item.price)}
          </span>
        </div>

        {/* Rating stars & reviews */}
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

        {/* 2-line description */}
        <p className="mt-2 line-clamp-2 min-h-10 font-text text-sm leading-5 text-ink-muted">
          {item.description || "No description added."}
        </p>

        {/* Location + vendor chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-brand-soft/60 px-3 py-1 font-text text-[11px] font-medium text-ink-muted">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>
          {item.vendorName && (
            <span className="rounded-full bg-brand-soft px-3 py-1 font-text text-[11px] font-medium text-brand-fg">
              {item.vendorName}
            </span>
          )}
        </div>

        {/* Footer — push to bottom for equal card heights in a grid */}
        <div className="mt-auto pt-4">
          {actions ?? (
            <Link
              href={session?.user ? `/menu/${item._id}` : "/login"}
              className="flex w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 font-heading text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default MenuItemCard

export const MenuItemCardSkeleton = () => (
  <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-2xs">
    {/* Image placeholder matching aspect-4/3 */}
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-brand-soft/40">
      <Skeleton className="h-full w-full rounded-2xl" />
      {/* Bottom-left category chip placeholder */}
      <Skeleton className="absolute bottom-3 left-3 h-6 w-28 rounded-full" />
      {/* Top-right action circle placeholder */}
      <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
    </div>

    {/* Card body matching MenuItemCard spacing */}
    <div className="flex flex-1 flex-col px-2 pt-4 pb-1">
      {/* Title + price row */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-6 w-3/5 rounded-full" />
        <Skeleton className="h-7 w-14 shrink-0 rounded-full" />
      </div>

      {/* Rating row */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <Skeleton className="h-3.5 w-3.5 rounded-full" />
        <Skeleton className="h-3.5 w-10 rounded-full" />
      </div>

      {/* 2-line description */}
      <div className="mt-2 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-4/5 rounded-full" />
      </div>

      {/* Location + vendor chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Full-width button */}
      <Skeleton className="mt-4 h-10 w-full rounded-full" />
    </div>
  </div>
)
