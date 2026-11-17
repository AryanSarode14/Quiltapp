import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, KEY_LENGTH);
  return { salt, passwordHash: key.toString("hex") };
}

export async function verifyPassword(password, salt, passwordHash) {
  const key = await scrypt(password, salt, KEY_LENGTH);
  const stored = Buffer.from(passwordHash, "hex");
  return stored.length === key.length && crypto.timingSafeEqual(stored, key);
}
