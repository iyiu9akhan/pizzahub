"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import UserAvatar from "@/components/ui/UserAvatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ManagedUser, UserRole } from "@/types/user"
import { ROLES, ROLE_STYLE } from "./config"

type Props = {
  rows: ManagedUser[]
  total: number
  page: number
  totalPages: number
  onPage: (p: number) => void
  onToggleRestrict: (user: ManagedUser, restricted: boolean) => void
  onChangeRole: (user: ManagedUser, role: UserRole) => void
}

// Shared padding: first/last cell e extra space (corner fix)
const pad = "px-4 first:pl-5 last:pr-5"
const head = `h-11 font-heading text-xs text-ink-muted ${pad}`
const cell = `py-3 ${pad}`

const UserCell = ({ user }: { user: ManagedUser }) => (
  <div className="flex items-center gap-3">
    <UserAvatar
      image={user.image}
      role={user.role}
      name={user.name}
      size="sm"
    />
    <div className="min-w-0">
      <p className="truncate font-heading text-sm font-semibold text-ink">
        {user.name}
      </p>
      <p className="truncate font-text text-xs text-ink-muted">{user.email}</p>
    </div>
  </div>
)

const UsersTable = ({
  rows,
  total,
  page,
  totalPages,
  onPage,
  onToggleRestrict,
  onChangeRole,
}: Props) => (
  <div className="overflow-hidden rounded-2xl border border-line bg-surface">
    {/* Scroll thakbe (mobile), kintu scrollbar hide */}
    <div className="**:data-[slot=table-container]:scrollbar-none [&_[data-slot=table-container]::-webkit-scrollbar]:hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-line bg-brand-soft/40 hover:bg-brand-soft/40">
            <TableHead className={head}>User</TableHead>
            <TableHead className={head}>Role</TableHead>
            <TableHead className={head}>Status</TableHead>
            <TableHead className={`${head} hidden md:table-cell`}>
              Joined
            </TableHead>
            <TableHead className={`${head} text-right`}>Restrict</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center font-text text-sm text-ink-muted"
              >
                No users match your filters.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((user) => (
              <TableRow key={user.id} className="border-line">
                <TableCell className={cell}>
                  <UserCell user={user} />
                </TableCell>

                {/* Role: fixed width badge + fixed width select (aligned) */}
                <TableCell className={cell}>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`w-20 justify-center capitalize ${ROLE_STYLE[user.role]}`}
                    >
                      {user.role}
                    </Badge>
                    <select
                      value={user.role}
                      disabled={user.role === "admin"}
                      onChange={(e) =>
                        onChangeRole(user, e.target.value as UserRole)
                      }
                      aria-label={`Change role of ${user.name}`}
                      className="h-8 w-28 rounded-lg border border-line bg-surface px-2 font-text text-xs text-ink capitalize disabled:opacity-40"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </TableCell>

                <TableCell className={cell}>
                  <Badge
                    variant="secondary"
                    className={
                      user.restricted
                        ? "bg-red-500/10 text-red-600"
                        : "bg-green-500/10 text-green-600"
                    }
                  >
                    {user.restricted ? "Restricted" : "Active"}
                  </Badge>
                </TableCell>

                <TableCell
                  className={`${cell} hidden font-text text-sm text-ink-muted md:table-cell`}
                >
                  {user.joinedAt}
                </TableCell>

                <TableCell className={`${cell} text-right`}>
                  <Switch
                    className="cursor-pointer"
                    checked={user.restricted}
                    disabled={user.role === "admin"}
                    onCheckedChange={(v) => onToggleRestrict(user, v)}
                    aria-label={`Restrict ${user.name}`}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    <div className="flex items-center justify-between border-t border-line px-5 py-3">
      <p className="font-text text-xs text-ink-muted">
        Showing {rows.length} of {total} users
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          className="rounded-lg bg-brand px-3 py-1.5 font-text text-xs font-medium text-white transition hover:bg-brand/90 disabled:pointer-events-none disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-text text-xs text-ink-muted">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded-lg bg-brand px-3 py-1.5 font-text text-xs font-medium text-white transition hover:bg-brand/90 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)

export default UsersTable
