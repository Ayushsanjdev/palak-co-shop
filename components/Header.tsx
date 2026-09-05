"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useAuthStore } from "@/lib/auth-store";
import { useLanguage } from "@/lib/i18n/language-context";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

// Mobile-first sticky header. Cart badge, login/logout button, and nav
// labels are all wired to real stores now (cart-store, auth-store,
// auth-modal-store) -- no more placeholder casts.
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalCount());
  const openLogin = useAuthModalStore((s) => s.open);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("allBags") },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b bg-[var(--color-bg)]/95 backdrop-blur"
      style={{ borderColor: "var(--color-line)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-display text-lg">
            Palak & Co.
          </Link>
          {isAdmin && (
            <span
              className="text-xs font-medium text-white"
              style={{
                background: "var(--color-accent)",
                borderRadius: "999px",
                padding: "2px 8px",
              }}
            >
              Admin mode
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden gap-6 text-sm sm:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-70">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle />

          <button
            onClick={() => (isLoggedIn ? logout() : openLogin())}
            className="hidden text-sm sm:inline"
          >
            {isLoggedIn ? "Logout" : t("login")}
          </button>

          <Link href="/cart" className="relative" aria-label="Cart">
            {/* Swap this for a real cart icon (lucide-react is already
                available: `import { ShoppingBag } from "lucide-react"`) */}
            <span className="text-sm">{t("cart")}</span>
            {cartCount > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                style={{ background: "var(--color-accent)" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger -- mobile only */}
          <button
            className="sm:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="text-sm">{menuOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <nav
          className="flex flex-col gap-3 border-t px-4 py-4 text-sm sm:hidden"
          style={{ borderColor: "var(--color-line)" }}
        >
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => (isLoggedIn ? logout() : openLogin())}
            className="text-left"
          >
            {isLoggedIn ? "Logout" : t("login")}
          </button>
        </nav>
      )}
    </header>
  );
}
