/**
 * app/api/games/[id]/route.ts
 *
 * Handles PUT (update a game) and DELETE (remove a game) by ID.
 * The [id] in the folder name means Next.js will capture /api/games/123
 * and make 123 available as params.id
 */

import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// ──────────────────────────────────────────────
// PUT /api/games/:id
// Updates an existing game's data
// ──────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;       // Get the game ID from the URL
    const body = await request.json(); // Get the updated fields from the body

    const { data, error } = await supabase
      .from("games")
      .update(body)                    // UPDATE games SET ... WHERE id = id
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/games/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// DELETE /api/games/:id
// Removes a game from the database
// ──────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Get the game ID from the URL

    const { error } = await supabase
      .from("games")
      .delete()                  // DELETE FROM games WHERE id = id
      .eq("id", id);

    if (error) throw error;

    // 204 No Content — success but nothing to return
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/games/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
