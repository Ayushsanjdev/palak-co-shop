import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";

function formatINR(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

// Server Component — fetches directly from Prisma, no API route needed
// since nothing here requires client-side language switching (unlike
// the home page). Boilerplate; safe to restyle without touching logic.
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const isOnSale =
    !!product.originalPrice && product.originalPrice > product.price;
  const discountPct = isOnSale
    ? Math.round(
        100 - (product.price / (product.originalPrice as number)) * 100,
      )
    : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 sm:grid-cols-2">
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-surface)]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
          {isOnSale && (
            <span
              className="absolute left-3 top-3 px-2 py-1 text-xs font-medium text-white"
              style={{
                background: "var(--color-sale)",
                borderRadius: "var(--radius-card)",
              }}
            >
              {discountPct}% off
            </span>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {product.category}
          </p>
          <h1 className="font-display mt-1 text-2xl">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-semibold">
              {formatINR(product.price)}
            </span>
            {isOnSale && (
              <span className="text-sm text-neutral-400 line-through">
                {formatINR(product.originalPrice as number)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-neutral-600">{product.description}</p>

          <div className="mt-6 max-w-xs">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          </div>

          {!product.inStock && (
            <p className="mt-2 text-xs text-red-600">Currently out of stock.</p>
          )}
        </div>
      </div>
    </main>
  );
}
