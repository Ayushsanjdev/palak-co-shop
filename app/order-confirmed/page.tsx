import Link from "next/link";

export default function OrderConfirmedPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <h1 className="font-display text-2xl">Order placed!</h1>
      <p className="mt-2 text-sm text-neutral-600">
        We&apos;ll reach out on your phone number to confirm delivery details.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline">
        Back to shop
      </Link>
    </main>
  );
}
