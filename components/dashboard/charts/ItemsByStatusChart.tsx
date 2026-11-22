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
  Cell,
} from "recharts"
import { Package } from "lucide-react"

interface ItemsByStatusChartProps {
  data?: Record<string, number>
}

const STATUS_COLORS: Record<string, string> = {
  approved: "#10b981", // Emerald
  pending: "#f59e0b", // Amber
  rejected: "#ef4444", // Red
}

export default function ItemsByStatusChart({ data = {} }: ItemsByStatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    rawStatus: status,
    count,
    color: STATUS_COLORS[status] || "#94a3b8",
  }))

  const hasData = chartData.some((d) => d.count > 0)

  return (
    <div className="flex h-full min-w-0 flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Package className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-base font-bold text-ink">Items by Approval</h3>
        </div>
        <p className="mt-1 font-text text-xs text-ink-muted">
          Current status of all submitted menu items
        </p>
      </div>

      <div className="mt-6 h-64 w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
            <Package className="h-8 w-8 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No menu items recorded
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256}>
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-line/50" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="currentColor"
                className="text-[11px] text-ink"
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
                    const row = payload[0].payload as { name: string; count: number }
                    return (
                      <div className="rounded-xl border border-line bg-surface p-2.5 shadow-lg">
                        <p className="font-heading text-xs font-bold text-ink">{row.name}</p>
                        <p className="mt-0.5 font-text text-xs text-brand-fg">
                          Items: <strong className="font-bold">{row.count}</strong>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={36}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
