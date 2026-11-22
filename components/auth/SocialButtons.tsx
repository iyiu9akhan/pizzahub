// Google sign-in button — calls Better Auth signIn.social and shows toast.
"use client"

import React, { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toastError } from "@/lib/toast"
import LoadingButton from "@/components/ui/LoadingButton"

export interface SocialButtonsProps {
  label?: string
  className?: string
  role?: "customer" | "vendor"
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  label = "Continue with Google",
  className = "",
  role,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  // Trigger Better Auth Google OAuth flow
  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    if (role) {
      document.cookie = `pizzahub_signup_role=${role === "vendor" ? "vendor" : "customer"}; path=/; max-age=600; SameSite=Lax`
    }

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      })

      if (error) {
        toastError("Google sign-in failed", error.message || "Please try again.")
        setIsLoading(false)
      }
    } catch {
      toastError("Google sign-in failed", "Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <LoadingButton
        type="button"
        isLoading={isLoading}
        loadingText="Connecting…"
        onClick={handleGoogleSignIn}
        aria-label={label}
        className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 font-heading text-sm font-semibold text-ink shadow-2xs transition-all duration-300 hover:border-brand hover:bg-brand-soft/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-[0.99] cursor-pointer"
      >
        {/* Google logo — only shown when not loading */}
        {!isLoading && (
          <svg
            className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.4 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.3 7.5 23 12 23z"
            />
          </svg>
        )}
        <span>{label}</span>
      </LoadingButton>
    </div>
  )
}

export default SocialButtons
