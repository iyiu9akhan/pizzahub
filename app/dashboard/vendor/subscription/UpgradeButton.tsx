"use client"

import { useState } from "react"
import { Crown, Loader2 } from "lucide-react"
import { toastError } from "@/lib/toast"

const UpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Create a Stripe checkout session, then go to the Stripe page
  const handleClick = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      console.log("checkout response:", res.status, data) // debug
      if (!res.ok || !data.url) {
        throw new Error(data.message || `Request failed (${res.status})`)
      }
      window.location.href = data.url
    } catch (err) {
      toastError(
        "Could not start checkout",
        err instanceof Error ? err.message : "Please try again."
      )
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-heading text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
      {isLoading ? "Redirecting to checkout..." : "Upgrade to Premium"}
    </button>
  )
}

export default UpgradeButton
