"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useCartStore } from "@/lib/cart-store";

interface ProductActionsProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  maxQty: number;
}

// Same login-gating logic as AddToCartButton, but with a quantity
// stepper first -- detail page gets the fuller flow, cards keep the
// quick single-tap add.
export default function ProductActions({
  productId,
  name,
  price,
  imageUrl,
  maxQty,
}: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openLogin = useAuthModalStore((s) => s.open);
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);

  function handleAdd() {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    addItem({ productId, name, price, imageUrl });
    if (qty > 1) updateQty(productId, qty);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">Quantity</span>
        <div
          className="flex items-center gap-3 border px-2 py-1"
          style={{
            borderColor: "var(--color-line)",
            borderRadius: "var(--radius-card)",
          }}
        >
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-6 w-6 text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="h-6 w-6 text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-3 text-sm font-medium text-white"
        style={{
          background: "var(--color-accent)",
          borderRadius: "var(--radius-card)",
        }}
      >
        Add to cart
      </button>
    </div>
  );
}
