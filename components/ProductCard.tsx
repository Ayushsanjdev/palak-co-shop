import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number; // paise
  originalPrice: number | null;
  imageUrl: string;
  category: string;
  material?: string | null;
  color?: string | null;
}

function formatINR(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

// Whole card (except the Add to Cart button) is now one clickable link
// to the product page -- more forgiving than only the image/title being
// clickable, and rules out "clicked in the wrong spot" confusion.
export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  imageUrl,
  category,
  material,
  color,
}: ProductCardProps) {
  const isOnSale = !!originalPrice && originalPrice > price;
  const discountPct = isOnSale
    ? Math.round(100 - (price / (originalPrice as number)) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col"
      style={{ borderRadius: "var(--radius-card)" }}
    >
      <Link href={`/products/${slug}`} className="flex flex-col">
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-surface)]"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {isOnSale && (
            <span
              className="absolute left-2 top-2 px-2 py-1 text-xs font-medium text-white"
              style={{
                background: "var(--color-sale)",
                borderRadius: "var(--radius-card)",
              }}
            >
              {discountPct}% off
            </span>
          )}
        </div>

        <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
          {category}
        </p>
        <h3 className="text-sm font-medium">{name}</h3>
        {(material || color) && (
          <p className="text-xs text-neutral-500">
            {[material, color].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold">{formatINR(price)}</span>
          {isOnSale && (
            <span className="text-xs text-neutral-400 line-through">
              {formatINR(originalPrice as number)}
            </span>
          )}
        </div>
      </Link>

      {/* Outside the Link on purpose -- clicking Add to Cart must not
          also trigger navigation to the product page. */}
      <AddToCartButton
        productId={id}
        name={name}
        price={price}
        imageUrl={imageUrl}
      />
    </div>
  );
}
