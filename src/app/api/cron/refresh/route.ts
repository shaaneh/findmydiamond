import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { fetchAllFeeds } from "@/lib/feeds";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    // TODO (Task 5): fetch live exchange rate and pass here
    const listings = await fetchAllFeeds(0.79);

    if (listings.length === 0) {
      return NextResponse.json({
        status: "ok",
        message: "No new listings from feeds",
        inserted: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const supabase = getSupabase();

    // Upsert by retailer_url to avoid duplicates
    // For listings without unique URLs, use retailer_name + spec as key
    const { data, error } = await supabase
      .from("listings")
      .upsert(listings, {
        onConflict: "retailer_url",
        ignoreDuplicates: false,
      })
      .select("id");

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Database error", detail: error.message },
        { status: 500 }
      );
    }

    // Mark listings older than 7 days as stale (soft delete)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { error: staleError } = await supabase
      .from("listings")
      .delete()
      .lt("created_at", weekAgo.toISOString());

    if (staleError) {
      console.error("Stale cleanup error:", staleError);
    }

    return NextResponse.json({
      status: "ok",
      inserted: data?.length ?? 0,
      staleRemoved: !staleError,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cron refresh error:", err);
    return NextResponse.json(
      { error: "Feed fetch failed" },
      { status: 500 }
    );
  }
}
