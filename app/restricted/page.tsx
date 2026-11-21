"use client"

import React, { useState } from "react"
import { ShieldAlert, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import LoadingButton from "@/components/ui/LoadingButton"
import { toastSuccess } from "@/lib/toast"

export default function RestrictedPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      toastSuccess("Signed out successfully.")
      router.push("/login")
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6 transition-colors duration-300">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-lg sm:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Account Restricted
        </h1>

        <p className="mt-3 font-text text-sm leading-relaxed text-ink-muted">
          Your account has been restricted. Contact support if you believe this was done in error.
        </p>

        <div className="mt-8 w-full border-t border-line pt-6">
          <LoadingButton
            type="button"
            isLoading={isLoggingOut}
            loadingText="Signing out…"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-heading text-sm font-semibold text-white shadow-md shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
