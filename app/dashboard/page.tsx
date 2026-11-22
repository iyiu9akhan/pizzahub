import { getSession } from "@/lib/core/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { db } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export default async function DashboardRedirectPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect("/login")
  }

  // Check if account is restricted or banned
  const userObj = session.user as {
    role?: string
    banned?: boolean
    restricted?: boolean
  }

  if (userObj.banned || userObj.restricted) {
    redirect("/restricted")
  }

  const cookieStore = await cookies()
  const signupRoleCookie = cookieStore.get("pizzahub_signup_role")?.value

  let currentRole = userObj.role || "customer"

  // Only assign role if newly signed up and role is valid ("vendor" | "customer")
  // Existing users' roles are NEVER altered by Google login
  // Admin role can never be overridden from client cookie
  if (
    signupRoleCookie &&
    (signupRoleCookie === "vendor" || signupRoleCookie === "customer") &&
    currentRole !== "admin"
  ) {
    try {
      const userDoc = await db.collection("user").findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { createdAt: 1, role: 1 } }
      )
      if (userDoc && userDoc.role !== "admin") {
        const isRecentlyCreated =
          userDoc.createdAt &&
          Date.now() - new Date(userDoc.createdAt).getTime() < 120000

        if (isRecentlyCreated && signupRoleCookie === "vendor" && userDoc.role !== "vendor") {
          await db
            .collection("user")
            .updateOne(
              { _id: new ObjectId(session.user.id) },
              { $set: { role: "vendor" } }
            )
          currentRole = "vendor"
        }
      }
    } catch {
      // Keep currentRole fallback
    }
  }

  if (currentRole === "admin") {
    redirect("/dashboard/admin")
  } else if (currentRole === "vendor") {
    redirect("/dashboard/vendor")
  } else {
    redirect("/dashboard/customer")
  }
}
