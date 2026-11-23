import { attachDatabasePool } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  throw new Error("MONGODB_URI is missing in environment variables")
}

const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient
}

// Pulls the real per-node network error out of a MongoServerSelectionError,
// because the default log only prints "[ServerDescription]".
function describeMongoError(error: unknown) {
  const err = error as {
    message?: string
    reason?: {
      servers?: Map<
        string,
        { address?: string; type?: string; error?: { message?: string } | null }
      >
    }
  }
  const servers = err?.reason?.servers
    ? Array.from(err.reason.servers.values()).map((s) => ({
        address: s.address,
        type: s.type,
        error: s.error?.message ? s.error.message.slice(0, 200) : null,
      }))
    : []
  return { message: String(err?.message).slice(0, 200), servers }
}

export const client =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 3,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = client
  attachDatabasePool(client)

  // Shows the real reason a node connection fails (timeout, reset, TLS...)
  client.on("serverHeartbeatFailed", (event) => {
    console.warn(
      "Mongo heartbeat failed:",
      event.connectionId,
      String(event.failure?.message).slice(0, 200)
    )
  })

  // If the first connection fails, the driver leaves the client closed and
  // every later query throws "Topology is closed". Reconnect explicitly.
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined

  client.on("topologyClosed", () => {
    if (reconnectTimer) return
    console.warn("MongoDB topology closed, reconnecting...")
    reconnectTimer = setTimeout(() => {
      reconnectTimer = undefined
      client.connect().catch((error) => {
        console.error(
          "MongoDB reconnect failed:",
          JSON.stringify(describeMongoError(error))
        )
      })
    }, 2000)
  })
}

export const db = client.db("pizzahub") // db name

export const auth = betterAuth({
  session: {
    // Short cache so premium/role/ban changes show up within a minute
    cookieCache: { enabled: true, maxAge: 60 },
  },
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://iyiu9akhan-pizzahub.vercel.app",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  // Email + password sign-in
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      businessName: { type: "string", input: true, defaultValue: "" },
      premium: { type: "boolean", input: false, defaultValue: false },
      subscriptionPlan: { type: "string", input: false, defaultValue: "free" },
      subscriptionExpiresAt: { type: "date", input: false, defaultValue: null },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const rawCookie = context?.headers?.get("cookie") || ""
          const match = rawCookie.match(
            /pizzahub_signup_role=(customer|vendor)/
          )
          const chosenRole = match ? match[1] : "customer"
          return {
            data: {
              ...user,
              role: chosenRole === "vendor" ? "vendor" : "customer",
              premium: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
              businessName: user.businessName || "",
            },
          }
        },
      },
      update: {
        before: async (user) => {
          const safeData = { ...user } as Record<string, unknown>
          delete safeData.role
          delete safeData.premium
          delete safeData.subscriptionPlan
          delete safeData.subscriptionExpiresAt
          delete safeData.banned
          delete safeData.banReason
          delete safeData.banExpires
          return {
            data: safeData,
          }
        },
      },
    },
  },
  // Google OAuth provider
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [admin({ defaultRole: "customer" })],
  database: mongodbAdapter(db, {
    client,
  }),
})