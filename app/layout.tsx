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
  title: "GameCatalog — Discover & Manage Your Games",
  description:
    "A modern game catalog built with Next.js and Supabase. Browse, add, edit, and delete games with a beautiful gamer-themed UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        {/* Navbar is shared across all pages */}
        <Navbar />
        {/* Page content renders here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
