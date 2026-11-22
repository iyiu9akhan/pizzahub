import React from "react"
import { Loader2, ShieldCheck } from "lucide-react"

export default function PaymentSuccessLoading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-lg sm:p-10">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>

        <h2 className="mt-6 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Verifying Payment...
        </h2>

        <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
          Please wait while we securely confirm your payment with Stripe and activate your Premium subscription benefits.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-brand-soft/50 px-4 py-1.5 font-text text-xs font-medium text-brand-fg">
          <ShieldCheck className="h-4 w-4" />
          <span>Secure Stripe Verification</span>
        </div>
      </div>
    </div>
  )
}
