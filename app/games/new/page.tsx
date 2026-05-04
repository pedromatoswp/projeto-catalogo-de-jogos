"use client";

/**
 * app/games/new/page.tsx — Add Game Page
 *
 * Shows a form to create a new game.
 * On success, redirects the user back to the homepage.
 */

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import GameForm from "@/components/GameForm";
import { Game } from "@/lib/supabase";

export default function NewGamePage() {
  const router = useRouter();

  // ── Handle form submission ────────────────────────────────────
  const handleSubmit = async (data: Omit<Game, "id">) => {
    // Send a POST request to our API
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create game");
    }

    // Redirect back to the homepage after successful creation
    router.push("/");
    router.refresh(); // Force Next.js to refetch data
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Back button ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white
                   transition-colors text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
      </Link>

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <PlusCircle className="w-5 h-5 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Adicionar Novo Jogo</h1>
        </div>
        <p className="text-slate-400 ml-12 text-sm">
          Preencha os detalhes abaixo para adicionar um jogo ao catálogo.
        </p>
      </motion.div>

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
      >
        <GameForm onSubmit={handleSubmit} submitLabel="Adicionar Jogo" />
      </motion.div>
    </div>
  );
}
