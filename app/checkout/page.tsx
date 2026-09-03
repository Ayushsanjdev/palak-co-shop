"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth-store";
import AddressForm, { type AddressData } from "@/components/AddressForm";

function formatINR(paise: number) {
  return (paise / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

// COD / pay-on-delivery flow, matching the "no payment gateway for a
// local shop" decision from earlier. If you later add Razorpay or
// similar, this is the file where you'd swap the final button's action:
// instead of POSTing straight to /api/orders, you'd create a Razorpay
// order first, open their checkout widget, and only call /api/orders
// (or mark it "paid") in the payment-success callback.
export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clear);
  const phoneFromAuth = useAuthStore((s) => s.phone);

  const [address, setAddress] = useState<AddressData>({
    name: "",
    phone: phoneFromAuth ?? "",
    addressLine: "",
    city: "Barh",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: address.name,
          customerPhone: address.phone,
          addressLine: address.addressLine,
          city: address.city,
          pincode: address.pincode,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
          totalPrice,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      router.push("/order-confirmed");
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <p className="text-neutral-500">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <h1 className="font-display mb-6 text-2xl">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
        <AddressForm value={address} onChange={setAddress} />

        <div
          className="border-t pt-4 text-sm"
          style={{ borderColor: "var(--color-line)" }}
        >
          <div className="flex justify-between">
            <span className="text-neutral-500">{items.length} item(s)</span>
            <span className="font-semibold">{formatINR(totalPrice)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Pay on delivery — cash or UPI at your door.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-sm font-medium text-white disabled:opacity-50"
          style={{
            background: "var(--color-accent)",
            borderRadius: "var(--radius-card)",
          }}
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </main>
  );
}
