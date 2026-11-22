"use client"

import { Users, Store, ShoppingBag, ShieldOff } from "lucide-react"
import type { ManagedUser } from "@/types/user"

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ElementType
}) => (
  <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
      <Icon className="size-5" />
    </div>
    <div>
      <p className="font-text text-xs text-ink-muted">{label}</p>
      <p className="font-heading text-xl font-bold text-ink">{value}</p>
    </div>
  </div>
)

const UserStats = ({ users }: { users: ManagedUser[] }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <StatCard label="Total users" value={users.length} icon={Users} />
    <StatCard label="Vendors" value={users.filter((u) => u.role === "vendor").length} icon={Store} />
    <StatCard label="Customers" value={users.filter((u) => u.role === "customer").length} icon={ShoppingBag} />
    <StatCard label="Restricted" value={users.filter((u) => u.restricted).length} icon={ShieldOff} />
  </div>
)

export default UserStats