"use client";

/**
 * components/GameCard.tsx
 *
 * Premium game card with modern hover effects
 * Cinematic design with glassmorphism and gradient accents
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Star, Calendar, Monitor, Play, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/supabase";

// ── Enhanced Color map with cyberpunk aesthetics ──────────────
const genreColors: Record<string, { bg: string; text: string; border: string }> = {
  FPS: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  Sports: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  "Battle Royale": { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  Metroidvania: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  Sandbox: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  "Action/Adventure": { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  RPG: { bg: "bg-indigo-500/20", text: "text-indigo-400", border: "border-indigo-500/30" },
  Strategy: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
  Puzzle: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
};

const getGenreColor = (genre: string) =>
  genreColors[genre] ?? { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" };

// ── Props ────────────────────────────────────────────────────────
type GameCardProps = {
  game: Game;
  onDelete: (id: number) => void;
};

export default function GameCard({ game, onDelete }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const genreColor = getGenreColor(game.genre);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card-premium group cursor-pointer"
    >
      {/* ── Game Image with Overlay ── */}
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        <Image
          src={game.image_url}
          alt={game.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop";
          }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-70'
        }`} />
        
        {/* Play Button Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0.8 
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full glass-strong border border-white/20 hover:bg-white/10 transition-all duration-200"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.button>
        </motion.div>
        
        {/* Genre Badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${genreColor.bg} ${genreColor.text} ${genreColor.border} border`}>
            {game.genre}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full glass-strong border border-yellow-500/30">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-yellow-400">4.5</span>
          </div>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-6 space-y-4">
        {/* Game Title */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-gradient transition-all duration-300">
            {game.name}
          </h3>
          
          {/* Studio */}
          {game.studios && (
            <p className="text-sm text-purple-400 font-medium">
              {game.studios.name}
            </p>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-4 h-4" />
            <span>{game.platform}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{game.release_year}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {/* View Details */}
          <Link
            href={`/games/${game.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                     bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                     border border-purple-500/30
                     text-purple-300 font-medium text-sm
                     hover:from-purple-500/30 hover:to-blue-500/30 
                     transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            Ver
          </Link>

          {/* Edit */}
          <Link
            href={`/games/edit/${game.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                     glass-strong border border-white/20
                     text-white font-medium text-sm
                     hover:bg-white/10 transition-all duration-300"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>

          {/* Delete */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(game.id)}
            className="px-4 py-2.5 rounded-lg
                     bg-red-500/10 border border-red-500/30
                     text-red-400 font-medium text-sm
                     hover:bg-red-500/20 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
