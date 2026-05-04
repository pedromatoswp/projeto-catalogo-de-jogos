"use client";

/**
 * components/Navbar.tsx
 *
 * Top navigation bar shown on every page.
 * Uses Next.js <Link> for client-side navigation (no full page reloads).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // Used to highlight the active link

  // Helper: returns extra classes when the link matches current page
  const isActive = (href: string) =>
    pathname === href
      ? "text-green-400 border-b-2 border-green-400"
      : "text-slate-300 hover:text-green-400";

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-400 transition-colors">
              <Gamepad2 className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              Game<span className="text-green-400">Catalog</span>
            </span>
          </Link>

          {/* ── Navigation Links ── */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors pb-1 ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              href="/games/new"
              className={`text-sm font-medium transition-colors pb-1 ${isActive("/games/new")}`}
            >
              Add Game
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
