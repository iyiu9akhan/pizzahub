import React from "react"
import Link from "next/link"
import { ShieldAlert, Home, LayoutDashboard, LogIn } from "lucide-react"
import { getSession } from "@/lib/core/server"

export const metadata = {
  title: "403 - Access Denied | PizzaHub",
  description: "You do not have permission to access this page.",
}

export default async function UnauthorizedPage() {
  const session = await getSession()
  const role = session?.user?.role

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : role === "customer"
          ? "/dashboard/customer"
          : "/login"
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6 transition-colors duration-300">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-lg sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="mt-6 font-heading text-xs font-bold tracking-widest text-amber-600 uppercase dark:text-amber-400">
          403 Forbidden
        </span>

        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Access Denied
        </h1>

        <p className="mt-3 font-text text-sm leading-relaxed text-ink-muted">
          You don&apos;t have the required role or permissions to view this
          section of the platform.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Link
            href={dashboardPath}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Go to My Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface font-heading text-xs font-semibold text-ink shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <Home className="h-3.5 w-3.5 text-ink-muted" />
              <span>Home</span>
            </Link>

            <Link
              href="/login"
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-surface font-heading text-xs font-semibold text-ink shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <LogIn className="h-3.5 w-3.5 text-ink-muted" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
