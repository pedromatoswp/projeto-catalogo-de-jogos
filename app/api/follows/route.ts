import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST /api/follows - Follow a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { followerId, followingId } = body;

    const { data, error } = await supabase
      .from("follows")
      .insert([
        {
          follower_id: followerId,
          following_id: followingId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/follows error:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}

// DELETE /api/follows - Unfollow a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get("followerId");
    const followingId = searchParams.get("followingId");

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Both followerId and followingId required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/follows error:", error);
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}
