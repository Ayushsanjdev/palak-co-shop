"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  category: string;
  material: string | null;
  color: string | null;
}

// Client Component -- needs interactive search/filter, so data comes
// from /api/products instead of a direct server-side Prisma call.
// Filter state lives in the URL via useState here for simplicity; if you
// want filters to be shareable/bookmarkable links (e.g. someone shares
// "/products?category=Tote"), that's the upgrade path -- swap useState
// for useSearchParams/router.replace.
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-display mb-6 text-2xl">All Bags</h1>

      <input
        type="search"
        placeholder="Search bags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full border px-3 py-2 text-sm sm:max-w-xs"
        style={{
          borderColor: "var(--color-line)",
          borderRadius: "var(--radius-card)",
        }}
      />

      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory(null)}
          className="whitespace-nowrap border px-4 py-1.5 text-sm"
          style={{
            borderColor: "var(--color-line)",
            borderRadius: "999px",
            background:
              activeCategory === null ? "var(--color-accent)" : "transparent",
            color: activeCategory === null ? "white" : "inherit",
          }}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className="whitespace-nowrap border px-4 py-1.5 text-sm"
            style={{
              borderColor: "var(--color-line)",
              borderRadius: "999px",
              background:
                activeCategory === c ? "var(--color-accent)" : "transparent",
              color: activeCategory === c ? "white" : "inherit",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No bags match your search.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              originalPrice={p.originalPrice}
              imageUrl={p.imageUrl}
              category={p.category}
              material={p.material}
              color={p.color}
            />
          ))}
        </div>
      )}
    </main>
  );
}
