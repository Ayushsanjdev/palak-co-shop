import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromToken(token);

  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await request.json();
  const {
    name,
    description,
    category,
    material,
    color,
    size,
    pattern,
    price,
    originalPrice,
    stock,
    imageUrl,
  } = body;

  if (!name || !category || price === undefined || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Handle the rare case where two products end up with the same name
  // -- append a short random suffix rather than failing the whole request.
  let slug = slugify(name);
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const product = await db.product.create({
    data: {
      name,
      slug,
      description: description || "",
      category,
      material: material || null,
      color: color || null,
      size: size || null,
      pattern: pattern || null,
      price,
      originalPrice: originalPrice || null,
      stock: stock ?? 0,
      imageUrl,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
