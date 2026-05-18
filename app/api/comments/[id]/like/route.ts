import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST /api/comments/:id/like - Like a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    const { data, error } = await supabase
      .from("comment_likes")
      .insert([
        {
          comment_id: parseInt(id),
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments/:id/like error:", error);
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
  }
}

// DELETE /api/comments/:id/like - Unlike a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/comments/:id/like error:", error);
    return NextResponse.json({ error: "Failed to unlike comment" }, { status: 500 });
  }
}
