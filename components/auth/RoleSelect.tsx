"use client"

import React from "react"
import { User, Store, ShieldCheck, Check } from "lucide-react"
import { UserRole } from "@/types/auth"

export interface RoleSelectProps {
  selectedRole: UserRole
  onChange: (role: UserRole) => void
  className?: string
}

interface RoleOption {
  value: UserRole
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
  {
    value: "admin",
    title: "Admin",
    description: "Manage platform",
    icon: ShieldCheck,
  },
]

const RoleSelect: React.FC<RoleSelectProps> = ({
  selectedRole,
  onChange,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <span className="block font-heading text-xs sm:text-sm font-semibold text-ink mb-2">
        I am a
      </span>
      <div
        role="radiogroup"
        aria-label="Select user role"
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.value
          const Icon = role.icon

          return (
            <label
              key={role.value}
              htmlFor={`role-${role.value}`}
              className={`relative flex flex-col items-center justify-between rounded-xl border p-2 sm:p-3 text-center transition-all duration-200 cursor-pointer select-none has-focus-visible:ring-2 has-focus-visible:ring-brand/40 ${
                isSelected
                  ? "border-brand bg-brand-soft ring-1 ring-brand/30 shadow-2xs"
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

              {/* Top Row: Icon + Checkmark badge if selected */}
              <div className="flex w-full items-start justify-between">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-brand-soft/60 text-brand-fg"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isSelected ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="h-4 w-4" />
                )}
              </div>

              {/* Title & Tiny description */}
              <div className="mt-2 w-full text-left">
                <span className="block font-heading text-xs font-bold text-ink leading-tight">
                  {role.title}
                </span>
                <span className="block font-text text-[10px] text-ink-muted leading-tight mt-0.5 truncate">
                  {role.description}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RoleSelect
