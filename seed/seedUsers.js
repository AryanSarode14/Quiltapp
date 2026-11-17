import { faker } from "@faker-js/faker";
import { hashPassword } from "../auth/password.js";

export const DEMO_PASSWORD = "password123";

// Named accounts match the personas in the design document.
const PERSONAS = [
  { username: "mansi", displayName: "Mansi" },
  { username: "janvi", displayName: "Janvi" },
  { username: "shivani", displayName: "Shivani" },
];

export async function seedUsers(db, count = 40) {
  const collection = db.collection("users");
  await collection.deleteMany({});

  const people = [...PERSONAS];
  for (let i = people.length; i < count; i += 1) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    people.push({
      username: `${first}${i}`.toLowerCase().replace(/[^a-z0-9_]/g, ""),
      displayName: `${first} ${last.charAt(0)}.`,
    });
  }

  const docs = [];
  for (const person of people) {
    const { salt, passwordHash } = await hashPassword(DEMO_PASSWORD);
    docs.push({
      ...person,
      salt,
      passwordHash,
      createdAt: faker.date.past({ years: 1 }),
    });
  }

  await collection.insertMany(docs);
  await collection.createIndex({ username: 1 }, { unique: true });
  return collection
    .find({}, { projection: { username: 1, displayName: 1 } })
    .toArray();
}
