"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error caught by app/dashboard/error.tsx:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-md sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-ink">
          Dashboard Error
        </h2>

        <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
          We encountered an issue loading this section of the dashboard. Please try again.
        </p>

        {error.digest && (
          <p className="mt-2 rounded-lg bg-brand-soft/40 px-3 py-1 font-mono text-[11px] text-ink-muted">
            Code: {error.digest}
          </p>
        )}

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 font-heading text-xs font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-5 font-heading text-xs font-semibold text-ink shadow-2xs transition-all hover:-translate-y-0.5 hover:border-brand/50 active:scale-95"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-ink-muted" />
            <span>Dashboard Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
