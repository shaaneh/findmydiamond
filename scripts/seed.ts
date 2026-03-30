import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || supabaseUrl.includes("your-supabase")) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const listings = [
  // Blue Nile UK (USD converted to GBP at ~0.79, March 2026)
  { carat: 1.00, cut: "Very Good", color: "H", clarity: "VS1", price_gbp: 2094, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/26311555", shape: "Round" },
  { carat: 1.02, cut: "Very Good", color: "G", clarity: "VS2", price_gbp: 2188, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/25805279", shape: "Round" },
  { carat: 1.02, cut: "Very Good", color: "H", clarity: "VS1", price_gbp: 2228, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/26385845", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "G", clarity: "VS2", price_gbp: 2244, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/27767361", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 2259, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/27933362", shape: "Round" },
  { carat: 1.01, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 2267, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/28480394", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "H", clarity: "VS1", price_gbp: 2283, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/28561350", shape: "Round" },
  { carat: 1.01, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 2283, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/28553155", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 2291, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/27863288", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "H", clarity: "VS1", price_gbp: 2291, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/28477021", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 2299, retailer_name: "Blue Nile", certification_body: "GIA", retailer_url: "https://www.bluenile.com/uk/diamond-details/26178111", shape: "Round" },

  // James Allen (USD converted to GBP at ~0.79, March 2026)
  { carat: 1.00, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 1177, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-g-color-si1-clarity-excellent-cut-sku-28427150", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "F", clarity: "SI1", price_gbp: 1272, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-f-color-si1-clarity-excellent-cut-sku-28446726", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "F", clarity: "SI1", price_gbp: 1454, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-f-color-si1-clarity-excellent-cut-sku-28479062", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "E", clarity: "SI1", price_gbp: 1525, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-e-color-si1-clarity-excellent-cut-sku-27624817", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 1564, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-g-color-si1-clarity-excellent-cut-sku-26332289", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "F", clarity: "SI1", price_gbp: 1564, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-f-color-si1-clarity-very-good-cut-sku-28284317", shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "H", clarity: "SI1", price_gbp: 1588, retailer_name: "James Allen", certification_body: "GIA", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-h-color-si1-clarity-excellent-cut-sku-28427875", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 1604, retailer_name: "James Allen", certification_body: "GIA", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/1.00-carat-g-color-si1-clarity-very-good-cut-sku-27767278", shape: "Round" },
  { carat: 0.70, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 600, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/0.70-carat-g-color-si1-clarity-excellent-cut-sku-27073256", shape: "Round" },
  { carat: 0.70, cut: "Excellent", color: "H", clarity: "SI1", price_gbp: 624, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/0.70-carat-h-color-si1-clarity-excellent-cut-sku-27043777", shape: "Round" },
  { carat: 0.70, cut: "Very Good", color: "E", clarity: "SI1", price_gbp: 632, retailer_name: "James Allen", certification_body: "GIA", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/0.70-carat-e-color-si1-clarity-very-good-cut-sku-27531011", shape: "Round" },
  { carat: 0.74, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 640, retailer_name: "James Allen", certification_body: "IGI", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/0.74-carat-g-color-si1-clarity-excellent-cut-sku-26380912", shape: "Round" },
  { carat: 0.70, cut: "Very Good", color: "H", clarity: "SI1", price_gbp: 640, retailer_name: "James Allen", certification_body: "GIA", retailer_url: "https://www.jamesallen.com/loose-diamonds/round-cut/0.70-carat-h-color-si1-clarity-very-good-cut-sku-27547060", shape: "Round" },

  // 77 Diamonds (London-based, links to search page)
  { carat: 1.00, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 2350, retailer_name: "77 Diamonds", certification_body: "GIA", retailer_url: "https://www.77diamonds.com/round-cut-diamonds", shape: "Round" },
  { carat: 1.01, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 1890, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: "https://www.77diamonds.com/round-cut-diamonds", shape: "Round" },
  { carat: 0.70, cut: "Excellent", color: "F", clarity: "VS1", price_gbp: 980, retailer_name: "77 Diamonds", certification_body: "GIA", retailer_url: "https://www.77diamonds.com/round-cut-diamonds", shape: "Round" },
  { carat: 1.00, cut: "Good", color: "G", clarity: "VS1", price_gbp: 1750, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: "https://www.77diamonds.com/round-cut-diamonds", shape: "Round" },

  // Queensmith (Hatton Garden, links to loose diamonds page)
  { carat: 1.00, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 2500, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: "https://www.queensmith.co.uk/diamonds/loose-diamonds", shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 2100, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: "https://www.queensmith.co.uk/diamonds/loose-diamonds", shape: "Round" },
  { carat: 0.75, cut: "Excellent", color: "F", clarity: "VVS2", price_gbp: 1650, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: "https://www.queensmith.co.uk/diamonds/loose-diamonds", shape: "Round" },
];

async function seed() {
  console.log("Seeding listings...");
  const { data, error } = await supabase.from("listings").insert(listings).select();

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }

  console.log(`Seeded ${data.length} listings.`);
}

seed();
