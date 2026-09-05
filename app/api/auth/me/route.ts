import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromToken(token);

  if (!user) return NextResponse.json(null);
  return NextResponse.json({
    name: user.name,
    phone: user.phone,
    isAdmin: user.isAdmin,
  });
}
