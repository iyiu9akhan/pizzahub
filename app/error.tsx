"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log unexpected runtime errors
    console.error("Runtime application error caught by app/error.tsx:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6 transition-colors duration-300">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-lg sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
          We encountered an unexpected error while processing your request. Please try again.
        </p>

        {error.digest && (
          <p className="mt-3 rounded-lg bg-brand-soft/50 px-3 py-1 font-mono text-[11px] text-ink-muted">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 font-heading text-sm font-semibold text-ink shadow-2xs transition-all hover:-translate-y-0.5 hover:border-brand/50 active:scale-95"
          >
            <Home className="h-4 w-4 text-ink-muted" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
