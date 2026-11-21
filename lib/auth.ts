import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_URI as string)
export const db = client.db("pizzahub") // db name

export const auth = betterAuth({
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
