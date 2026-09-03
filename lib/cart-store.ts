import { create } from "zustand";
import { persist } from "zustand/middleware";

// Each cart item stores a snapshot of product info at add-time, not just
// an id -- so the cart page can render name/price/image without an extra
// fetch per item. Tradeoff: if the product's price changes later in the
// DB, the cart still shows the price it had when added, until you re-add
// it. That's an intentional, common e-commerce choice (it's also why
// big sites show "price may have changed" at checkout) -- revisit if you
// want live prices instead.
export interface CartItem {
  productId: string;
  name: string;
  price: number; // paise, snapshot at add-time
  imageUrl: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId,
        );
        if (existing) {
          // Already in cart -- increment qty rather than adding a duplicate row.
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, qty } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),

      // Computed on read rather than stored -- avoids the bug class where
      // you update `items` in one action but forget to update a stored
      // total in another.
      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "cart-storage", // localStorage key -- survives page refresh
    },
  ),
);
