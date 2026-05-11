"use client";

/**
 * components/GameSection.tsx
 *
 * Horizontal scrolling section for games
 * Inspired by Netflix/Steam horizontal carousels
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";
import { Game } from "@/lib/supabase";

type GameSectionProps = {
  title: React.ReactNode;
  games: Game[];
  onDelete: (id: number) => void;
  gradient?: "purple" | "blue" | "green" | "pink";
};

const gradients = {
  purple: "from-purple-500/20 to-purple-500/5",
  blue: "from-blue-500/20 to-blue-500/5",
  green: "from-green-500/20 to-green-500/5",
  pink: "from-pink-500/20 to-pink-500/5",
};

export default function GameSection({ 
  title, 
  games, 
  onDelete, 
  gradient = "purple" 
}: GameSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (games.length === 0) return null;

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className={`h-1 w-12 bg-gradient-to-r ${gradients[gradient]} rounded-full`} />
          <h2 className="text-2xl lg:text-3xl font-bold text-white">{title}</h2>
        </motion.div>
        
        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("left")}
            className="p-2 rounded-lg glass-strong border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll("right")}
            className="p-2 rounded-lg glass-strong border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none" />
        
        {/* Game Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-none w-80"
            >
              <GameCard game={game} onDelete={onDelete} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm text-gray-400">Arraste para ver mais jogos →</p>
      </div>
    </section>
  );
}
