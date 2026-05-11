"use client";

/**
 * app/page.tsx — Premium Gaming Homepage
 *
 * Modern gaming catalog with cinematic hero section
 * and horizontal streaming-style game sections
 * Features:
 *  - Cinematic hero banner with featured game
 *  - Horizontal scrolling sections like Netflix/Steam
 *  - Enhanced search with autocomplete
 *  - Premium cards with hover effects
 *  - Smooth animations and transitions
 */

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, AlertCircle, TrendingUp, Clock, Star, Sparkles } from "lucide-react";
import { Game } from "@/lib/supabase";
import GameCard from "@/components/GameCard";
import GameSection from "@/components/GameSection";
import HeroSection from "@/components/HeroSection";
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
  const [searchFocused, setSearchFocused] = useState(false);

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
    setDeleteTarget(game);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/games/${deleteTarget.id}`, { method: "DELETE" });
      setGames((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Search and Filter Logic ───────────────────────────────────
  const filteredGames = useMemo(() => {
    let filtered = games;
    
    // Filter by search term
    if (search) {
      filtered = filtered.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase()) ||
        g.genre.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  }, [games, search]);

  // ── Categorize Games for Sections ─────────────────────────────
  const categorizedGames = useMemo(() => {
    const shuffled = [...filteredGames].sort(() => Math.random() - 0.5);
    
    return {
      trending: shuffled.slice(0, 8),
      recent: shuffled.slice(0, 6),
      topRated: shuffled.slice(2, 10),
      featured: shuffled.slice(1, 9),
    };
  }, [filteredGames]);

  // Get featured game for hero section
  const featuredGame = games.length > 0 ? games[0] : null;

  // ── Search Suggestions ───────────────────────────────────────
  const searchSuggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    
    return filteredGames
      .filter(game => 
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.genre.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);
  }, [search, filteredGames]);

  return (
    <div className="min-h-screen bg-black">
      {/* ── Hero Section ── */}
      <HeroSection featuredGame={featuredGame} loading={loading} />

      {/* ── Enhanced Search Section ── */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Descubra seu <span className="text-gradient">próximo jogo</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Explore milhares de jogos dos mais variados gêneros
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Buscar jogos, gêneros, estúdios..."
                className="w-full pl-12 pr-16 py-4 glass-strong border border-white/10 rounded-2xl
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2
                         focus:ring-purple-500 text-lg transition-all duration-300"
              />
              
              {/* Search Icon Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl
                         bg-gradient-to-r from-purple-500 to-blue-500 text-white
                         hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {searchFocused && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-strong border border-white/10 rounded-2xl overflow-hidden z-50"
                >
                  {searchSuggestions.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                      className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={game.image_url}
                          alt={game.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 
                              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=150&fit=crop";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{game.name}</h4>
                        <p className="text-gray-400 text-sm">{game.genre} • {game.platform}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Genre Filter Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {GENRES.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "glass-strong text-gray-300 hover:bg-white/10"
                }`}
              >
                {genre === "All" ? "Todos" : genre}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Database Error Banner ── */}
      {dbError && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-6 lg:mx-8 mb-8"
        >
          <div className="max-w-7xl mx-auto flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30
                        rounded-xl p-4 text-yellow-300">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Banco de dados não conectado</p>
              <p className="text-xs text-yellow-400/80 mt-0.5">
                Configure o arquivo <code className="bg-yellow-500/20 px-1 rounded">.env.local</code> com as credenciais do Supabase.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
          />
        </div>
      )}

      {/* ── Game Sections ── */}
      {!loading && filteredGames.length > 0 && (
        <div className="space-y-20 px-4 sm:px-6 lg:px-8 pb-20">
          {/* Trending Games */}
          <GameSection
            title={
              <span className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Em Alta
              </span>
            }
            games={categorizedGames.trending}
            onDelete={handleDeleteRequest}
            gradient="purple"
          />

          {/* Recent Releases */}
          <GameSection
            title={
              <span className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-400" />
                Lançamentos
              </span>
            }
            games={categorizedGames.recent}
            onDelete={handleDeleteRequest}
            gradient="blue"
          />

          {/* Top Rated */}
          <GameSection
            title={
              <span className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-400" />
                Mais Bem Avaliados
              </span>
            }
            games={categorizedGames.topRated}
            onDelete={handleDeleteRequest}
            gradient="green"
          />

          {/* Featured Games */}
          <GameSection
            title={
              <span className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-pink-400" />
                Destaques
              </span>
            }
            games={categorizedGames.featured}
            onDelete={handleDeleteRequest}
            gradient="pink"
          />
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredGames.length === 0 && !dbError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 px-4"
        >
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-400">
              {search ? `Nenhum jogo corresponde a "${search}"` : "Tente ajustar os filtros para encontrar jogos."}
            </p>
          </div>
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
