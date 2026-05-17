"use client";

/**
 * app/games/[id]/page.tsx
 *
 * Cinematic game details page
 * Premium experience with hero banner, trailers, screenshots
 * and related games section
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Calendar, 
  Monitor, 
  Gamepad2, 
  Download,
  Share2,
  Heart,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Game } from "@/lib/supabase";
import GameCard from "@/components/GameCard";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);

  const gameId = params.id as string;

  // Mock screenshots for demonstration
  const screenshots = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=1920&h=1080&fit=crop",
  ];

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`);
        if (res.ok) {
          const data = await res.json();
          setGame(data);
          
          // Fetch related games (same genre)
          const relatedRes = await fetch(`/api/games?genre=${encodeURIComponent(data.genre)}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedGames(relatedData.filter((g: Game) => g.id !== data.id).slice(0, 6));
          }
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error("Failed to fetch game:", err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId, router]);

  const handlePlayTrailer = () => {
    setIsTrailerPlaying(true);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!game) {
    return null;
  }

  const videoId = game.trailer_url ? getYouTubeVideoId(game.trailer_url) : null;

  return (
    <div className="min-h-screen bg-black">
      {/* ── Hero Banner ── */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
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
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-4 sm:left-8 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 glass-strong rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <span className="text-white font-medium">Voltar</span>
          </motion.button>
        </motion.div>

        {/* Game Info */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Game Details */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Genre Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong border border-white/30">
                  <Gamepad2 className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{game.genre}</span>
                </div>

                {/* Game Title */}
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  {game.name}
                </h1>

                {/* Studio */}
                {game.studios && (
                  <p className="text-lg text-gray-300 font-medium">
                    {game.studios.name}
                  </p>
                )}

                {/* Game Description */}
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
                  {game.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold text-lg">4.5</span>
                    </div>
                    <span className="text-gray-400">Excelente</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">{game.release_year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Monitor className="w-5 h-5" />
                    <span className="text-lg">{game.platform}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {videoId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayTrailer}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white to-gray-300 text-black rounded-xl font-semibold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300"
                    >
                      <Play className="w-6 h-6" />
                      Assistir Trailer
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 glass-strong text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <Download className="w-6 h-6" />
                    Baixar
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 glass-strong text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <Heart className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 glass-strong text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <Share2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Column - Game Cover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative hidden lg:block"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-400/10 rounded-3xl blur-3xl" />
                  
                  {/* Game Cover */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative glass-strong rounded-3xl p-8 border border-white/10"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-gray-400/5">
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
          </div>
        </div>
      </section>

      {/* ── Screenshots Gallery ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Capturas de <span className="text-gradient">Tela</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Explore os visuais impressionantes do jogo
            </p>
          </motion.div>

          {/* Main Screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-2xl overflow-hidden mb-6 glass-strong border border-white/10"
          >
            <Image
              src={screenshots[activeScreenshot]}
              alt={`Screenshot ${activeScreenshot + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            
            {/* Play Button Overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center"
              onClick={() => setIsTrailerPlaying(true)}
            >
              <div className="p-6 rounded-full glass-strong border border-white/20 hover:bg-white/10 transition-all duration-300">
                <Play className="w-8 h-8 text-white" />
              </div>
            </motion.button>
          </motion.div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {screenshots.map((screenshot, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveScreenshot(index)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  activeScreenshot === index 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-transparent hover:border-white/30'
                }`}
              >
                <Image
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Games ── */}
      {relatedGames.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Jogos <span className="text-gradient">Relacionados</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Descubra mais jogos como {game.name}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGames.map((relatedGame) => (
                <motion.div
                  key={relatedGame.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <GameCard 
                    game={relatedGame} 
                    onDelete={() => {}} // Empty function for read-only view
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Trailer Modal ── */}
      <AnimatePresence>
        {isTrailerPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsTrailerPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                {videoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="Game Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-white mb-4 mx-auto" />
                      <p className="text-white text-lg">Trailer não disponível</p>
                      <p className="text-gray-400 text-sm mt-2">Click outside to close</p>
                    </div>
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={() => setIsTrailerPlaying(false)}
                  className="absolute top-4 right-4 p-2 rounded-full glass-strong border border-white/20 hover:bg-white/10 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-white rotate-45" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
