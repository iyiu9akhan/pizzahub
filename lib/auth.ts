import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.MONGODB_URI as string)
const db = client.db("pizzahub") // db name

export const auth = betterAuth({
  //login with mail & pass
  emailAndPassword: {
    enabled: true,
  },
  //sending user role to db
  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor", "admin"],
        input: true,
        defaultValue: "customer",
      },
    },
  },
  //google login
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
