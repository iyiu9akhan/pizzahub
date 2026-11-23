// PizzaCategories — 6-card category grid linking to /menu?category=<name>.
// 2 columns on mobile, 3 on tablet and desktop.
import Link from "next/link"
import {
  Pizza,
  Leaf,
  Beef,
  Star,
  UtensilsCrossed,
  GlassWater,
} from "lucide-react"
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion"

// Category data: icon, label, and query value
const CATEGORIES = [
  {
    name: "Classic Pizzas",
    icon: Pizza,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    name: "Vegetarian Pizzas",
    icon: Leaf,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    name: "Meat Lovers",
    icon: Beef,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    icon: Star,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    name: "Sides & Appetizers",
    icon: UtensilsCrossed,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    name: "Beverages & Desserts",
    icon: GlassWater,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
]

export default function PizzaCategories() {
  return (
    <section className="bg-page py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <FadeIn className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 font-text text-base text-ink-muted">
            Find exactly what you&apos;re craving
          </p>
        </FadeIn>

        {/* 2-column mobile, 3-column tablet+ grid */}
        <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
          {CATEGORIES.map(({ name, icon: Icon, color, bg }) => (
            <StaggerItem key={name}>
              <Link
                href={`/menu?category=${encodeURIComponent(name)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md active:scale-95"
              >
                {/* Icon container */}
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </span>
                {/* Category label */}
                <span className="font-heading text-sm font-semibold leading-snug text-ink">
                  {name}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
