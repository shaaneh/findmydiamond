import type { FeedResult } from "./index";
import type { Cut, Color, Clarity, CertificationBody, Symmetry, Polish, Fluorescence } from "../types";
import { ALL_CERT_LABS } from "../types";

const VALID_CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const VALID_CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const VALID_GRADES = ["Excellent", "Very Good", "Good", "Fair"];
const VALID_FLUORESCENCE = ["None", "Faint", "Medium", "Strong", "Very Strong"];
const CERT_LAB_SET = new Set(ALL_CERT_LABS);

/**
 * James Allen feed adapter.
 *
 * When a ShareASale feed URL is configured (JAMESALLEN_FEED_URL env var),
 * this fetches real data. Otherwise, returns empty.
 *
 * Feed format expected: JSON array with fields:
 * carat, cut, color, clarity, price, certification, link
 */
export async function fetchJamesAllenFeed(usdToGbp: number): Promise<FeedResult[]> {
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

      if (
        !cut || !VALID_COLORS.includes(color) ||
        !VALID_CLARITIES.includes(clarity) ||
        isNaN(carat) || carat <= 0 || carat > 10 ||
        isNaN(priceUsd) || priceUsd <= 0
      ) {
        continue;
      }

      const titleLower = (item.title || "").toLowerCase();
      const diamond_type =
        (item.type?.toLowerCase?.().includes("lab") ||
          item.category?.toLowerCase?.().includes("lab") ||
          titleLower.includes("lab"))
          ? "lab-grown"
          : "natural";

      listings.push({
        carat,
        cut,
        color,
        clarity,
        price_gbp: Math.round(priceUsd * usdToGbp),
        retailer_name: "James Allen",
        certification_body: normalizeCertLab(item.certification, "IGI"),
        retailer_url: item.link || null,
        shape: "Round",
        diamond_type,
        symmetry: normalizeGrade(item.symmetry) as Symmetry | null,
        polish: normalizeGrade(item.polish) as Polish | null,
        fluorescence: normalizeFluorescence(item.fluorescence ?? item.fluor) as Fluorescence | null,
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

function normalizeGrade(raw: string | undefined): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  for (const grade of VALID_GRADES) {
    if (grade.toLowerCase() === lower) return grade;
  }
  if (lower === "ex" || lower === "exc") return "Excellent";
  if (lower === "vg") return "Very Good";
  if (lower === "gd") return "Good";
  if (lower === "fr") return "Fair";
  return null;
}

function normalizeFluorescence(raw: string | undefined): string | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  for (const f of VALID_FLUORESCENCE) {
    if (f.toLowerCase() === lower) return f;
  }
  if (lower === "non" || lower === "nil" || lower === "n") return "None";
  if (lower === "fnt" || lower === "fai") return "Faint";
  if (lower === "med") return "Medium";
  if (lower === "str" || lower === "stg") return "Strong";
  if (lower === "vst" || lower.includes("very")) return "Very Strong";
  return null;
}

function normalizeCertLab(raw: string | undefined, defaultLab: CertificationBody): CertificationBody {
  if (!raw) return defaultLab;
  const upper = raw.toUpperCase().trim();
  if (CERT_LAB_SET.has(upper as CertificationBody)) return upper as CertificationBody;
  return defaultLab;
}
