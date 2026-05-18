import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/library - Get user's library
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let query = supabase
      .from("user_library")
      .select("*, games(*)")
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("GET /api/library error:", error);
    return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 });
  }
}

// POST /api/library - Add game to library
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, gameId, status } = body;

    const { data, error } = await supabase
      .from("user_library")
      .upsert([
        {
          user_id: userId,
          game_id: gameId,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/library error:", error);
    return NextResponse.json({ error: "Failed to add to library" }, { status: 500 });
  }
}

// PUT /api/library - Update library item status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from("user_library")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/library error:", error);
    return NextResponse.json({ error: "Failed to update library" }, { status: 500 });
  }
}

// DELETE /api/library - Remove game from library
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const { error } = await supabase.from("user_library").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/library error:", error);
    return NextResponse.json({ error: "Failed to remove from library" }, { status: 500 });
  }
}
