"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
  imageUrl: string;
}

interface AdminProductTableProps {
  initialProducts: Product[];
}

function formatINR(paise: number) {
  return (paise / 100).toFixed(0);
}

export default function AdminProductTable({
  initialProducts,
}: AdminProductTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function updateProduct(id: string, patch: Partial<Product>) {
    setSavingId(id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );

    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    setSavingId(null);
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Remove "${name}" from the shop? This can't be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/admin/products/new"
        className="mb-2 inline-block w-fit px-5 py-3 text-sm font-medium text-white"
        style={{
          background: "var(--color-accent)",
          borderRadius: "var(--radius-card)",
        }}
      >
        + Add a new bag
      </Link>

      {products.length === 0 && (
        <p className="text-sm text-neutral-500">
          No bags yet -- add your first one above.
        </p>
      )}

      {products.map((p) => (
        <div
          key={p.id}
          className="flex flex-wrap items-center gap-4 border p-3 text-sm"
          style={{
            borderColor: "var(--color-line)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <div
            className="relative h-14 w-14 shrink-0 overflow-hidden bg-[var(--color-surface)]"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <Image
              src={p.imageUrl}
              alt={p.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <span className="w-32 shrink-0 font-medium">{p.name}</span>
          <span className="text-xs text-neutral-500">{p.category}</span>

          <label className="flex items-center gap-1">
            ₹
            <input
              type="number"
              defaultValue={formatINR(p.price)}
              onBlur={(e) =>
                updateProduct(p.id, {
                  price: Math.round(Number(e.target.value) * 100),
                })
              }
              className="w-20 border px-2 py-1"
              style={{
                borderColor: "var(--color-line)",
                borderRadius: "var(--radius-card)",
              }}
            />
          </label>

          <label className="flex items-center gap-1">
            Stock:
            <input
              type="number"
              defaultValue={p.stock}
              onBlur={(e) =>
                updateProduct(p.id, { stock: Number(e.target.value) })
              }
              className="w-16 border px-2 py-1"
              style={{
                borderColor: "var(--color-line)",
                borderRadius: "var(--radius-card)",
              }}
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={p.inStock}
              onChange={(e) =>
                updateProduct(p.id, { inStock: e.target.checked })
              }
            />
            Available
          </label>

          {savingId === p.id && (
            <span className="text-xs text-neutral-400">Saving...</span>
          )}

          <div className="ml-auto flex gap-3">
            <button
              onClick={() => router.push(`/admin/products/${p.id}/edit`)}
              className="text-xs underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p.id, p.name)}
              disabled={deletingId === p.id}
              className="text-xs text-red-600 underline disabled:opacity-50"
            >
              {deletingId === p.id ? "Removing..." : "Remove"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
