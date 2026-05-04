"use client";

/**
 * app/page.tsx — Homepage
 *
 * Displays all games in a responsive grid.
 * Features:
 *  - Fetch games from our API on load
 *  - Filter by genre via a dropdown
 *  - Delete with confirmation modal
 *  - Animated cards with Framer Motion
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { Game } from "@/lib/supabase";
import GameCard from "@/components/GameCard";
import DeleteModal from "@/components/DeleteModal";

// All filter options (matches the genres used when inserting data)
const GENRES = [
  "All",
  "FPS",
  "Sports",
  "Battle Royale",
  "Metroidvania",
  "Sandbox",
  "Action/Adventure",
  "RPG",
  "Strategy",
  "Puzzle",
  "Other",
];

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [search, setSearch] = useState("");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null);

  // ── Fetch games from API ──────────────────────────────────────
  const fetchGames = async (genre: string) => {
    setLoading(true);
    setDbError(false);
    try {
      const params = genre !== "All" ? `?genre=${encodeURIComponent(genre)}` : "";
      const res = await fetch(`/api/games${params}`);
      const data = await res.json();
      // Guard: if the response is not an array (e.g. error object), show the error banner
      if (!Array.isArray(data)) {
        setDbError(true);
        setGames([]);
      } else {
        setGames(data);
      }
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setDbError(true);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial load and whenever the genre filter changes
  useEffect(() => {
    fetchGames(selectedGenre);
  }, [selectedGenre]);

  // ── Delete Flow ───────────────────────────────────────────────
  const handleDeleteRequest = (id: number) => {
    const game = games.find((g) => g.id === id) ?? null;
    setDeleteTarget(game); // Opens the confirmation modal
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/games/${deleteTarget.id}`, { method: "DELETE" });
      // Remove the deleted game from local state without re-fetching
      setGames((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleteTarget(null); // Close modal
    }
  };

  // ── Search filter (client-side, instant) ─────────────────────
  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Game Catalog</h1>
        </div>
        <p className="text-slate-400 ml-14">
          Browse, manage and discover your favorite games
        </p>
      </motion.div>

      {/* ── Filters Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                       text-white placeholder-slate-400 focus:outline-none focus:ring-2
                       focus:ring-green-500 text-sm transition-colors"
          />
        </div>

        {/* Genre dropdown */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
                       text-white focus:outline-none focus:ring-2 focus:ring-green-500
                       text-sm appearance-none cursor-pointer transition-colors"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ── Database Error Banner ── */}
      {dbError && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30
                     rounded-xl p-4 mb-6 text-yellow-300"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Database not connected</p>
            <p className="text-xs text-yellow-400/80 mt-0.5">
              Open <code className="bg-yellow-500/20 px-1 rounded">.env.local</code> and
              add your Supabase URL and anon key, then restart the server.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Games Count ── */}
      {!dbError && (
        <p className="text-slate-500 text-sm mb-5">
          {loading ? "Loading..." : `${filteredGames.length} game${filteredGames.length !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* ── Loading Spinner ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400">No games found</h3>
          <p className="text-slate-500 mt-2">
            {search ? `No games match "${search}"` : "Try a different genre filter."}
          </p>
        </motion.div>
      )}

      {/* ── Game Grid ── */}
      {!loading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <GameCard game={game} onDelete={handleDeleteRequest} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <DeleteModal
          gameName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
