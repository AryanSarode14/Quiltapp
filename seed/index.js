// Run with: npm run seed
// Replaces all users, help requests, and help offers with synthetic data.
import "dotenv/config";
import { closeDB, connectDB } from "../db/connection.js";
import { DEMO_PASSWORD, seedUsers } from "./seedUsers.js";
import { seedRequests } from "./seedRequests.js";
import { seedOffers } from "./seedOffers.js";

const db = await connectDB();
try {
  const users = await seedUsers(db);
  const requestCount = await seedRequests(db, users);
  const offerCount = await seedOffers(db, users);
  console.log(
    `Seeded ${users.length} users, ${requestCount} help requests, ${offerCount} help offers.`,
  );
  console.log(
    `Demo logins: mansi, janvi, shivani (password: ${DEMO_PASSWORD})`,
  );
} finally {
  await closeDB();
}
