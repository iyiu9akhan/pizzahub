// WhyChooseUs — 4 benefit cards explaining PizzaHub's key value props.
import { Wheat, Zap, Store, Smartphone } from "lucide-react"

// Benefit data for each card
const BENEFITS = [
  {
    icon: Wheat,
    title: "Fresh Ingredients",
    description:
      "Every pizza is made with hand-picked, premium ingredients sourced fresh daily.",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description:
      "Hot pizzas at your door in 30 minutes or less — straight from the oven.",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Store,
    title: "Local Pizza Shops",
    description:
      "Support your neighbourhood vendors. Real kitchens, real people, real flavour.",
    color: "text-brand-fg",
    bg: "bg-brand-soft",
  },
  {
    icon: Smartphone,
    title: "Easy Ordering",
    description:
      "Browse, pick, and checkout in seconds. No calls, no waiting — just pizza.",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
]

export default function WhyChooseUs() {
  return (
    // Section with fade-up animation
    <section className="bg-surface py-16 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Why Choose PizzaHub?
          </h2>
          <p className="mt-3 font-text text-base text-ink-muted">
            More than just delivery — it&apos;s a better pizza experience
          </p>
        </div>

        {/* 2×2 grid on tablet+, single column on mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-page p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Icon */}
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon className={`h-6 w-6 ${color}`} />
              </span>
              {/* Title */}
              <h3 className="font-heading text-base font-bold text-ink">
                {title}
              </h3>
              {/* Description */}
              <p className="font-text text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
