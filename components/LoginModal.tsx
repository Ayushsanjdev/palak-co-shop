"use client";

import { useState } from "react";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useAuthStore } from "@/lib/auth-store";

// Same phone number, first time -> creates an account; returning ->
// just verifies the password. Name field is only needed the first time,
// but keeping it always visible avoids a "wait, do I have an account?"
// decision for the user -- if they already have one, name is ignored.
export default function LoginModal() {
  const { isOpen, close } = useAuthModalStore();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login({
      name: name.trim() || undefined,
      phone: phone.trim(),
      password,
    });

    setSubmitting(false);
    if (result.ok) {
      setName("");
      setPhone("");
      setPassword("");
      close();
    } else {
      setError(result.error ?? "Something went wrong");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={close}
    >
      <div
        className="w-full max-w-sm animate-[slideUp_0.2s_ease-out] bg-[var(--color-bg)] p-6 sm:animate-none"
        style={{ borderRadius: "16px 16px 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--color-line)] sm:hidden" />

        <h2 className="font-display text-lg">Log in to continue</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Browsing is open to everyone -- log in to add items or checkout. New
          here? Just fill in your name too.
        </p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            placeholder="Name (only needed the first time)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--color-line)",
              borderRadius: "var(--radius-card)",
            }}
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--color-line)",
              borderRadius: "var(--radius-card)",
            }}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--color-line)",
              borderRadius: "var(--radius-card)",
            }}
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{
              background: "var(--color-accent)",
              borderRadius: "var(--radius-card)",
            }}
          >
            {submitting ? "Please wait..." : "Continue"}
          </button>
        </form>

        <button
          onClick={close}
          className="mt-3 text-xs text-neutral-400 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
