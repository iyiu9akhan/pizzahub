import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)
export const db = client.db("pizzahub") // db name

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
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
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const rawCookie = context?.headers?.get("cookie") || ""
          const match = rawCookie.match(/pizzahub_signup_role=(customer|vendor)/)
          const chosenRole = match ? match[1] : "customer"
          return {
            data: {
              ...user,
              role: chosenRole === "vendor" ? "vendor" : "customer",
              premium: false,
              businessName: user.businessName || "",
            },
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
