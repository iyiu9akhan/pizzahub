"use client"

import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"
import { updateUserRole } from "@/lib/actions/UserActions"
import type { ManagedUser, UserRole } from "@/types/user"
import UserStats from "./UserStats"
import UsersToolbar from "./UsersToolbar"
import UsersTable from "./UsersTable"
import { useUserFilters } from "./useUserFilters"

const ManageUsers = ({ users: initialUsers }: { users: ManagedUser[] }) => {
  const [users, setUsers] = useState(initialUsers)
  const f = useUserFilters(users)

  // =====================================================================
  // TODO (RESTRICT, pore korbo):
  //   1. In `lib/actions/UserActions.ts` add setUserRestricted(userId, restricted)
  //      -> Better Auth banUser / unbanUser (check admin role on the server).
  //   2. Call it in handleToggleRestrict below inside try/catch.
  //      On failure: revert local state + toastError.
  //   3. After success: revalidatePath("/dashboard/admin/users") in the action
  //      and sync `users` state with the new server props.
  //   Right now restrict updates LOCAL STATE ONLY (resets on page refresh).
  // =====================================================================

  const handleToggleRestrict = (user: ManagedUser, restricted: boolean) => {
    // TODO: await setUserRestricted(user.id, restricted)
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, restricted } : u)))
    toastSuccess(`${user.email} ${restricted ? "restricted" : "unrestricted"}`)
  }

  // Role: server action -> backend (optimistic update, fail hole revert)
  const handleChangeRole = async (user: ManagedUser, role: UserRole) => {
    const previous = user.role
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)))

    const res = await updateUserRole(user.id, role)
    if (res.success) {
      toastSuccess(`${user.email} is now ${role}`)
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: previous } : u))
      )
      toastError(res.message || "Failed to update role")
    }
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">Manage Users</h1>
        <p className="font-text text-sm text-ink-muted">
          View, search and control access for every account.
        </p>
      </div>

      <UserStats users={users} />

      <UsersToolbar
        search={f.search}
        role={f.role}
        status={f.status}
        onSearch={f.setSearch}
        onRole={f.setRole}
        onStatus={f.setStatus}
      />

      <UsersTable
        rows={f.rows}
        total={f.total}
        page={f.page}
        totalPages={f.totalPages}
        onPage={f.setPage}
        onToggleRestrict={handleToggleRestrict}
        onChangeRole={handleChangeRole}
      />
    </div>
  )
}

export default ManageUsers