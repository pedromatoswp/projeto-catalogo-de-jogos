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

    console.log('PUT /api/games/:id - Updating game:', id, 'with body:', body);

    const { data, error } = await supabase
      .from("games")
      .update(body)                    // UPDATE games SET ... WHERE id = id
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully updated game:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/games/:id error:", error);
    return NextResponse.json(
      { error: "Failed to update game", details: error instanceof Error ? error.message : String(error) },
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

    console.log('DELETE /api/games/:id - Deleting game:', id);

    const { error } = await supabase
      .from("games")
      .delete()                  // DELETE FROM games WHERE id = id
      .eq("id", id);

    if (error) {
      console.error('Supabase delete error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Successfully deleted game:', id);

    // 204 No Content — success but nothing to return
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/games/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete game", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
