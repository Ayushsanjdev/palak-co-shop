"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

function formatINR(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block text-sm underline">
          Browse bags
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display mb-6 text-2xl">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-3 border-b pb-4"
            style={{ borderColor: "var(--color-line)" }}
          >
            <div
              className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--color-surface)]"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-sm text-neutral-600">
                {formatINR(item.price)}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  className="h-6 w-6 border text-sm"
                  style={{
                    borderColor: "var(--color-line)",
                    borderRadius: "var(--radius-card)",
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  className="h-6 w-6 border text-sm"
                  style={{
                    borderColor: "var(--color-line)",
                    borderRadius: "var(--radius-card)",
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="ml-auto text-xs text-neutral-400 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-neutral-500">Total</span>
        <span className="text-lg font-semibold">{formatINR(totalPrice)}</span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block w-full py-3 text-center text-sm font-medium text-white"
        style={{
          background: "var(--color-accent)",
          borderRadius: "var(--radius-card)",
        }}
      >
        Proceed to checkout
      </Link>
    </main>
  );
}
