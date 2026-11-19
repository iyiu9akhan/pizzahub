"use client"

import React from "react"
import { User, Store, Check } from "lucide-react"
import { UserRole } from "@/types/auth"

export interface RoleSelectProps {
  selectedRole: UserRole
  onChange: (role: UserRole) => void
  className?: string
}

type SignUpRole = Exclude<UserRole, "admin">

interface RoleOption {
  value: SignUpRole
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const ROLES: RoleOption[] = [
  {
    value: "customer",
    title: "Customer",
    description: "Order pizza",
    icon: User,
  },
  {
    value: "vendor",
    title: "Vendor",
    description: "Sell your pizza",
    icon: Store,
  },
]

const RoleSelect: React.FC<RoleSelectProps> = ({
  selectedRole,
  onChange,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <span className="mb-2 block font-heading text-xs font-semibold text-ink sm:text-sm">
        I am a
      </span>

      <div
        role="radiogroup"
        aria-label="Select user role"
        className="grid grid-cols-2 gap-2 sm:gap-3"
      >
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.value
          const Icon = role.icon

          return (
            <label
              key={role.value}
              htmlFor={`role-${role.value}`}
              className={`relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-200 has-focus-visible:ring-2 has-focus-visible:ring-brand/40 sm:gap-3 sm:px-4 sm:py-3 ${
                isSelected
                  ? "border-brand bg-brand-soft shadow-2xs ring-1 ring-brand/30"
                  : "border-line bg-surface hover:border-brand-muted hover:bg-brand-soft/30"
              }`}
            >
              <input
                id={`role-${role.value}`}
                type="radio"
                name="userRole"
                value={role.value}
                checked={isSelected}
                onChange={() => onChange(role.value)}
                className="sr-only"
              />

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:h-10 sm:w-10 ${
                  isSelected
                    ? "bg-brand text-white"
                    : "bg-brand-soft/60 text-brand-fg"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span className="font-heading text-xs font-bold leading-tight text-ink sm:text-sm">
                  {role.title}
                </span>
                <span className="mt-0.5 font-text text-[11px] leading-tight text-ink-muted sm:text-xs">
                  {role.description}
                </span>
              </div>

              {isSelected && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white shadow-sm ring-2 ring-surface">
                  <Check className="h-3 w-3 stroke-3" />
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RoleSelect