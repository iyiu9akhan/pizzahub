import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("pizzahub") // db name

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
