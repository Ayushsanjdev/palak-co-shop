import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

// One endpoint handles both login and signup: if the phone number
// already has an account, verify the password; if not, create a new
// account (name required in that case). This is a deliberate UX choice
// for a small local shop -- fewer screens, no separate "sign up" flow.
export async function POST(request: Request) {
  const { name, phone, password } = await request.json();

  if (!phone || !password) {
    return NextResponse.json(
      { error: "Phone and password are required" },
      { status: 400 },
    );
  }

  let user = await db.user.findUnique({ where: { phone } });

  if (user) {
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );
    }
  } else {
    if (!name) {
      return NextResponse.json(
        { error: "New here? Add your name to create an account." },
        { status: 400 },
      );
    }
    const passwordHash = await hashPassword(password);
    user = await db.user.create({ data: { name, phone, passwordHash } });
  }

  const { token, expiresAt } = await createSession(user.id);

  const res = NextResponse.json({ name: user.name, phone: user.phone });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // not readable from client JS -- this is what makes it real
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  return res;
}
