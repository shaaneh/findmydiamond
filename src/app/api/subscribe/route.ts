import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const VALID_CUTS = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, shape, carat, cut, color, clarity, target_price_gbp, gdpr_consent } =
    body as Record<string, unknown>;

  if (!email || typeof email !== "string" || !gdpr_consent) {
    return NextResponse.json({ error: "Email and consent required" }, { status: 400 });
  }

  // Stricter email validation
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Validate optional fields to prevent injection of arbitrary data
  const safeShape = shape === "Round" ? "Round" : "Round";
  const safeCarat = typeof carat === "number" && carat > 0 && carat <= 10 ? carat : 1.0;
  const safeCut = typeof cut === "string" && VALID_CUTS.includes(cut) ? cut : "Very Good";
  const safeColor = typeof color === "string" && VALID_COLORS.includes(color) ? color : "G";
  const safeClarity =
    typeof clarity === "string" && VALID_CLARITIES.includes(clarity) ? clarity : "VS1";
  const safeTargetPrice =
    typeof target_price_gbp === "number" && target_price_gbp > 0 && target_price_gbp < 1_000_000
      ? Math.round(target_price_gbp)
      : null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const { error } = await supabase.from("email_signups").insert({
      email: email.trim().toLowerCase(),
      shape: safeShape,
      carat: safeCarat,
      cut: safeCut,
      color: safeColor,
      clarity: safeClarity,
      target_price_gbp: safeTargetPrice,
      gdpr_consent: true,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  } else {
    console.log("Email signup (demo mode):", { email: email.trim().toLowerCase() });
  }

  return NextResponse.json({ success: true });
}
