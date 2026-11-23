// stripe checkout session for the premium plan
import { NextResponse } from "next/server"
import { getSession } from "@/lib/core/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  // current user data
  const userSession = await getSession()

  // block non loggedin user
  if (!userSession?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // check vendor isBanned?
  if (
    userSession.user.role !== "vendor" ||
    (userSession.user as { banned?: boolean }).banned
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "PizzaHub Premium" },
            unit_amount: 2900,
          },
          quantity: 1,
        },
      ],
      // paid vendor check
      metadata: { vendorId: userSession.user.id, plan: "premium" },
      customer_email: userSession.user.email,
      success_url: `${origin}/dashboard/vendor/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/vendor/payment-cancel`,
    })

    // this button redirects the browser to this url
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe session error:", err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Stripe error" },
      { status: 500 }
    )
  }
}
