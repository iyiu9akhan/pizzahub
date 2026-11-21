// Payment Cancel page: /dashboard/vendor/payment-cancel
// Shown when the vendor leaves the Stripe checkout without paying.
import Link from "next/link"
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react"

// Short reassurance points
const NOTES = [
  "You were not charged",
  "Your Free plan is still active",
  "You can upgrade any time",
]

const PaymentCancelPage = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg rounded-3xl border border-line bg-surface px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        {/* Red appears only in this small icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
            <X className="h-6 w-6 stroke-3" />
          </span>
        </div>

        <h1 className="mt-6 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Payment cancelled
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
          Your checkout was cancelled and nothing has changed on your account.
        </p>

        {/* Reassurance list */}
        <ul className="mx-auto mt-8 max-w-xs space-y-3 border-y border-line py-6 text-left">
          {NOTES.map((note) => (
            <li
              key={note}
              className="flex items-center gap-3 font-text text-sm text-ink"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
                <Check className="h-3 w-3 stroke-3" />
              </span>
              {note}
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 font-heading text-sm font-semibold text-ink transition-colors hover:bg-brand-soft/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-heading text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </Link>
        </div>

        <p className="mt-6 text-xs text-ink-muted">
          Premium: $29 one-time payment
        </p>
      </div>
    </div>
  )
}

export default PaymentCancelPage