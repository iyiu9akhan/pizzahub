"use client"

import React, { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global critical error caught by app/global-error.tsx:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Application Error
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            A critical error occurred while rendering the page. Please try refreshing or restarting the application.
          </p>

          {error.digest && (
            <p className="mt-3 rounded-lg bg-zinc-100 px-3 py-1 font-mono text-[11px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Digest: {error.digest}
            </p>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
