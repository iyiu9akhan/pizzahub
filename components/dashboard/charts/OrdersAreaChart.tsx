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
import { TrendingUp, Calendar } from "lucide-react"

interface DailyStat {
  date: string
  orders: number
  revenue?: number
  spending?: number
}

interface OrdersAreaChartProps {
  data?: DailyStat[]
  title?: string
  description?: string
}

export default function OrdersAreaChart({
  data = [],
  title = "Orders Activity",
  description = "Daily order volume over the last 7 days",
}: OrdersAreaChartProps) {
  const hasData = data && data.length > 0 && data.some((d) => d.orders > 0 || (d.revenue ?? 0) > 0)

  // Format dates for tick display (e.g., "Nov 22")
  const formattedData = data.map((item) => {
    let label = item.date
    try {
      const parts = item.date.split("-")
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
        label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      }
    } catch {
      label = item.date
    }
    return {
      ...item,
      displayDate: label,
    }
  })

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
              <TrendingUp className="h-4 w-4" />
            </span>
            <h3 className="font-heading text-base font-bold text-ink">{title}</h3>
          </div>
          <span className="inline-flex items-center gap-1 font-text text-xs text-ink-muted">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last 7 Days</span>
          </span>
        </div>
        <p className="mt-1 font-text text-xs text-ink-muted">{description}</p>
      </div>

      <div className="mt-6 h-64 w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
            <TrendingUp className="h-8 w-8 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No orders recorded yet
            </p>
            <p className="mt-1 font-text text-xs text-ink-muted">
              Recent order activity will appear here.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
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
                    const row = payload[0].payload as DailyStat & { displayDate: string }
                    return (
                      <div className="rounded-xl border border-line bg-surface p-3 shadow-lg">
                        <p className="font-heading text-xs font-bold text-ink">{row.displayDate}</p>
                        <p className="mt-1 font-text text-xs text-brand-fg">
                          Orders: <strong className="font-bold">{row.orders}</strong>
                        </p>
                        {typeof row.revenue === "number" && row.revenue > 0 && (
                          <p className="font-text text-xs text-emerald-600 dark:text-emerald-400">
                            Revenue: ৳{row.revenue.toLocaleString()}
                          </p>
                        )}
                        {typeof row.spending === "number" && row.spending > 0 && (
                          <p className="font-text text-xs text-emerald-600 dark:text-emerald-400">
                            Spent: ৳{row.spending.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#orderGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
