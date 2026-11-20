"use client"

import React from "react"

// The 6 categories required by the project plus "All"
export const MENU_CATEGORY_LIST = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

interface MenuCategoryChipsProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

// Capsule list: scrolls sideways on mobile, spreads evenly on desktop
const MenuCategoryChips = ({
  selectedCategory,
  onCategoryChange,
}: MenuCategoryChipsProps) => {
  const options = ["All", ...MENU_CATEGORY_LIST]
  const active = selectedCategory || "All"

  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 scrollbar-none sm:mx-0 sm:px-0 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {options.map((cat) => {
        const isActive = active === cat
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat === "All" ? "" : cat)}
            className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 font-heading text-sm font-semibold transition-colors lg:flex-1 lg:px-3 ${
              isActive
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-line bg-surface text-ink hover:border-brand-muted hover:bg-brand-soft/40"
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

export default MenuCategoryChips