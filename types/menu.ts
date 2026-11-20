// Type definitions for menu items, sorting, and browse filter states.
import type { MenuItemData, MenuItemStatus } from "@/components/menu/MenuItemCard"

export type { MenuItemStatus }

export interface MenuItem extends MenuItemData {
  /** Legacy array of image URLs to merge with images */
  existingImages?: string[]
}

export type SortOption = "default" | "price-asc" | "price-desc"

export interface FilterState {
  q: string
  category: string
  location: string
  sort: SortOption
}

export const MENU_CATEGORIES = [
  "All",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

export type MenuCategory = (typeof MENU_CATEGORIES)[number]
