import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "./db";

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

// Real, DB-backed session -- not a JWT the client could forge, and not
// trusting anything the browser sends beyond an opaque random token.
// Logging out or deleting the row here actually invalidates the session
// everywhere, immediately.
export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({ data: { token, userId, expiresAt } });
  return { token, expiresAt };
}

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

// Use in any admin API route/page: returns the user if they're logged
// in AND flagged isAdmin, otherwise null -- caller decides what to do
// (redirect, 403, etc).
export async function getAdminFromToken(token: string | undefined) {
  const user = await getUserFromToken(token);
  if (!user?.isAdmin) return null;
  return user;
}

export async function deleteSession(token: string | undefined) {
  if (!token) return;
  await db.session.delete({ where: { token } }).catch(() => {});
}
