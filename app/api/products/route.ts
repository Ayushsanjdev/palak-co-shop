import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Boilerplate — plain GET endpoint, no auth needed since browsing is
// open to everyone (only actions require login, per your design).
export async function GET() {
  const products = await db.product.findMany({
    where: { inStock: true, stock: { gt: 0 } },
  });
  return NextResponse.json(products);
}
