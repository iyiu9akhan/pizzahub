// MenuHero — small page header for the Browse Menu page.
// Displays page title and concise introductory text matching the Home page typography.
import React from "react"

export default function MenuHero() {
  return (
    <div className="text-center pt-6 pb-8 sm:pt-8 sm:pb-10">
      {/* Eyebrow badge */}
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 font-text text-xs font-semibold uppercase tracking-widest text-ink-muted">
        <span aria-hidden="true">🍕</span> Freshly Baked
      </span>

      {/* Main heading */}
      <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        Explore Our <span className="text-brand-fg">Menu</span>
      </h1>

      {/* Supporting text */}
      <p className="mt-3 max-w-xl mx-auto font-text text-sm sm:text-base leading-relaxed text-ink-muted">
        Discover handcrafted artisan pizzas, savoury sides, and desserts from top local kitchens near you.
      </p>
    </div>
  )
}
