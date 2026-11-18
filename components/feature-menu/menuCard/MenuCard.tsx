"use client"

import React from "react"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/currency"

export interface MenuItem {
  id: string
  name: string
  subtitle: string
  price: number
  rating: number
  image: string
}

export interface MenuCardProps {
  item: MenuItem
  className?: string
  onAddToCart?: (item: MenuItem) => void
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  className = "",
  onAddToCart,
}) => {
  return (
    /*
      overflow-visible is REQUIRED so the floating thumbnail above the card isn't clipped.
      The card itself starts with pt-14 to leave room below the thumbnail overlap.
    */
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-brand pt-14 pb-4 px-4 shadow-xl shadow-brand/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-dark cursor-pointer overflow-visible ${className}`}
    >
      {/* ── Floating thumbnail: half above the card top-left corner ── */}
      {/*
        Size: 100×100px.
        -top-12 → pulls 48px above the card top edge.
        -left-3  → slight left offset to match the foodbar reference badge position.
        No background, no clip, pure transparent PNG.
      */}
      <div className="absolute -top-12 -left-3 w-[100px] h-[100px] drop-shadow-xl z-10 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
        <Image
          src={item.image}
          alt={item.name}
          width={100}
          height={100}
          className="w-full h-full object-contain"
        />
      </div>

      {/* ── Top right: Price ─────────────────────────────────────── */}
      <div className="self-end text-right">
        <span className="font-heading text-base font-bold text-white tracking-tight">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* ── Bottom row: Info + Cart button ───────────────────────── */}
      <div className="flex items-end justify-between mt-3">
        <div className="flex flex-col text-left">
          <h3 className="font-heading text-sm font-semibold text-white leading-tight">
            {item.name}
          </h3>
          <span className="font-text text-xs text-white/70 mt-0.5">
            {item.subtitle}
          </span>
          <span className="font-heading text-xs font-semibold text-white/80 mt-1">
            ★ {item.rating.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart?.(item)
          }}
          aria-label={`Add ${item.name} to cart`}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-200 hover:bg-white/30 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default MenuCard
