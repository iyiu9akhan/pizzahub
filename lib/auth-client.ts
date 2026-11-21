// Client-side Better Auth setup with typed additional fields inference.
import { createAuthClient } from "better-auth/react"
import type { auth } from "@/lib/auth"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
})

export const { signIn, signUp, useSession } = authClient
