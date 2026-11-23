// HeroBanner — full-width hero section for the home page.
// Headline, short description, CTA linking to /menu, and a pizza hero image.
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/motion"

export default function HeroBanner() {
  return (
    // Section with decorative ambient glows behind the content
    <section className="relative z-0 w-full -mt-20 overflow-hidden bg-page transition-colors duration-300">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-soft opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-brand-soft opacity-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left column: pizza illustration */}
          <FadeIn duration={0.5} y={12} className="relative order-1 mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
            {/* Decorative circular backdrop */}
            <div
              aria-hidden="true"
              className="absolute inset-[12%] rounded-full bg-brand-soft"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[5%] rounded-full border border-dashed border-brand/30"
            />
            {/* Floating pizza image */}
            <div className="relative aspect-square w-full animate-hero-float motion-reduce:animate-none">
              <Image
                src="/images/pizza/hero-pizza.png"
                alt="Hot and fresh pizza"
                fill
                priority
                unoptimized
                className="scale-105 object-contain drop-shadow-2xl"
              />
            </div>
          </FadeIn>

          {/* Right column: headline, description, CTA */}
          <FadeIn duration={0.5} delay={0.1} y={16} className="order-2 flex flex-col items-center text-center lg:items-start lg:text-left lg:pl-6 xl:pl-10">
            {/* Eyebrow label */}
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 font-text text-xs font-semibold uppercase tracking-widest text-ink-muted">
              <span aria-hidden="true">🍕</span> Fresh &amp; Local
            </span>

            {/* Main headline */}
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl xl:text-6xl">
              Hot &amp; Fresh Pizza{" "}
              <span className="text-brand-fg">Delivered</span> to Your Door
            </h1>

            {/* Supporting description */}
            <p className="mt-5 max-w-md font-text text-base leading-relaxed text-ink-muted xl:text-lg">
              Handcrafted with premium ingredients by local pizza shops. Order
              in minutes and enjoy a hot slice at your doorstep.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/menu"
                className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-brand px-7 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95"
              >
                Explore Pizza Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
