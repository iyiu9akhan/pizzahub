import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
export const db = client.db("pizzahub") // db name

export const auth = betterAuth({
  // Email + password sign-in
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      // User role — determines dashboard access
      role: {
        type: ["customer", "vendor", "admin"],
        input: true,
        defaultValue: "customer",
      },
      // Vendor's restaurant/business name — editable from profile settings
      businessName: {
        type: "string",
        input: true,
        defaultValue: "",
      },
      // Vendor premium subscription status — client must never set it directly
      premium: {
        type: "boolean",
        input: false,
        defaultValue: false,
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
  database: mongodbAdapter(db, {
    client,
  }),
})
