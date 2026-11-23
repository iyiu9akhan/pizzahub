// temp test 
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth, client } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode")
  const start = Date.now()
  try {
    let hasSession: boolean | undefined
    if (mode === "session") {
      const session = await auth.api.getSession({
        headers: await headers(),
        query: { disableCookieCache: true },
      })
      hasSession = Boolean(session)
    } else {
      await client.db("pizzahub").command({ ping: 1 })
    }
    return NextResponse.json({
      ok: true,
      mode: mode ?? "ping",
      ms: Date.now() - start,
      uptimeSec: Math.round(process.uptime()),
      hasSession,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: mode ?? "ping",
        ms: Date.now() - start,
        uptimeSec: Math.round(process.uptime()),
        message: String((error as Error)?.message).slice(0, 150),
      },
      { status: 500 }
    )
  }
}