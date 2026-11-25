"use server"

import { authFetch } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function cancelPremium(): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await authFetch(`${BASE_URL}/subscription/cancel`, {
      method: "POST",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, message: data?.message ?? "Could not cancel Premium" }
    }
    return { ok: true, message: data?.message ?? "Premium plan cancelled" }
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err
    }
    return { ok: false, message: "Something went wrong. Please try again." }
  }
}