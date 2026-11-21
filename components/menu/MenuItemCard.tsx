// Shared menu item card used by customer browse, vendor dashboard, and admin panels.
// All three contexts pass the same `item` shape; only the footer `actions` differ.
"use client"

import React from "react"
import Link from "next/link"
import { MapPin, Pizza, Crown, Star } from "lucide-react"
import { formatBDT } from "@/lib/format"
import { Skeleton } from "@/components/ui/skeleton"

// ----- Types ----------------------------------------------------------------

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive"

export interface MenuItemData {
  _id: string
  itemName: string
  category: string
  description?: string
  price: number
  location: string
  /** All image URLs — card reads item.images (already merged by parent) */
  images?: string[]
  status?: MenuItemStatus
  vendorName?: string
  vendorId?: string
  isPremiumVendor?: boolean
  ratingAvg?: number
  ratingCount?: number
}

export interface MenuItemCardProps {
  item: MenuItemData
  /** If passed, renders a status badge on the image */
  status?: MenuItemStatus
  /** Show a heart/favorite icon button (default false) */
  showFavorite?: boolean
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
  actions,
}: MenuItemCardProps) => {
  // Use first image from the already-merged images array
  const coverImage = item.images?.[0]

  // Resolve status badge if prop is passed
  const statusBadge = status ? STATUS_STYLES[status] : null

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-2xs transition-shadow duration-300 hover:shadow-lg">
      {/* Image with category chip and optional status badge */}
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-brand-soft/40">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={item.itemName}
            loading="lazy"
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
            className={`absolute left-3 top-3 rounded-full px-3 py-1 font-heading text-[11px] font-bold ${statusBadge.cls}`}
          >
            {statusBadge.label}
          </span>
        )}

        {/* Premium vendor badge — top-right */}
        {item.isPremiumVendor && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 font-heading text-[10px] font-bold text-white shadow">
            <Crown className="h-3 w-3" />
            Premium
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        {/* Title + price on one row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-heading text-lg font-bold text-ink">
            {item.itemName}
          </h3>
          <span className="shrink-0 rounded-full bg-brand px-3 py-1 font-heading text-sm font-bold text-white">
            {formatUSD(item.price)}
          </span>
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
            // Default action: "View Details" link
            <Link
              href={`/menu/${item._id}`}
              className="flex w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 font-heading text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
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

// ----- Skeleton -------------------------------------------------------------

/** Grid placeholder shown while menu items are loading */
export const MenuItemCardSkeleton = () => (
  <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-3 shadow-2xs">
    {/* Image placeholder */}
    <Skeleton className="aspect-4/3 w-full rounded-2xl" />
    <div className="flex flex-1 flex-col px-2 pb-1 pt-4 gap-3">
      {/* Title row */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-3/5 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
      {/* Description lines */}
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-4 w-4/5 rounded-full" />
      {/* Chips */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      {/* Button */}
      <Skeleton className="mt-auto h-10 w-full rounded-full" />
    </div>
  </div>
)
