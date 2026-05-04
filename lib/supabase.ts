/**
 * lib/supabase.ts
 *
 * This file creates the Supabase client that connects our app to the database.
 * We use the ANON key on the frontend (safe for public use) because
 * Supabase Row Level Security (RLS) controls what users can do.
 */

import { createClient } from "@supabase/supabase-js";

// These values come from the .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export a single shared Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * TypeScript type for a Game object.
 * This matches the columns in our "games" table exactly.
 */
export type Game = {
  id: number;
  name: string;
  genre: string;
  platform: string;
  release_year: number;
  description: string;
  image_url: string;
};
