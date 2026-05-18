"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BookOpen, CheckCircle, PlayCircle, XCircle } from "lucide-react";

interface LibraryButtonProps {
  gameId: number;
}

export default function LibraryButton({ gameId }: LibraryButtonProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<"playing" | "completed" | "want_to_play" | "abandoned" | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToLibrary = async (newStatus: "playing" | "completed" | "want_to_play" | "abandoned") => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_library")
        .upsert([
          {
            user_id: user.id,
            game_id: gameId,
            status: newStatus,
          },
        ])
        .select()
        .single();

      if (!error) {
        setStatus(newStatus);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding to library:", error);
    }
  };

  const handleRemoveFromLibrary = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_library")
        .delete()
        .eq("user_id", user.id)
        .eq("game_id", gameId);

      if (!error) {
        setStatus(null);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error removing from library:", error);
    }
  };

  if (!user) return null;

  const statusConfig = {
    playing: { icon: PlayCircle, label: "Jogando", color: "text-green-400" },
    completed: { icon: CheckCircle, label: "Zerado", color: "text-blue-400" },
    want_to_play: { icon: BookOpen, label: "Quero Jogar", color: "text-yellow-400" },
    abandoned: { icon: XCircle, label: "Abandonado", color: "text-red-400" },
  };

  const currentStatus = status ? statusConfig[status] : null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          currentStatus
            ? "bg-white/10 border border-white/20 text-white"
            : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
        }`}
      >
        {currentStatus ? (
          <>
            <currentStatus.icon className={`w-4 h-4 ${currentStatus.color}`} />
            {currentStatus.label}
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4" />
            Adicionar à Biblioteca
          </>
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 w-48 glass-strong rounded-lg border border-white/10 overflow-hidden z-50"
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleAddToLibrary(key as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-all ${
                status === key ? "bg-white/10" : ""
              }`}
            >
              <config.icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-white text-sm">{config.label}</span>
            </button>
          ))}
          {status && (
            <>
              <div className="border-t border-white/10" />
              <button
                onClick={handleRemoveFromLibrary}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-all text-red-400"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Remover</span>
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
