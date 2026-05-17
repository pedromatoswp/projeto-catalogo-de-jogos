import { createClient } from "@supabase/supabase-js";

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate variables
if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

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