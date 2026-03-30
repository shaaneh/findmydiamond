import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, shape, carat, cut, color, clarity, target_price_gbp, gdpr_consent } = body;

  if (!email || !gdpr_consent) {
    return NextResponse.json({ error: "Email and consent required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase.from("email_signups").insert({
      email,
      shape: shape || "Round",
      carat: carat || 1.0,
      cut: cut || "Very Good",
      color: color || "G",
      clarity: clarity || "VS1",
      target_price_gbp: target_price_gbp || null,
      gdpr_consent: true,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  } else {
    console.log("Email signup (demo mode):", { email, shape, carat, cut, color, clarity, target_price_gbp });
  }

  return NextResponse.json({ success: true });
}
