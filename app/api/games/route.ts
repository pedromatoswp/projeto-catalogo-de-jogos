/**
 * app/api/games/route.ts
 *
 * Handles GET (list all games) and POST (create a new game).
 * These are called by the frontend using fetch().
 */

import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────
// GET /api/games
// Returns all games, optionally filtered by genre
// ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre"); // e.g. ?genre=FPS

    // Build the query
    let query = supabase
      .from("games")
      .select("*")
      .order("id", { ascending: true });

    // If a genre filter was passed, add a WHERE clause
    if (genre && genre !== "All") {
      query = query.eq("genre", genre);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Return the list of games as JSON (always an array)
    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("GET /api/games error:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// POST /api/games
// Creates a new game from the request body
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the JSON body

    // Insert the new game into the database
    const { data, error } = await supabase
      .from("games")
      .insert([body]) // body contains: name, genre, platform, release_year, description, image_url
      .select()
      .single();

    if (error) throw error;

    // Return the newly created game with status 201 (Created)
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/games error:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
