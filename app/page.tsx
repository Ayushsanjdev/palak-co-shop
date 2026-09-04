"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryRail from "@/components/CategoryRail";
import { useLanguage } from "@/lib/i18n/language-context";

// NOTE: switched this from a Server Component to a Client Component
// because it now needs useLanguage() for the tagline/section titles.
// Data fetching moved to a small API route + client fetch as a result --
// see app/api/products/route.ts. If you'd rather keep this a Server
// Component (fetch straight from Prisma again, no API route needed),
// you could instead pass the translated strings down as props from a
// server-rendered parent -- worth considering once you're comfortable
// with the server/client split from earlier.
interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  category: string;
}

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const onSale = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price,
  );
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section
        className="mb-10 border-b pb-8"
        style={{ borderColor: "var(--color-line)" }}
      >
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Palak & Co. · {t("deliveryNote")}
        </p>
        <h1 className="font-display mt-1 max-w-xl text-3xl sm:text-4xl">
          {t("tagline")}
        </h1>
        <p className="mt-2 max-w-md text-sm text-neutral-600">
          {t("subtitle")}
        </p>
      </section>

      {/* Category rail */}
      <section className="mb-10">
        <CategoryRail categories={categories} />
      </section>

      {/* On sale */}
      {onSale.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl">{t("onSale")}</h2>
            <span className="text-xs text-neutral-500">
              {onSale.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {onSale.map((p) => (
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
        </section>
      )}

      {/* All bags */}
      <section>
        <h2 className="font-display mb-4 text-xl">{t("allBags")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
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
      </section>
    </main>
  );
}
