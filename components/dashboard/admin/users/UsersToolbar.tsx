"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ROLE_FILTERS, STATUS_FILTERS, type RoleFilter, type StatusFilter } from "./config"

type Props = {
  search: string
  role: RoleFilter
  status: StatusFilter
  onSearch: (v: string) => void
  onRole: (v: RoleFilter) => void
  onStatus: (v: StatusFilter) => void
}

const UsersToolbar = ({ search, role, status, onSearch, onRole, onStatus }: Props) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 lg:flex-row lg:items-center lg:justify-between">
    <div className="relative w-full lg:max-w-sm">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name or email"
        className="pl-9"
      />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      {ROLE_FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onRole(f.value)}
          className={`rounded-full px-3 py-1.5 font-text text-xs font-semibold transition-colors ${
            role === f.value
              ? "bg-brand text-white"
              : "bg-brand-soft text-ink-muted hover:text-ink"
          }`}
        >
          {f.label}
        </button>
      ))}

      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as StatusFilter)}
        className="rounded-lg border border-line bg-surface px-3 py-1.5 font-text text-xs text-ink"
      >
        {STATUS_FILTERS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  </div>
)

export default UsersToolbar