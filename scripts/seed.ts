import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || supabaseUrl.includes("your-supabase")) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const listings = [
  { carat: 1.01, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 4890, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 4220, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.02, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 4950, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 0.98, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 3890, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.05, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 5100, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.00, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 3650, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.01, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 3480, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.97, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 3290, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.03, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 3820, retailer_name: "Bdera", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.75, cut: "Excellent", color: "F", clarity: "VVS2", price_gbp: 3200, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.76, cut: "Excellent", color: "F", clarity: "VVS2", price_gbp: 3450, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 0.73, cut: "Very Good", color: "F", clarity: "VVS2", price_gbp: 2980, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.78, cut: "Very Good", color: "F", clarity: "VVS2", price_gbp: 3380, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.00, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 3100, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.02, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 3450, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.99, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 2950, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.01, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 3280, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.25, cut: "Very Good", color: "I", clarity: "VS1", price_gbp: 4100, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.23, cut: "Excellent", color: "I", clarity: "VS1", price_gbp: 4350, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.27, cut: "Very Good", color: "I", clarity: "VS1", price_gbp: 4580, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.50, cut: "Excellent", color: "E", clarity: "IF", price_gbp: 2800, retailer_name: "Vashi", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.52, cut: "Excellent", color: "E", clarity: "IF", price_gbp: 3100, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.49, cut: "Very Good", color: "E", clarity: "IF", price_gbp: 2650, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 1.00, cut: "Good", color: "G", clarity: "VS1", price_gbp: 3400, retailer_name: "Budget Diamonds UK", certification_body: "IGI", retailer_url: null, shape: "Round" },
  { carat: 1.03, cut: "Good", color: "G", clarity: "VS1", price_gbp: 3650, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round" },
  { carat: 0.98, cut: "Fair", color: "G", clarity: "VS1", price_gbp: 2900, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round" },
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
