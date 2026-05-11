"use client";

/**
 * components/HeroSection.tsx
 *
 * Cinematic hero section with featured game
 * Inspired by Steam and Netflix hero banners
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Star, Calendar, Gamepad2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Game } from "@/lib/supabase";

type HeroSectionProps = {
  featuredGame?: Game | null;
  loading?: boolean;
};

export default function HeroSection({ featuredGame, loading }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Default featured game if none provided
  const defaultGame = {
    id: 0,
    name: "Cyberpunk 2077",
    description: "Entre na Night City, uma megalópole obcecada por poder, glamour e modificação corporal. Você é V, um mercenário fora da lei em busca de um implante único que é a chave para a imortalidade.",
    genre: "RPG",
    platform: "PC",
    release_year: 2020,
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
    rating: 4.5,
    studios: { name: "CD Projekt Red" }
  };

  const game = featuredGame || defaultGame;

  const handlePlayTrailer = () => {
    setIsPlaying(true);
    // In a real app, this would open a video modal or play the trailer
    console.log("Playing trailer for:", game.name);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={game.image_url}
          alt={game.name}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = 
              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop";
          }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Column - Game Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Genre Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong border border-purple-500/30"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">{game.genre}</span>
            </motion.div>

            {/* Game Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              {game.name}
            </motion.h1>

            {/* Game Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-gray-300 leading-relaxed max-w-lg"
            >
              {game.description}
            </motion.p>

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{'rating' in game ? game.rating : 4.5}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">Excelente</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>{game.release_year}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-300">
                <Gamepad2 className="w-4 h-4" />
                <span>{game.platform}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayTrailer}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                Assistir Trailer
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 glass-strong text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
                Mais Informações
              </motion.button>
            </motion.div>

            {/* Studio Info */}
            {game.studios && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-sm text-gray-400 pt-2"
              >
                Desenvolvido por <span className="text-white font-medium">{game.studios.name}</span>
              </motion.p>
            )}
          </motion.div>

          {/* Right Column - Featured Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              
              {/* Game Cover */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="relative glass-strong rounded-3xl p-8 border border-white/10"
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <Image
                    src={game.image_url}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-sm">Role para explorar</span>
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
