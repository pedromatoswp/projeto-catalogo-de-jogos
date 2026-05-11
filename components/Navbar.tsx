"use client";

/**
 * components/Navbar.tsx
 *
 * Premium gaming navbar with glassmorphism effect
 * Transparent on load, blur effect on scroll
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Search, Plus, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper: returns active link styling
  const isActive = (href: string) =>
    pathname === href
      ? "text-white font-semibold"
      : "text-gray-300 hover:text-white transition-colors";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass-strong shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
              >
                <Gamepad2 className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white tracking-tight">
                Game<span className="text-gradient">Vault</span>
              </span>
            </Link>

            {/* ── Desktop Navigation ── */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-all duration-200 ${isActive("/")}`}
              >
                Descobrir
              </Link>
              <Link
                href="/games/new"
                className={`text-sm font-medium transition-all duration-200 ${isActive("/games/new")}`}
              >
                Adicionar Jogo
              </Link>
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <Search className="w-4 h-4 text-gray-300" />
              </motion.button>

              {/* Add Game Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/games/new"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Novo Jogo
                </Link>
              </motion.div>

              {/* User Profile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <User className="w-4 h-4 text-gray-300" />
              </motion.button>
            </div>

            {/* ── Mobile Menu Button ── */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong border-t border-white/10 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/" 
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30" 
                    : "text-gray-300 hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Descobrir
              </Link>
              <Link
                href="/games/new"
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/games/new" 
                    ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30" 
                    : "text-gray-300 hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Adicionar Jogo
              </Link>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium text-sm"
                >
                  <Search className="w-4 h-4" />
                  Buscar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  <User className="w-4 h-4 text-gray-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
