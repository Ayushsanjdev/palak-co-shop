import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";

function formatINR(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

// Server Component -- fetches directly from Prisma. Content here is
// intentionally a bit fuller than a bare-bones listing (delivery info,
// highlights, related products) -- these are genuine, non-fake trust
// signals, not invented ratings/review counts, which would be
// misleading with no real customer reviews behind them yet.
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
  const isAvailable = product.inStock && product.stock > 0;

  const related = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      inStock: true,
      stock: { gt: 0 },
    },
    take: 4,
  });

  // Description sometimes reads better as short bullet highlights than
  // one paragraph -- split on sentence-ish boundaries as a simple
  // heuristic. Falls back to the plain description if it's too short
  // to bother splitting.
  const highlights = product.description
    .split(/[.,]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 sm:grid-cols-2">
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
          <p className="mt-1 text-xs text-neutral-500">
            Inclusive of all taxes
          </p>

          {!isAvailable ? (
            <p className="mt-4 text-sm font-medium text-red-600">
              Currently out of stock
            </p>
          ) : (
            <p
              className="mt-4 text-sm font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              In stock
              {product.stock <= 5 ? ` — only ${product.stock} left` : ""}
            </p>
          )}

          {highlights.length > 1 && (
            <ul className="mt-4 flex flex-col gap-1 text-sm text-neutral-600">
              {highlights.slice(0, 4).map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--color-accent)" }}>•</span>
                  {h}
                </li>
              ))}
            </ul>
          )}

          {isAvailable && (
            <div className="mt-6 max-w-xs">
              <ProductActions
                productId={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                maxQty={Math.min(product.stock, 10)}
              />
            </div>
          )}

          {/* Trust/delivery info block -- genuine, not fabricated */}
          <div
            className="mt-6 flex flex-col gap-2 border-t pt-4 text-sm text-neutral-600"
            style={{ borderColor: "var(--color-line)" }}
          >
            <p>🚚 Free delivery in Barh</p>
            <p>💵 Pay on delivery — cash or UPI</p>
            <p>
              ↩️ Have an issue with your order? Reach out and we&apos;ll sort it out.
            </p>
          </div>
        </div>
      </div>

      {/* Full description */}
      <div
        className="mt-10 border-t pt-6"
        style={{ borderColor: "var(--color-line)" }}
      >
        <h2 className="font-display mb-2 text-lg">Description</h2>
        <p className="max-w-2xl text-sm text-neutral-600">
          {product.description}
        </p>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div
          className="mt-10 border-t pt-6"
          style={{ borderColor: "var(--color-line)" }}
        >
          <h2 className="font-display mb-4 text-lg">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                originalPrice={p.originalPrice}
                imageUrl={p.imageUrl}
                category={p.category}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
