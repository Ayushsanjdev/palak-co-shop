import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);

  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  // Only these fields are editable from the admin form -- deliberately
  // not accepting arbitrary fields from the request body.
  const {
    name,
    description,
    category,
    stock,
    inStock,
    price,
    originalPrice,
    imageUrl,
  } = body;

  const product = await db.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(stock !== undefined && { stock }),
      ...(inStock !== undefined && { inStock }),
      ...(price !== undefined && { price }),
      ...(originalPrice !== undefined && { originalPrice }),
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);

  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  await db.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
