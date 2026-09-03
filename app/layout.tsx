import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import LoginModal from "@/components/LoginModal";
import AuthProvider from "@/components/AuthProvider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { themeInitScript } from "@/lib/theme-script";

export const metadata = {
  title: "Palak & Co.",
  description: "Quality bags, sold locally in Barh.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint -- prevents a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <Header />
            {children}
            {/* Mounted once here so any button anywhere can trigger it via
                useAuthModalStore, without prop-drilling. */}
            <LoginModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
