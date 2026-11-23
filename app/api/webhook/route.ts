import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { stripe } from "@/lib/stripe"
import { getDb } from "@/lib/mongodb"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const idQuery = (id: string) => {
  const ids: (string | ObjectId)[] = [id]
  if (ObjectId.isValid(id)) ids.push(new ObjectId(id))
  return { _id: { $in: ids } } as Record<string, unknown>
}

export async function POST(req: Request) {
  const body = await req.text() 
  const sig = req.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ message: "Missing signature" }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature error:", err)
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }

  try {
    const db = await getDb()
    const users = db.collection("user")
    const transactions = db.collection("transactions")

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const vendorId = session.metadata?.vendorId
      console.log("checkout.session.completed", session.id, vendorId)

      if (session.payment_status === "paid" && vendorId) {
        const query = idQuery(vendorId)
        const vendor = await users.findOne(query)

        if (vendor && vendor.role === "vendor") {
          const now = new Date()
          const current = vendor.subscriptionExpiresAt
            ? new Date(vendor.subscriptionExpiresAt)
            : null
          const base = current && current > now ? current : now
          const expiresAt = new Date(base)
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          try {
            await transactions.insertOne({
              vendorId: String(vendorId),
              plan: "premium",
              amount: session.amount_total,
              currency: session.currency,
              stripeSessionId: session.id,
              stripeSubscriptionId: null,
              paymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : (session.payment_intent?.id ?? null),
              status: "paid",
              createdAt: now,
            })
          } catch (e) {
            // duplicate delivery checking
            if ((e as { code?: number }).code === 11000) {
              return NextResponse.json({ received: true })
            }
            throw e
          }

          try {
            await users.updateOne(query, {
              $set: {
                premium: true,
                subscriptionPlan: "premium",
                subscriptionExpiresAt: expiresAt,
                updatedAt: now,
              },
            })
          } catch (e) {
            
            await transactions.deleteOne({ stripeSessionId: session.id })
            throw e
          }
        }
      }
    } else if (event.type === "charge.refunded") {
      const pi =
        typeof event.data.object.payment_intent === "string"
          ? event.data.object.payment_intent
          : null
      if (pi) {
        const tx = await transactions.findOne({ paymentIntentId: pi })
        if (tx) {
          await transactions.updateOne(
            { _id: tx._id },
            { $set: { status: "refunded" } }
          )
          if (tx.vendorId) {
            await users.updateOne(idQuery(tx.vendorId), {
              $set: {
                premium: false,
                subscriptionPlan: "free",
                subscriptionExpiresAt: null,
                updatedAt: new Date(),
              },
            })
          }
        }
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return NextResponse.json({ message: "Handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}