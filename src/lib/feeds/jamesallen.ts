import type { FeedResult } from "./index";
import type { Cut, Color, Clarity, CertificationBody } from "../types";

const VALID_CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

const USD_TO_GBP = 0.79;

/**
 * James Allen feed adapter.
 *
 * When a ShareASale feed URL is configured (JAMESALLEN_FEED_URL env var),
 * this fetches real data. Otherwise, returns empty.
 *
 * Feed format expected: JSON array with fields:
 * carat, cut, color, clarity, price, certification, link
 */
export async function fetchJamesAllenFeed(): Promise<FeedResult[]> {
  const feedUrl = process.env.JAMESALLEN_FEED_URL;
  if (!feedUrl) return [];

  try {
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "findmydiamond-bot/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`James Allen feed returned ${res.status}`);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("James Allen feed: expected array");
      return [];
    }

    const listings: FeedResult[] = [];

    for (const item of data) {
      const cut = normalizeCut(item.cut);
      const color = item.color?.toUpperCase?.() as Color;
      const clarity = item.clarity?.toUpperCase?.() as Clarity;
      const carat = parseFloat(item.carat);
      const priceUsd = parseFloat(item.price);
      const cert = (item.certification?.toUpperCase?.() || "IGI") as CertificationBody;

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
        retailer_name: "James Allen",
        certification_body: cert === "GIA" ? "GIA" : "IGI",
        retailer_url: item.link || null,
        shape: "Round",
      });
    }

    return listings;
  } catch (err) {
    console.error("James Allen feed error:", err);
    return [];
  }
}

function normalizeCut(raw: string): Cut | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  for (const cut of VALID_CUTS) {
    if (cut.toLowerCase() === lower) return cut;
  }
  if (lower === "true hearts" || lower === "ideal") return "Excellent";
  return null;
}
