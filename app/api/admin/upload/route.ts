import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";

// Accepts a single image file from the admin form, uploads it to Vercel
// Blob, returns the public URL. Requires BLOB_READ_WRITE_TOKEN -- Vercel
// sets this automatically once you connect a Blob store to your project
// (Storage tab -> Create Database -> Blob). For local dev, run
// `vercel env pull` to get it into your local .env too.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);

  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
