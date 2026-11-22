import React from "react"
import Link from "next/link"
import { Pizza, Home, LayoutDashboard } from "lucide-react"

export const metadata = {
  title: "404 - Page Not Found | PizzaHub",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6 transition-colors duration-300">
      <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-lg sm:p-12">
        {/* Animated Icon Container */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-soft text-brand-fg shadow-inner">
          <Pizza className="h-10 w-10 animate-bounce" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand font-heading text-xs font-bold text-white shadow-xs">
            ?
          </span>
        </div>

        <span className="mt-6 font-heading text-sm font-extrabold uppercase tracking-widest text-brand-fg">
          404 Error
        </span>

        <h1 className="mt-1 font-heading text-3xl font-black tracking-tight text-ink sm:text-4xl">
          Page Not Found
        </h1>

        <p className="mt-3 max-w-sm font-text text-sm leading-relaxed text-ink-muted">
          The pizza, slice, or page you were looking for was either devoured, moved to a different oven, or never baked.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 font-heading text-sm font-semibold text-ink shadow-2xs transition-all hover:-translate-y-0.5 hover:border-brand/50 active:scale-95"
          >
            <LayoutDashboard className="h-4 w-4 text-ink-muted" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
