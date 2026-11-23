// Payment Success page: /dashboard/vendor/payment-success
// Verifies the Stripe session server-side. Premium is activated by the webhook only.
export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"
import SuccessContent from "./SuccessContent"

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) => {
  const { session_id } = await searchParams

  if (!session_id) redirect("/dashboard/vendor/subscription")

  const userSession = await getSession()
  if (!userSession?.user) redirect("/login")

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id)
  } catch {
    redirect("/dashboard/vendor/subscription")
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    redirect("/dashboard/vendor/subscription")
  }

  // Ownership: this session must belong to the logged-in vendor
  if (session.metadata?.vendorId !== userSession.user.id) {
    redirect("/dashboard/vendor/subscription")
  }

  return (
    <SuccessContent
      vendorId={userSession.user.id}
      sessionId={session.id}
      amount={(session.amount_total ?? 0) / 100}
      currency={session.currency ?? "usd"}
    />
  )
}

export default PaymentSuccessPage
