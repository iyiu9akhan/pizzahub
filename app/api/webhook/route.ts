// Creates a Stripe Checkout Session for the Premium plan (one-time payment)
import { NextResponse } from "next/server"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  // Read the logged in user on the server (never trust the client)
  const userSession = await getSession()

  // Not logged in: stop here
  if (!userSession?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Only non-banned vendors may create a checkout session
  if (
    userSession.user.role !== "vendor" ||
    (userSession.user as { banned?: boolean }).banned
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // one-time payment
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "PizzaHub Premium" },
            unit_amount: 2900, // $29 in cents, set on the server
          },
          quantity: 1,
        },
      ],
      // The webhook uses this to know which vendor paid
      metadata: { vendorId: userSession.user.id, plan: "premium" },
      customer_email: userSession.user.email,
      success_url: `${origin}/dashboard/vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/vendor/payment-cancel`,
    })

    // The button redirects the browser to this url
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe session error:", err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Stripe error" },
      { status: 500 }
    )
  }
}