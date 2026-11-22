import React from "react"
import Link from "next/link"
import { FileQuestion, LayoutDashboard } from "lucide-react"

export const metadata = {
  title: "Record Not Found | PizzaHub Dashboard",
  description: "The requested dashboard resource was not found.",
}

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-md sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <FileQuestion className="h-8 w-8" />
        </div>

        <h2 className="mt-5 font-heading text-2xl font-bold tracking-tight text-ink">
          Record Not Found
        </h2>

        <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
          The requested dashboard record, menu item, or order could not be located in our database.
        </p>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
