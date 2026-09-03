"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser(null));
  }, [setUser]);

  return <>{children}</>;
}
