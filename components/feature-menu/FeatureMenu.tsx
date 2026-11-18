import React from "react"
import MenuCard, { MenuItem } from "@/components/feature-menu/menuCard/MenuCard"

export interface FeatureMenuProps {
  className?: string
}

export const FEATURED_PIZZAS: MenuItem[] = [
  {
    id: "margherita",
    name: "Margherita",
    subtitle: "Classic Italian",
    price: 450,
    rating: 4.8,
    image: "/images/pizza/menu-pizza.png",
  },
  {
    id: "pepperoni-feast",
    name: "Pepperoni Feast",
    subtitle: "Spicy & Cheesy",
    price: 650,
    rating: 4.9,
    image: "/images/pizza/hero-pizza.png",
  },
  {
    id: "veggie-supreme",
    name: "Veggie Supreme",
    subtitle: "Fresh Garden",
    price: 550,
    rating: 4.7,
    image: "/images/pizza/menu-pizza.png",
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    subtitle: "Smoky & Grilled",
    price: 750,
    rating: 4.8,
    image: "/images/pizza/hero-pizza.png",
  },
]

const FeatureMenu: React.FC<FeatureMenuProps> = ({ className = "" }) => {
  return (
    /*
      pt-16 gives vertical space above the grid so the floating
      thumbnails (-top-12) don't clip against the section above.
      On desktop the section flows directly after the banner with no extra top margin.
    */
    <section className={`w-full bg-page transition-colors duration-300 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        {/* pt-16 = room for the 48px thumbnail overlap + 16px breathing space */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-20 pt-16">
          {FEATURED_PIZZAS.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureMenu
