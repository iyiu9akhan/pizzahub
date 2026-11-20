"use client"

import React, { useState, useSyncExternalStore } from "react"
import Link from "next/link"

import {
  MapPin,
  Store,
  ArrowLeft,
  ShoppingBag,
  Info,
  Pizza,
  CheckCircle2,
} from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { formatBDT } from "@/lib/format"

import type { MenuItem } from "@/types/menu"

// Subscription for client hydration detection without setState in effect
const emptySubscribe = () => () => {}

export interface MenuItemDetailsProps {
  item: MenuItem
  onOrderClick: () => void
}

export default function MenuItemDetails({
  item,
  onOrderClick,
}: MenuItemDetailsProps) {
  const { data: session, isPending } = useSession()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  const role =
    (session?.user as { role?: string } | undefined)?.role || "customer"

  const images = item.images && item.images.length > 0 ? item.images : []
  const activeImage = images[activeImageIndex]

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {/* Back to menu button */}
      <Link
        href="/menu"
        className="mb-8 inline-flex items-center gap-2 font-heading text-sm font-semibold text-ink-muted transition-colors hover:text-brand-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column: Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-line bg-surface shadow-md">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage}
                alt={item.itemName}
                className="h-full w-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-fg/40">
                <Pizza className="h-20 w-20" />
              </div>
            )}

            {/* Category tag on image */}
            <span className="absolute bottom-4 left-4 rounded-full bg-surface/90 px-4 py-1.5 font-heading text-xs font-bold text-brand-fg shadow-sm backdrop-blur-xs">
              {item.category}
            </span>
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImageIndex === idx
                      ? "scale-105 border-brand shadow-sm"
                      : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${item.itemName} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Item metadata */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-text text-xs font-bold uppercase tracking-widest text-brand-fg">
              {item.category}
            </span>

            <h1 className="mt-1 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
              {item.itemName}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="font-heading text-3xl font-extrabold text-brand-fg">
                {formatBDT(item.price)}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Freshly Baked
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-line pt-4">
            <h2 className="font-heading text-sm font-bold text-ink">
              Description
            </h2>

            <p className="mt-2 font-text text-base leading-relaxed text-ink-muted">
              {item.description ||
                "No specific description provided for this menu item."}
            </p>
          </div>

          {/* Location and vendor */}
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3 font-text text-sm text-ink">
              <MapPin className="h-4 w-4 shrink-0 text-brand-fg" />

              <span>
                Location:{" "}
                <strong className="font-semibold">{item.location}</strong>
              </span>
            </div>

            {item.vendorName && (
              <div className="flex items-center gap-3 font-text text-sm text-ink">
                <Store className="h-4 w-4 shrink-0 text-brand-fg" />

                <span>
                  Prepared by:{" "}
                  <strong className="font-semibold">{item.vendorName}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Order Action Area */}
          <div className="border-t border-line pt-6">
            {!mounted || isPending ? (
              <div className="h-12 w-full animate-pulse rounded-xl bg-brand-soft" />
            ) : !session ? (
              // Logged-out state
              <div className="flex flex-col gap-3">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(
                    `/menu/${item._id}`
                  )}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Sign In to Order</span>
                </Link>

                <p className="text-center font-text text-xs text-ink-muted">
                  Please log in as a customer to place orders.
                </p>
              </div>
            ) : role === "customer" ? (
              // Customer state
              <button
                type="button"
                onClick={onOrderClick}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Order Now</span>
              </button>
            ) : (
              // Vendor or Admin state
              <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
                <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                <p className="font-text text-sm font-medium">
                  Only customers can place orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}