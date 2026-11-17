import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  if (db) return db;
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME || "quilt");
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export async function closeDB() {
  if (client) await client.close();
  client = undefined;
  db = undefined;
}
