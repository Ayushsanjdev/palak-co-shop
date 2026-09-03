"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useCartStore } from "@/lib/cart-store";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
}: AddToCartButtonProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const openLogin = useAuthModalStore((s) => s.open);
  const addItem = useCartStore((s) => s.addItem);

  function handleClick() {
    if (!isLoggedIn) {
      // Not logged in -- open the modal instead of adding to cart.
      // NOTE: after login succeeds, this click's intent ("add this
      // product") is currently just dropped -- the user has to click
      // Add to Cart again. That's a deliberate simplification for now;
      // resuming the original action automatically is a nice upgrade
      // later (store the pending item in auth-modal-store, add it once
      // login succeeds).
      openLogin();
      return;
    }
    addItem({ productId, name, price, imageUrl });
  }

  return (
    <button
      onClick={handleClick}
      className="mt-2 w-full border py-1.5 text-xs font-medium transition-colors hover:bg-[var(--color-accent)] hover:text-white"
      style={{
        borderColor: "var(--color-line)",
        borderRadius: "var(--radius-card)",
      }}
    >
      Add to cart
    </button>
  );
}
