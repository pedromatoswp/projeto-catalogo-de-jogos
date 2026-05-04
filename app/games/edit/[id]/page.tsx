"use client";

/**
 * app/games/edit/[id]/page.tsx — Edit Game Page
 *
 * Loads the existing game data by ID, then shows a pre-filled form.
 * On submission, sends a PUT request to update the game in the database.
 */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import GameForm from "@/components/GameForm";
import { Game } from "@/lib/supabase";

export default function EditGamePage() {
  const { id } = useParams(); // Gets the game ID from the URL (e.g. /games/edit/5)
  const router = useRouter();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // ── Load the game data on mount ───────────────────────────────
  useEffect(() => {
    const fetchGame = async () => {
      try {
        // We fetch all games and find the one matching the ID
        // (Simple approach — good for students to understand)
        const res = await fetch("/api/games");
        const data: Game[] = await res.json();
        const found = data.find((g) => g.id === Number(id));
        if (found) {
          setGame(found);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load game:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGame();
  }, [id]);

  // ── Handle form submission ────────────────────────────────────
  const handleSubmit = async (data: Omit<Game, "id">) => {
    const res = await fetch(`/api/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update game");
    }

    router.push("/");
    router.refresh();
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  // ── Not found state ───────────────────────────────────────────
  if (notFound || !game) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Jogo não encontrado</h2>
        <p className="text-slate-400 mb-6">Este jogo não existe ou foi deletado.</p>
        <Link href="/" className="text-green-400 hover:underline">← Voltar ao Catálogo</Link>
      </div>
    );
  }

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
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Edit3 className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Editar: <span className="text-blue-400">{game.name}</span>
          </h1>
        </div>
        <p className="text-slate-400 ml-12 text-sm">
          Atualize os detalhes abaixo e salve as alterações.
        </p>
      </motion.div>

      {/* ── Form Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
      >
        {/* Pass existing game data so the form is pre-filled */}
        <GameForm
          initialData={game}
          onSubmit={handleSubmit}
          submitLabel="Salvar Alterações"
        />
      </motion.div>
    </div>
  );
}
