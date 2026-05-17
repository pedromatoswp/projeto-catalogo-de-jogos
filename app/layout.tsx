/**
 * app/layout.tsx
 *
 * Root layout — wraps every page.
 * The Navbar is included here so it appears on all pages automatically.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Google Font: Inter — clean, modern, easy to read
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NOVA — Premium Game Catalog",
  description:
    "A premium game catalog platform. Discover, manage, and explore games with a modern minimalist aesthetic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        {/* Navbar is shared across all pages */}
        <Navbar />
        {/* Page content renders here with proper spacing for fixed navbar */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
