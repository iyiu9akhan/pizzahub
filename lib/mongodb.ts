import "server-only"
import { MongoClient } from "mongodb"

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> }

// one cached client, never call client.close()
const clientPromise = (g._mongo ??= new MongoClient(
  process.env.MONGODB_URI as string
).connect())

export const getDb = async () => (await clientPromise).db("pizzahub")