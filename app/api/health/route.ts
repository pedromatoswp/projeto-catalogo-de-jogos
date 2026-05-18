import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Health check - Testing Supabase connection...');

    // Test basic connection
    const { data, error } = await supabase
      .from('games')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Health check failed:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase connection failed',
          error: error.message,
          details: error
        },
        { status: 500 }
      );
    }

    console.log('Health check passed - Supabase is connected');

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check exception:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
