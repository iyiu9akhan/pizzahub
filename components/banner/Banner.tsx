import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star, Clock, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/currency"

export interface BannerProps {
  className?: string
}

const STATS = [
  { value: "30 min", label: "Avg. delivery" },
  { value: "50+", label: "Pizza varieties" },
  { value: "4.9", label: "Customer rating" },
]

const Banner: React.FC<BannerProps> = ({ className = "" }) => {
  return (
    <section
      className={`relative z-0 w-full -mt-20 overflow-x-clip bg-page transition-colors duration-300 ${className}`}
    >
      {/* Soft decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-130 w-130 rounded-full bg-brand-soft opacity-70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 h-105 w-105 rounded-full bg-brand-soft opacity-50 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-12">
          {/* ───────── LEFT: Pizza visual ───────── */}
          <div className="relative order-1 mx-auto w-full max-w-105 sm:max-w-120 lg:max-w-130">
            {/* Big circle backdrop */}
            <div
              aria-hidden="true"
              className="absolute inset-[14%] rounded-full bg-brand-soft"
            />
            {/* Thin outline ring */}
            <div
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full border border-dashed border-brand/30"
            />

            {/* Pizza: float on wrapper */}
            <div className="relative aspect-square w-full animate-hero-float motion-reduce:animate-none">
              <Image
                src="/images/pizza/hero-pizza.png"
                alt="Freshly baked artisan pizza"
                fill
                priority
                unoptimized
                className="scale-[1.05] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Badge: rating */}
            <div className="absolute left-0 top-[14%] flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-xl sm:left-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                <Star className="h-4 w-4 fill-current" />
              </span>
              <div className="leading-tight">
                <p className="font-heading text-sm font-extrabold text-ink">4.9 Rating</p>
                <p className="font-text text-[11px] text-ink-muted">2k+ happy reviews</p>
              </div>
            </div>

            {/* Badge: delivery */}
            <div className="absolute bottom-[10%] right-0 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3.5 py-2.5 shadow-xl sm:right-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                <Clock className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="font-heading text-sm font-extrabold text-ink">Fast Delivery</p>
                <p className="font-text text-[11px] text-ink-muted">Hot in 30 minutes</p>
              </div>
            </div>
          </div>

          {/* ───────── RIGHT: Content ───────── */}
          <div className="order-2 flex flex-col items-center text-center lg:items-start lg:text-left lg:pl-6 xl:pl-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 font-text text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              <span aria-hidden="true">🍕</span> Today&apos;s Special
            </span>

            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl xl:text-6xl">
              Cheesy
              <br />
              <span className="text-brand-fg">Margherita</span>
            </h1>

            <p className="mt-5 max-w-md font-text text-base leading-relaxed text-ink-muted xl:text-lg">
              Hand-stretched dough, rich tomato sauce, melted mozzarella and
              fresh basil — baked to perfection, delivered hot to your door.
            </p>

            {/* Price + CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex flex-col items-start">
                <span className="font-heading text-4xl font-extrabold leading-none text-brand-fg xl:text-5xl">
                  {formatPrice(599)}
                </span>
                <span className="mt-1.5 font-text text-xs tracking-wide text-ink-muted">
                  total payable
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="#order"
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-brand px-7 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order now</span>
                </Link>

                <Link
                  href="#menu"
                  className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 font-heading text-base font-semibold text-ink transition-all duration-300 hover:border-brand hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95"
                >
                  <span>View menu</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <dl className="mt-10 grid w-full max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col lg:items-start">
                  <dt className="order-2 font-text text-xs text-ink-muted">{s.label}</dt>
                  <dd className="order-1 font-heading text-xl font-extrabold text-ink xl:text-2xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner