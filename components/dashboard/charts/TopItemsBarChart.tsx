"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Award } from "lucide-react"

interface TopItem {
  name: string
  sold: number
}

interface TopItemsBarChartProps {
  data?: TopItem[]
  title?: string
  description?: string
}

export default function TopItemsBarChart({
  data = [],
  title = "Top Selling Items",
  description = "Best-selling menu items by units sold",
}: TopItemsBarChartProps) {
  const hasData = data && data.length > 0 && data.some((i) => i.sold > 0)

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Award className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-base font-bold text-ink">{title}</h3>
        </div>
        <p className="mt-1 font-text text-xs text-ink-muted">{description}</p>
      </div>

      <div className="mt-6 h-64 w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
            <Award className="h-8 w-8 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No sales data yet
            </p>
            <p className="mt-1 font-text text-xs text-ink-muted">
              Top selling items will show once orders are placed.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.slice(0, 5)}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-line/50" horizontal={false} />
              <XAxis
                type="number"
                stroke="currentColor"
                className="text-[11px] text-ink-muted"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="currentColor"
                className="text-[11px] text-ink"
                tickLine={false}
                axisLine={false}
                width={100}
                tickFormatter={(val: string) =>
                  val.length > 14 ? `${val.slice(0, 12)}…` : val
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as TopItem
                    return (
                      <div className="rounded-xl border border-line bg-surface p-2.5 shadow-lg">
                        <p className="font-heading text-xs font-bold text-ink">{row.name}</p>
                        <p className="mt-0.5 font-text text-xs text-brand-fg">
                          Units Sold: <strong className="font-bold">{row.sold}</strong>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="sold" fill="#e11d48" radius={[0, 8, 8, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
