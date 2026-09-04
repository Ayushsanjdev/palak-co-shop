"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

// Server always renders "empty cart" (it has no access to localStorage).
// This waits until after mount -- safely on the client only -- then
// pulls the real cart in, so the badge/count update happens as a normal
// post-mount state change instead of a mismatch during hydration itself.
export default function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
