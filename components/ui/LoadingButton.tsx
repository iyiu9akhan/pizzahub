"use client"

import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
}

// Drop-in replacement for <button> that handles loading state
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      isLoading = false,
      loadingText,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {/* Spinner shown only while loading */}
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  )
)
LoadingButton.displayName = "LoadingButton"

export default LoadingButton
