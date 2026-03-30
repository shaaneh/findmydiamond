import { NextRequest, NextResponse } from "next/server";
import { calculateFairPrice, rankListings } from "@/lib/fair-price";
import { getListings } from "@/lib/data";
import type { Cut, Color, Clarity, DiamondType, CertificationBody, SearchParams, FairPriceResult, ListingWithDelta, Listing } from "@/lib/types";
import { ALL_CERT_LABS } from "@/lib/types";

const VALID_CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const VALID_DIAMOND_TYPES = ["all", "natural", "lab-grown"];

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const carat = parseFloat(sp.get("carat") || "");
  const cut = sp.get("cut") as Cut;
  const color = sp.get("color") as Color;
  const clarity = sp.get("clarity") as Clarity;
  const budgetStr = sp.get("budget");
  const budget = budgetStr ? parseInt(budgetStr, 10) : undefined;
  const diamondType = (sp.get("diamondType") || "all") as DiamondType | "all";
  const certLabsParam = sp.get("certLabs");
  const certLabs = certLabsParam
    ? (certLabsParam.split(",").filter((l) => ALL_CERT_LABS.includes(l as CertificationBody)) as CertificationBody[])
    : [...ALL_CERT_LABS];

  // Validate inputs
  if (budget !== undefined && (isNaN(budget) || budget <= 0 || budget > 1_000_000)) {
    return NextResponse.json({ error: "Invalid budget" }, { status: 400 });
  }
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
  if (!VALID_DIAMOND_TYPES.includes(diamondType)) {
    return NextResponse.json({ error: "Invalid diamondType" }, { status: 400 });
  }
  if (certLabs.length === 0) {
    return NextResponse.json({ error: "At least one cert lab required" }, { status: 400 });
  }

  const params: SearchParams = { carat, cut, color, clarity, budget, diamondType, certLabs };
  const listings = await getListings({ diamondType, certLabs });

  if (diamondType === "all") {
    const naturalListings = listings.filter((l) => l.diamond_type === "natural");
    const labListings = listings.filter((l) => l.diamond_type === "lab-grown");

    const naturalFairPrice = calculateFairPrice(naturalListings, params);
    const labFairPrice = calculateFairPrice(labListings, params);

    const rankedListings = rankListingsByType(listings, params, naturalFairPrice, labFairPrice);

    return NextResponse.json({
      fairPrice: naturalFairPrice,
      labFairPrice,
      listings: rankedListings,
    });
  }

  const fairPrice = calculateFairPrice(listings, params);
  const rankedListings = rankListings(listings, params, fairPrice.fairPrice);

  return NextResponse.json({
    fairPrice,
    labFairPrice: null,
    listings: rankedListings,
  });
}

function rankListingsByType(
  listings: Listing[],
  params: SearchParams,
  naturalFairPrice: FairPriceResult,
  labFairPrice: FairPriceResult
): ListingWithDelta[] {
  return listings
    .map((l) => {
      const refPrice =
        l.diamond_type === "natural"
          ? naturalFairPrice.fairPrice
          : labFairPrice.fairPrice;
      const deltaPercent = refPrice
        ? Math.round(((l.price_gbp - refPrice) / refPrice) * 100)
        : null;
      return { ...l, deltaPercent };
    })
    .filter((l) => !params.budget || l.price_gbp <= params.budget)
    .sort((a, b) => (a.deltaPercent ?? 999) - (b.deltaPercent ?? 999));
}
