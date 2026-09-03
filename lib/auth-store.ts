import { create } from "zustand";

// Client-side reflection of server auth state -- the actual source of
// truth is the httpOnly session cookie + Session table (see lib/auth.ts,
// app/api/auth/*). This store just mirrors that so components can react
// to it; it never stores a password or trusts itself to decide who's
// logged in. AuthProvider.tsx calls setUser() on app load by hitting
// /api/auth/me, and login()/logout() below call the real endpoints.
interface AuthState {
  isLoggedIn: boolean;
  name: string | null;
  phone: string | null;
  isLoading: boolean;
  setUser: (user: { name: string; phone: string } | null) => void;
  login: (args: {
    name?: string;
    phone: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isLoggedIn: false,
  name: null,
  phone: null,
  isLoading: true,

  setUser: (user) =>
    set(
      user
        ? {
            isLoggedIn: true,
            name: user.name,
            phone: user.phone,
            isLoading: false,
          }
        : { isLoggedIn: false, name: null, phone: null, isLoading: false },
    ),

  login: async ({ name, phone, password }) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error ?? "Something went wrong" };
    }

    const user = await res.json();
    set({
      isLoggedIn: true,
      name: user.name,
      phone: user.phone,
      isLoading: false,
    });
    return { ok: true };
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ isLoggedIn: false, name: null, phone: null });
  },
}));
