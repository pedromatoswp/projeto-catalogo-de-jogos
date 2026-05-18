import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Log connection details for debugging (remove in production)
if (typeof window === 'undefined') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key present:', !!supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
});

// Studio type
export type Studio = {
  id: number;
  name: string;
  country?: string;
};

// Game type
export type Game = {
  id: number;
  name: string;
  genre: string;
  platform: string;
  release_year: number;
  description: string;
  image_url: string;
  trailer_url?: string | null;
  studio_id?: number | null;
  studios?: { name: string } | null;
};

// User type
export type User = {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

// User Library type
export type UserLibrary = {
  id: number;
  user_id: number;
  game_id: number;
  status: "playing" | "completed" | "want_to_play" | "abandoned";
  added_at?: string;
  games?: Game;
};

// Comment type
export type Comment = {
  id: number;
  user_id: number;
  game_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
  users?: User;
  comment_likes?: CommentLike[];
};

// Comment Like type
export type CommentLike = {
  id: number;
  comment_id: number;
  user_id: number;
  created_at?: string;
};

// Follow type
export type Follow = {
  id: number;
  follower_id: number;
  following_id: number;
  created_at?: string;
};

// List type
export type GameList = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
  users?: User;
  list_games?: ListGame[];
  list_likes?: ListLike[];
};

// List Game type
export type ListGame = {
  id: number;
  list_id: number;
  game_id: number;
  added_at?: string;
  games?: Game;
};

// List Like type
export type ListLike = {
  id: number;
  list_id: number;
  user_id: number;
  created_at?: string;
};

// Review type
export type Review = {
  id: number;
  user_id: number;
  game_id: number;
  overall_rating: number;
  gameplay_rating?: number;
  story_rating?: number;
  graphics_rating?: number;
  sound_rating?: number;
  multiplayer_rating?: number;
  fun_rating?: number;
  content?: string;
  created_at?: string;
  updated_at?: string;
  users?: User;
};

// Achievement type
export type Achievement = {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  badge_color?: string;
};

// User Achievement type
export type UserAchievement = {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at?: string;
  achievements?: Achievement;
};

// Activity type
export type Activity = {
  id: number;
  user_id: number;
  type: string;
  content?: string;
  game_id?: number;
  list_id?: number;
  created_at?: string;
  users?: User;
  games?: Game;
  lists?: GameList;
};

// Game Screenshot type
export type GameScreenshot = {
  id: number;
  game_id: number;
  image_url: string;
  order_num?: number;
};