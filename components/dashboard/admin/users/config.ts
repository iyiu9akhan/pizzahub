import type { UserRole } from "@/types/user"

export const PAGE_SIZE = 8

export type RoleFilter = UserRole | "all"

export const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: "All", value: "all" },
  { label: "Vendors", value: "vendor" },
  { label: "Customers", value: "customer" },
  { label: "Admins", value: "admin" },
]

export const STATUS_FILTERS = [
  { label: "Any status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Restricted", value: "restricted" },
] as const

export type StatusFilter = (typeof STATUS_FILTERS)[number]["value"]

export const ROLES: UserRole[] = ["customer", "vendor", "admin"]

export const ROLE_STYLE: Record<UserRole, string> = {
  admin: "bg-purple-500/10 text-purple-600",
  vendor: "bg-brand-soft text-brand",
  customer: "bg-blue-500/10 text-blue-600",
}