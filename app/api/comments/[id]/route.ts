import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/comments/:id - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/comments/:id error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
