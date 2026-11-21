"use client"

import { useMemo, useState } from "react"
import type { ManagedUser } from "@/types/user"
import { PAGE_SIZE, type RoleFilter, type StatusFilter } from "./config"

export function useUserFilters(users: ManagedUser[]) {
  const [search, setSearchState] = useState("")
  const [role, setRoleState] = useState<RoleFilter>("all")
  const [status, setStatusState] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchSearch =
        !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = role === "all" || u.role === role
      const matchStatus =
        status === "all" || (status === "restricted" ? u.restricted : !u.restricted)
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, role, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  // filter bodlale page 1 e jabe
  const withReset =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v)
      setPage(1)
    }

  return {
    search,
    role,
    status,
    rows,
    total: filtered.length,
    page: current,
    totalPages,
    setSearch: withReset(setSearchState),
    setRole: withReset(setRoleState),
    setStatus: withReset(setStatusState),
    setPage,
  }
}