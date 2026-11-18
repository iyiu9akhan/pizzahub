"use client"

import React from "react"
import { Check } from "lucide-react"

export interface CheckboxProps {
  id: string
  label: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  required?: boolean
  disabled?: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  className = "",
  required = false,
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="h-5 w-5 rounded-md border-2 border-brand bg-surface transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 peer-checked:bg-brand peer-checked:border-brand flex items-center justify-center shadow-2xs group-hover:border-brand-dark cursor-pointer">
          <Check
            className={`h-3.5 w-3.5 stroke-[3] text-white transition-opacity duration-150 ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
      <span className="font-text text-xs sm:text-sm text-ink-muted leading-tight group-hover:text-ink transition-colors cursor-pointer">
        {label}
      </span>
    </label>
  )
}

export default Checkbox
