// HowItWorks — numbered steps showing the PizzaHub ordering flow.
// Horizontal on desktop with connector lines, vertical list on mobile.
import { Search, Pizza, ShoppingCart, PartyPopper } from "lucide-react"
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion"

// Steps data
const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Browse the Menu",
    description: "Explore hundreds of pizzas from local vendors near you.",
  },
  {
    number: "02",
    icon: Pizza,
    title: "Pick Your Pizza",
    description: "Choose your favourites — classic, veggie, or gourmet.",
  },
  {
    number: "03",
    icon: ShoppingCart,
    title: "Place Your Order",
    description: "Quick checkout, no fuss. Pay securely in seconds.",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Enjoy!",
    description: "Sit back while your hot pizza heads to your door.",
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-page py-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <FadeIn className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            How PizzaHub Works
          </h2>
          <p className="mt-3 font-text text-base text-ink-muted">
            From craving to doorstep in four easy steps
          </p>
        </FadeIn>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <StaggerGroup className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {STEPS.map(({ number, icon: Icon, title, description }, index) => (
            <StaggerItem key={number} className="relative flex flex-col items-center text-center lg:px-4">
              {/* Connector line between steps (desktop only) */}
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-8 left-1/2 hidden h-px w-full bg-line lg:block"
                  style={{ left: "50%" }}
                />
              )}

              {/* Step icon circle */}
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-surface shadow-sm shadow-brand/20">
                <Icon className="h-7 w-7 text-brand-fg" />
                {/* Step number badge */}
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand font-heading text-[10px] font-extrabold text-white">
                  {number}
                </span>
              </div>

              {/* Step title and description */}
              <h3 className="font-heading text-base font-bold text-ink">
                {title}
              </h3>
              <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
