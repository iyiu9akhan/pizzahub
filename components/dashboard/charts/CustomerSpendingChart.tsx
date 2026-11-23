"use client"

import React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Wallet, Calendar } from "lucide-react"

interface DailySpending {
  date: string
  orders: number
  revenue?: number
  spending?: number
}

interface CustomerSpendingChartProps {
  data?: DailySpending[]
}

export default function CustomerSpendingChart({ data = [] }: CustomerSpendingChartProps) {
  const hasData =
    data &&
    data.length > 0 &&
    data.some((d) => (d.spending ?? d.revenue ?? 0) > 0 || d.orders > 0)

  const formattedData = data.map((item) => {
    let label = item.date
    try {
      const parts = item.date.split("-")
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
        label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
    } catch {
      label = item.date
    }
    return {
      ...item,
      amount: item.spending ?? item.revenue ?? 0,
      displayDate: label,
    }
  })

  return (
    <div className="flex h-full min-w-0 flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Wallet className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-base font-bold text-ink">
              Spending & Orders per Day
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 font-text text-xs text-ink-muted">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last 7 Days</span>
          </span>
        </div>
        <p className="mt-1 font-text text-xs text-ink-muted">
          Your daily pizza orders and expenditure
        </p>
      </div>

      <div className="mt-6 h-64 w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
            <Wallet className="h-8 w-8 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No orders placed in this period
            </p>
            <p className="mt-1 font-text text-xs text-ink-muted">
              Order history and spending will show here after you place an order.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256} initialDimension={{ width: 320, height: 256 }}>
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-line/50" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="currentColor"
                className="text-[11px] text-ink-muted"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-[11px] text-ink-muted"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as DailySpending & {
                      displayDate: string
                      amount: number
                    }
                    return (
                      <div className="rounded-xl border border-line bg-surface p-3 shadow-lg">
                        <p className="font-heading text-xs font-bold text-ink">{row.displayDate}</p>
                        <p className="mt-1 font-text text-xs text-emerald-600 dark:text-emerald-400">
                          Spent: ${row.amount.toLocaleString("en-US")}
                        </p>
                        <p className="font-text text-xs text-ink-muted">
                          Orders: <strong className="font-bold text-ink">{row.orders}</strong>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendingGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
