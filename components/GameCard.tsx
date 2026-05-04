"use client";

/**
 * components/GameCard.tsx
 *
 * Displays a single game with its image, name, genre, platform,
 * and action buttons (Edit / Delete).
 * Uses Framer Motion for smooth hover animation.
 */

import { motion } from "framer-motion";
import { Pencil, Trash2, Star, Calendar, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/supabase";

// ── Color map: each genre gets its own badge color ──────────────
const genreColors: Record<string, string> = {
  FPS: "bg-red-500/20 text-red-400 border border-red-500/30",
  Sports: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "Battle Royale": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Metroidvania: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Sandbox: "bg-green-500/20 text-green-400 border border-green-500/30",
  "Action/Adventure": "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

const getGenreColor = (genre: string) =>
  genreColors[genre] ?? "bg-slate-500/20 text-slate-400 border border-slate-500/30";

// ── Props ────────────────────────────────────────────────────────
type GameCardProps = {
  game: Game;
  onDelete: (id: number) => void; // Called when Delete is clicked
};

export default function GameCard({ game, onDelete }: GameCardProps) {
  return (
    // motion.div adds the hover scale/glow animation
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700
                 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10
                 flex flex-col transition-shadow"
    >
      {/* ── Game Image ── */}
      <div className="relative h-48 bg-slate-700 overflow-hidden">
        <Image
          src={game.image_url}
          alt={game.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={(e) => {
            // Fallback if the image fails to load
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x240/1E293B/22C55E?text=No+Image";
          }}
        />
        {/* Genre badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${getGenreColor(game.genre)}`}>
            {game.genre}
          </span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Game Name */}
        <h2 className="text-lg font-bold text-white mb-1 line-clamp-1">{game.name}</h2>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1">
            <Monitor className="w-3 h-3" /> {game.platform}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {game.release_year}
          </span>
        </div>

        {/* Relational data: Studio */}
        {game.studios && (
          <p className="text-xs text-indigo-400 font-semibold mb-3">
            By {game.studios.name}
          </p>
        )}

        {/* Description — limited to 2 lines */}
        <p className="text-sm text-slate-400 line-clamp-2 flex-1">{game.description}</p>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-4">
          {/* Edit → navigates to /games/edit/[id] */}
          <Link
            href={`/games/edit/${game.id}`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg
                       bg-blue-500/10 text-blue-400 border border-blue-500/30
                       hover:bg-blue-500/20 transition-colors text-sm font-medium"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>

          {/* Delete → calls onDelete callback */}
          <button
            onClick={() => onDelete(game.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg
                       bg-red-500/10 text-red-400 border border-red-500/30
                       hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
