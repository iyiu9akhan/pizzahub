"use client"

import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"
import { updateUserRole, setUserRestricted } from "@/lib/actions/UserActions"
import type { ManagedUser, UserRole } from "@/types/user"
import UserStats from "./UserStats"
import UsersToolbar from "./UsersToolbar"
import UsersTable from "./UsersTable"
import { useUserFilters } from "./useUserFilters"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import LoadingButton from "@/components/ui/LoadingButton"

const ManageUsers = ({ users: initialUsers }: { users: ManagedUser[] }) => {
  const [users, setUsers] = useState(initialUsers)
  const [restrictingUser, setRestrictingUser] = useState<ManagedUser | null>(null)
  const [restrictReason, setRestrictReason] = useState("")
  const [isSubmittingRestrict, setIsSubmittingRestrict] = useState(false)

  const f = useUserFilters(users)

  const handleToggleRestrict = async (user: ManagedUser, restricted: boolean) => {
    if (restricted) {
      // Prompt for optional reason via dialog
      setRestrictingUser(user)
      setRestrictReason("")
    } else {
      // Unrestrict immediately with optimistic update + revert on error
      const previous = user.restricted
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, restricted: false } : u))
      )
      const res = await setUserRestricted(user.id, false)
      if (res.success) {
        toastSuccess(`${user.email} unrestricted`)
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, restricted: previous } : u))
        )
        toastError(res.message || "Failed to unrestrict user")
      }
    }
  }

  const handleConfirmRestrict = async () => {
    if (!restrictingUser) return
    const user = restrictingUser
    setIsSubmittingRestrict(true)

    // Optimistic update
    const previous = user.restricted
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, restricted: true } : u))
    )

    try {
      const res = await setUserRestricted(
        user.id,
        true,
        restrictReason.trim() || undefined
      )
      if (res.success) {
        toastSuccess(`${user.email} restricted`)
        setRestrictingUser(null)
      } else {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, restricted: previous } : u))
        )
        toastError(res.message || "Failed to restrict user")
      }
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, restricted: previous } : u))
      )
      toastError("Failed to restrict user")
    } finally {
      setIsSubmittingRestrict(false)
    }
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

      {/* Restrict Confirmation Dialog */}
      <AlertDialog
        open={Boolean(restrictingUser)}
        onOpenChange={(open) => {
          if (!isSubmittingRestrict && !open) setRestrictingUser(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restrict User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restrict{" "}
              <span className="font-semibold text-ink">
                {restrictingUser?.email}
              </span>
              ? They will be unable to sign in or perform actions until unrestricted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-2">
            <label
              htmlFor="restrict-reason"
              className="mb-1 block font-heading text-xs font-semibold text-ink"
            >
              Reason (optional)
            </label>
            <input
              id="restrict-reason"
              type="text"
              placeholder="e.g. Terms violation, spam activity"
              value={restrictReason}
              onChange={(e) => setRestrictReason(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmittingRestrict}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              type="button"
              isLoading={isSubmittingRestrict}
              loadingText="Restricting…"
              onClick={handleConfirmRestrict}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-red-600 px-5 font-heading text-sm font-semibold text-white hover:bg-red-700"
            >
              Restrict
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ManageUsers
