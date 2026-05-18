import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/comments?gameId=X - Get comments for a game
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({ error: "Game ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .select("*, users(username, avatar_url, full_name), comment_likes(user_id)")
      .eq("game_id", gameId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, content } = body;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          user_id: userId,
          game_id: gameId,
          content,
        },
      ])
      .select("*, users(username, avatar_url, full_name)")
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
