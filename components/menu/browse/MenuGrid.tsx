// MenuGrid — responsive grid rendering MenuItemCard components.
// Breakpoints: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols wide screens.
// Enforces equal height cards across the entire grid.
import React from "react"
import MenuItemCard from "@/components/menu/MenuItemCard"
import type { MenuItem } from "@/types/menu"

export interface MenuGridProps {
  items: MenuItem[]
  wishlistIds?: string[]
}

export default function MenuGrid({ items, wishlistIds = [] }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <div key={item._id} className="h-full">
          <MenuItemCard
            item={item}
            isFavorite={wishlistIds.includes(item._id)}
          />
        </div>
      ))}
    </div>
  )
}
