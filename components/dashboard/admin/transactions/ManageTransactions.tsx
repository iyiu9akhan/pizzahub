"use client"

import React, { useState, useMemo } from "react"
import { Search, CreditCard, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { TransactionRow } from "@/lib/api/admin"

interface ManageTransactionsProps {
  transactions: TransactionRow[]
}

const PAGE_SIZE = 10

// Hydration safe UTC date formatter
const formatUtcDate = (dateStr?: string) => {
  if (!dateStr) return "—"
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export default function ManageTransactions({
  transactions,
}: ManageTransactionsProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.toLowerCase()
      return (
        (t.customer_email?.toLowerCase() || "").includes(q) ||
        (t.sessionId?.toLowerCase() || "").includes(q) ||
        (t.payment_status?.toLowerCase() || "").includes(q)
      )
    })
  }, [transactions, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const pad = "px-4 first:pl-5 last:pr-5"
  const head = `h-11 font-heading text-xs text-ink-muted ${pad}`
  const cell = `py-3.5 ${pad}`

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          Transactions
        </h1>
        <p className="mt-1 font-text text-sm text-ink-muted">
          Review Stripe checkout sessions and payment records.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search email, session ID, status…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3.5 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
          />
        </div>

        <span className="font-text text-xs text-ink-muted">
          Total transactions: <strong className="font-heading text-ink">{transactions.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left">
            <thead>
              <tr className="border-b border-line bg-brand-soft/40">
                <th className={head}>Customer</th>
                <th className={head}>Amount</th>
                <th className={head}>Status</th>
                <th className={head}>Session ID</th>
                <th className={`${head} text-right`}>Created (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center font-text text-sm text-ink-muted"
                  >
                    No transactions match your search.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const displayAmount = (row.amount > 100 && Number.isInteger(row.amount))
                    ? (row.amount / 100).toFixed(2)
                    : Number(row.amount).toFixed(2)
                  const currencySymbol = (row.currency || "USD").toUpperCase() === "USD" ? "$" : `${row.currency?.toUpperCase()} `

                  const isPaid =
                    row.payment_status === "paid" || row.payment_status === "complete"

                  return (
                    <tr
                      key={row.sessionId || row._id || row.id || idx}
                      className="border-line transition-colors hover:bg-muted/30"
                    >
                      <td className={cell}>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                            <CreditCard className="h-4 w-4" />
                          </span>
                          <span className="font-heading text-sm font-semibold text-ink">
                            {row.customer_email || "Customer"}
                          </span>
                        </div>
                      </td>

                      <td className={`${cell} font-heading text-sm font-bold text-ink`}>
                        {currencySymbol}{displayAmount}
                      </td>

                      <td className={cell}>
                        <Badge
                          variant="secondary"
                          className={`flex w-fit items-center gap-1 rounded-full text-xs font-semibold capitalize ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          <span>{row.payment_status || "Pending"}</span>
                        </Badge>
                      </td>

                      <td className={`${cell} font-mono text-xs text-ink-muted`}>
                        <span className="max-w-[200px] truncate block" title={row.sessionId}>
                          {row.sessionId ? `${row.sessionId.slice(0, 18)}…` : "—"}
                        </span>
                      </td>

                      <td className={`${cell} text-right font-text text-xs text-ink-muted`}>
                        {formatUtcDate(row.createdAt)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-line px-5 py-3">
          <p className="font-text text-xs text-ink-muted">
            Showing {rows.length} of {filtered.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-line px-3 py-1.5 font-text text-xs text-ink disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-text text-xs text-ink-muted">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-line px-3 py-1.5 font-text text-xs text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
