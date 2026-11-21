import "server-only"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function handleApiResponse(res: Response): Promise<Response> {
  if (res.status === 401) {
    redirect("/login")
  }

  if (res.status === 403) {
    let data: { code?: string; message?: string } | null = null
    try {
      data = await res.clone().json()
    } catch {
      // Body is not JSON
    }

    if (data?.code === "ACCOUNT_RESTRICTED") {
      try {
        await auth.api.signOut({ headers: await headers() })
      } catch {
        // Session signout fallback
      }
      redirect("/restricted")
    }

    if (data?.code === "FORBIDDEN") {
      redirect("/unauthorized")
    }
  }

  return res
}
