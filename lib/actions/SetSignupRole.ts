"use server"

import { ObjectId } from "mongodb"
import { db } from "@/lib/auth"
import { getSession } from "@/lib/core/server"

// Signup er por role set. Sudhu customer/vendor, admin kokhono na.
export async function setSignupRole(role: "customer" | "vendor") {
  const session = await getSession()
  if (!session?.user) return { success: false }
  if (session.user.role === "admin") return { success: true }

  const safeRole = role === "vendor" ? "vendor" : "customer"

  await db
    .collection("user")
    .updateOne({ _id: new ObjectId(session.user.id) }, { $set: { role: safeRole } })

  return { success: true }
}