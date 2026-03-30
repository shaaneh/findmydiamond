import { NextRequest, NextResponse } from "next/server";
import { calculateFairPrice, rankListings } from "@/lib/fair-price";
import { getListings } from "@/lib/data";
import type { Cut, Color, Clarity, SearchParams } from "@/lib/types";

const VALID_CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const carat = parseFloat(sp.get("carat") || "");
  const cut = sp.get("cut") as Cut;
  const color = sp.get("color") as Color;
  const clarity = sp.get("clarity") as Clarity;
  const budgetStr = sp.get("budget");
  const budget = budgetStr ? parseInt(budgetStr, 10) : undefined;

  // Validate inputs
  if (isNaN(carat) || carat <= 0 || carat > 10) {
    return NextResponse.json({ error: "Invalid carat" }, { status: 400 });
  }
  if (!VALID_CUTS.includes(cut)) {
    return NextResponse.json({ error: "Invalid cut" }, { status: 400 });
  }
  if (!VALID_COLORS.includes(color)) {
    return NextResponse.json({ error: "Invalid color" }, { status: 400 });
  }
  if (!VALID_CLARITIES.includes(clarity)) {
    return NextResponse.json({ error: "Invalid clarity" }, { status: 400 });
  }

  const params: SearchParams = { carat, cut, color, clarity, budget };

  const listings = await getListings();
  const fairPrice = calculateFairPrice(listings, params);
  const ranked = rankListings(listings, params, fairPrice.fairPrice);

  return NextResponse.json({ fairPrice, listings: ranked });
}
