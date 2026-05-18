"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: number;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (currentUser) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [currentUser, userId]);

  const checkFollowStatus = async () => {
    try {
      setChecking(true);
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUser?.id)
        .eq("following_id", userId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", userId);
        setIsFollowing(false);
      } else {
        await supabase.from("follows").insert([
          {
            follower_id: currentUser.id,
            following_id: userId,
          },
        ]);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checking || !currentUser || currentUser.id === userId) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isFollowing
          ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
          : "bg-gradient-to-r from-white to-gray-300 text-black hover:shadow-lg hover:shadow-white/25"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          Seguindo
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Seguir
        </>
      )}
    </motion.button>
  );
}
