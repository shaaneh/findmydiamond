import type {
  Listing,
  SearchParams,
  FairPriceResult,
  ListingWithDelta,
  Cut,
} from "./types";

/**
 * Fair-price algorithm (MVP):
 * - Median price per bucket (carat range + cut tier + colour + clarity)
 * - Carat floored to nearest 0.25
 * - Cut collapsed to 2 tiers: Excellent/Very Good vs Good/Fair
 * - Widening: if < 3 listings, widen carat by +/-0.25, then +/-0.50
 * - Never widen cut, colour, or clarity
 */

type CutTier = "high" | "low";

function getCutTier(cut: Cut): CutTier {
  return cut === "Excellent" || cut === "Very Good" ? "high" : "low";
}

function floorCarat(carat: number): number {
  return Math.floor(carat / 0.25) * 0.25;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function filterBucket(
  listings: Listing[],
  caratFloor: number,
  caratRange: number,
  cutTier: CutTier,
  color: string,
  clarity: string
): Listing[] {
  return listings.filter((l) => {
    const lFloor = floorCarat(l.carat);
    if (lFloor < caratFloor - caratRange || lFloor > caratFloor + caratRange)
      return false;
    if (getCutTier(l.cut) !== cutTier) return false;
    if (l.color !== color) return false;
    if (l.clarity !== clarity) return false;
    return true;
  });
}

export function calculateFairPrice(
  listings: Listing[],
  params: SearchParams
): FairPriceResult {
  const caratFloor = floorCarat(params.carat);
  const cutTier = getCutTier(params.cut);

  // Try exact bucket first, then widen carat
  for (const range of [0, 0.25, 0.5]) {
    const bucket = filterBucket(
      listings,
      caratFloor,
      range,
      cutTier,
      params.color,
      params.clarity
    );

    if (bucket.length >= 3) {
      const prices = bucket.map((l) => l.price_gbp);
      const fairPrice = median(prices);
      const low = Math.min(...prices);
      const high = Math.max(...prices);
      return {
        fairPrice,
        low,
        high,
        isLimitedData: range > 0,
        noData: false,
      };
    }
  }

  return {
    fairPrice: null,
    low: null,
    high: null,
    isLimitedData: false,
    noData: true,
  };
}

export function rankListings(
  listings: Listing[],
  params: SearchParams,
  fairPrice: number | null
): ListingWithDelta[] {
  // Filter listings that match the search (same widening logic)
  const caratFloor = floorCarat(params.carat);
  const cutTier = getCutTier(params.cut);

  let matched: Listing[] = [];
  for (const range of [0, 0.25, 0.5]) {
    matched = filterBucket(
      listings,
      caratFloor,
      range,
      cutTier,
      params.color,
      params.clarity
    );
    if (matched.length > 0) break;
  }

  // Apply budget filter
  if (params.budget) {
    matched = matched.filter((l) => l.price_gbp <= params.budget!);
  }

  // Add delta
  const withDelta: ListingWithDelta[] = matched.map((l) => ({
    ...l,
    deltaPercent: fairPrice
      ? Math.round(((l.price_gbp - fairPrice) / fairPrice) * 100)
      : null,
  }));

  // Sort: best deals first (most below fair), then smallest markup
  withDelta.sort((a, b) => {
    if (a.deltaPercent === null && b.deltaPercent === null) return a.price_gbp - b.price_gbp;
    if (a.deltaPercent === null) return 1;
    if (b.deltaPercent === null) return -1;
    return a.deltaPercent - b.deltaPercent;
  });

  return withDelta;
}
