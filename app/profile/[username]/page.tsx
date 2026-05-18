"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, UserLibrary, Game } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Calendar, Gamepad2, Users, Heart, BookOpen, Settings } from "lucide-react";
import FollowButton from "@/components/FollowButton";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<UserLibrary[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"playing" | "completed" | "want_to_play" | "abandoned">("playing");

  const username = params.username as string;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Fetch user by username
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (userError || !user) {
        router.push("/");
        return;
      }

      setProfileUser(user);

      // Fetch user library
      const { data: libraryData } = await supabase
        .from("user_library")
        .select("*, games(*)")
        .eq("user_id", user.id);

      if (libraryData) {
        setLibrary(libraryData);
      }

      // Fetch followers count
      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);

      if (followers !== null) setFollowersCount(followers);

      // Fetch following count
      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

      if (following !== null) setFollowingCount(following);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLibrary = library.filter((item) => item.status === activeTab);

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

  if (!profileUser) return null;

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-black">
      {/* Profile Header */}
      <div className="relative h-64 bg-gradient-to-br from-white/10 to-gray-400/10">
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-300 p-1">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              {profileUser.avatar_url ? (
                <img
                  src={profileUser.avatar_url}
                  alt={profileUser.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {profileUser.username[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-6">
            <h1 className="text-4xl font-bold text-white">{profileUser.username}</h1>
            {profileUser.full_name && (
              <p className="text-xl text-gray-300 mt-1">{profileUser.full_name}</p>
            )}
            {profileUser.bio && (
              <p className="text-gray-400 mt-4 max-w-2xl">{profileUser.bio}</p>
            )}

            {/* Stats */}
            <div className="flex gap-8 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{library.length}</p>
                <p className="text-sm text-gray-400">Jogos na Biblioteca</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{followersCount}</p>
                <p className="text-sm text-gray-400">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{followingCount}</p>
                <p className="text-sm text-gray-400">Seguindo</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              {!isOwnProfile && <FollowButton userId={profileUser.id} />}
              {isOwnProfile && (
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  <Settings className="w-4 h-4" />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Library Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="flex gap-2 border-b border-white/10 pb-4">
            {[
              { id: "playing" as const, label: "Jogando", icon: Gamepad2 },
              { id: "completed" as const, label: "Zerados", icon: Heart },
              { id: "want_to_play" as const, label: "Quero Jogar", icon: BookOpen },
              { id: "abandoned" as const, label: "Abandonados", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className="text-sm opacity-70">
                  {library.filter((item) => item.status === tab.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {filteredLibrary.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  {item.games?.image_url && (
                    <img
                      src={item.games.image_url}
                      alt={item.games.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {item.games?.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLibrary.length === 0 && (
            <div className="text-center py-16">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum jogo nesta categoria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
