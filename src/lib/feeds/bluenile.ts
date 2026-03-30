import type { FeedResult } from "./index";
import type { Cut, Color, Clarity, CertificationBody } from "../types";

const VALID_CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

const USD_TO_GBP = 0.79;

/**
 * Blue Nile feed adapter.
 *
 * When a CJ Affiliate feed URL is configured (BLUENILE_FEED_URL env var),
 * this fetches real data. Otherwise, returns empty to fall back on sample data.
 *
 * Feed format expected: CSV or JSON with columns:
 * sku, carat, cut, color, clarity, price, cert, url
 */
export async function fetchBluenileFeed(): Promise<FeedResult[]> {
  const feedUrl = process.env.BLUENILE_FEED_URL;
  if (!feedUrl) return [];

  try {
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "findmydiamond-bot/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`Blue Nile feed returned ${res.status}`);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Blue Nile feed: expected array");
      return [];
    }

    const listings: FeedResult[] = [];

    for (const item of data) {
      const cut = normalizeCut(item.cut);
      const color = item.color?.toUpperCase?.() as Color;
      const clarity = item.clarity?.toUpperCase?.() as Clarity;
      const carat = parseFloat(item.carat);
      const priceUsd = parseFloat(item.price);
      const cert = (item.cert?.toUpperCase?.() || "GIA") as CertificationBody;

      if (
        !cut || !VALID_COLORS.includes(color) ||
        !VALID_CLARITIES.includes(clarity) ||
        isNaN(carat) || carat <= 0 || carat > 10 ||
        isNaN(priceUsd) || priceUsd <= 0
      ) {
        continue;
      }

      listings.push({
        carat,
        cut,
        color,
        clarity,
        price_gbp: Math.round(priceUsd * USD_TO_GBP),
        retailer_name: "Blue Nile",
        certification_body: cert === "IGI" ? "IGI" : "GIA",
        retailer_url: item.url || null,
        shape: "Round",
        diamond_type: "natural",
        symmetry: null,
        polish: null,
        fluorescence: null,
      });
    }

    return listings;
  } catch (err) {
    console.error("Blue Nile feed error:", err);
    return [];
  }
}

function normalizeCut(raw: string): Cut | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  for (const cut of VALID_CUTS) {
    if (cut.toLowerCase() === lower) return cut;
  }
  if (lower === "ideal" || lower === "super ideal") return "Excellent";
  return null;
}
