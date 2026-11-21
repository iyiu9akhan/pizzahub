// Payment Success page: /dashboard/vendor/payment-success
// Verifies the payment with Stripe server-side and activates Premium in DB.
export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"
import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/core/server"
import { db } from "@/lib/auth"
import SuccessContent from "./SuccessContent"
import { paymentVerify } from "@/lib/actions/Payments"

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) => {
  const { session_id } = await searchParams

  // No session id: send the vendor back to the plans page
  if (!session_id) redirect("/dashboard/vendor/subscription")

  // Logged in user (Better Auth)
  const userSession = await getSession()

  if (!userSession?.user) redirect("/login")

  // Retrieve the real Stripe Checkout Session
  let session

  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    })
  } catch {
    // Invalid or fake session id
    redirect("/dashboard/vendor/subscription")
  }

  // Payment must be finished and paid
  if (session.status !== "complete" || session.payment_status !== "paid") {
    redirect("/dashboard/vendor/subscription")
  }

  // This payment must belong to the logged in vendor
  if (session.metadata?.vendorId !== userSession.user.id) {
    redirect("/dashboard/vendor/subscription")
  }

  // Verify and save payment to backend
  await paymentVerify(session.id)

  // Set user.premium = true for that userId using the DB helper (idempotent)
  const vendorUserId = session.metadata?.vendorId || userSession.user.id
  if (vendorUserId && ObjectId.isValid(vendorUserId)) {
    await db
      .collection("user")
      .updateOne({ _id: new ObjectId(vendorUserId) }, { $set: { premium: true } })
  }

  // Invalidate cached vendor views so the page shows fresh data
  revalidatePath("/dashboard/vendor")
  revalidatePath("/dashboard/vendor/subscription")

  return (
    <SuccessContent
      sessionId={session.id}
      amount={(session.amount_total ?? 0) / 100}
      currency={session.currency ?? "usd"}
    />
  )
}

export default PaymentSuccessPage