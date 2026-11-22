"use client"

import React from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Users } from "lucide-react"

interface UsersByRoleDonutChartProps {
  data?: Record<string, number>
}

const ROLE_COLORS: Record<string, string> = {
  customer: "#3b82f6", // Blue
  vendor: "#f59e0b", // Amber
  admin: "#e11d48", // Rose
}

export default function UsersByRoleDonutChart({ data = {} }: UsersByRoleDonutChartProps) {
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1),
      rawRole: role,
      value: count,
      color: ROLE_COLORS[role] || "#94a3b8",
    }))

  const totalUsers = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex h-full min-w-0 flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </span>
          <h3 className="font-heading text-base font-bold text-ink">Users by Role</h3>
        </div>
        <p className="mt-1 font-text text-xs text-ink-muted">
          Platform accounts breakdown across roles
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center sm:flex-row gap-6">
        {totalUsers === 0 ? (
          <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
            <Users className="h-8 w-8 text-ink-muted/40" />
            <p className="mt-2 font-heading text-sm font-semibold text-ink">
              No registered users
            </p>
          </div>
        ) : (
          <>
            <div className="relative h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224}>
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload
                        return (
                          <div className="rounded-xl border border-line bg-surface p-2.5 shadow-lg">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <p className="font-heading text-xs font-bold text-ink">
                                {item.name}: {item.value} users
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-heading text-xl font-black text-ink">{totalUsers}</span>
                <span className="font-text text-[10px] uppercase tracking-wider text-ink-muted">
                  Users
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-col sm:gap-2">
              {chartData.map((item) => (
                <div key={item.rawRole} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-text text-xs text-ink-muted">{item.name}</span>
                  <span className="ml-auto font-heading text-xs font-bold text-ink">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
