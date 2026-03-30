import type { Listing } from "./types";

/**
 * Sample listings for development / demo mode.
 * Used when Supabase is not configured.
 */
export const sampleListings: Listing[] = [
  // 1.0ct cluster - G colour, VS1 clarity
  { id: "1", carat: 1.01, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 4890, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "2", carat: 1.00, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 4220, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "3", carat: 1.02, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 4950, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "4", carat: 0.98, cut: "Excellent", color: "G", clarity: "VS1", price_gbp: 3890, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },
  { id: "5", carat: 1.05, cut: "Very Good", color: "G", clarity: "VS1", price_gbp: 5100, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-19" },

  // 1.0ct cluster - H colour, VS2 clarity
  { id: "6", carat: 1.00, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 3650, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "7", carat: 1.01, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 3480, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },
  { id: "8", carat: 0.97, cut: "Very Good", color: "H", clarity: "VS2", price_gbp: 3290, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "9", carat: 1.03, cut: "Excellent", color: "H", clarity: "VS2", price_gbp: 3820, retailer_name: "Bdera", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-17" },

  // 0.75ct cluster - F colour, VVS2 clarity
  { id: "10", carat: 0.75, cut: "Excellent", color: "F", clarity: "VVS2", price_gbp: 3200, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "11", carat: 0.76, cut: "Excellent", color: "F", clarity: "VVS2", price_gbp: 3450, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "12", carat: 0.73, cut: "Very Good", color: "F", clarity: "VVS2", price_gbp: 2980, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },
  { id: "13", carat: 0.78, cut: "Very Good", color: "F", clarity: "VVS2", price_gbp: 3380, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-17" },

  // 1.0ct cluster - G colour, SI1 clarity (more affordable)
  { id: "14", carat: 1.00, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 3100, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "15", carat: 1.02, cut: "Excellent", color: "G", clarity: "SI1", price_gbp: 3450, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "16", carat: 0.99, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 2950, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },
  { id: "17", carat: 1.01, cut: "Very Good", color: "G", clarity: "SI1", price_gbp: 3280, retailer_name: "Vashi", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-17" },

  // 1.25ct cluster - I colour, VS1 clarity
  { id: "18", carat: 1.25, cut: "Very Good", color: "I", clarity: "VS1", price_gbp: 4100, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "19", carat: 1.23, cut: "Excellent", color: "I", clarity: "VS1", price_gbp: 4350, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "20", carat: 1.27, cut: "Very Good", color: "I", clarity: "VS1", price_gbp: 4580, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },

  // 0.50ct cluster - E colour, IF clarity (premium small)
  { id: "21", carat: 0.50, cut: "Excellent", color: "E", clarity: "IF", price_gbp: 2800, retailer_name: "Vashi", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "22", carat: 0.52, cut: "Excellent", color: "E", clarity: "IF", price_gbp: 3100, retailer_name: "Hatton Garden Diamonds", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "23", carat: 0.49, cut: "Very Good", color: "E", clarity: "IF", price_gbp: 2650, retailer_name: "Queensmith", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-18" },

  // Good/Fair cut tier samples
  { id: "24", carat: 1.00, cut: "Good", color: "G", clarity: "VS1", price_gbp: 3400, retailer_name: "Budget Diamonds UK", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-20" },
  { id: "25", carat: 1.03, cut: "Good", color: "G", clarity: "VS1", price_gbp: 3650, retailer_name: "Diamond Heaven", certification_body: "GIA", retailer_url: null, shape: "Round", created_at: "2026-03-19" },
  { id: "26", carat: 0.98, cut: "Fair", color: "G", clarity: "VS1", price_gbp: 2900, retailer_name: "77 Diamonds", certification_body: "IGI", retailer_url: null, shape: "Round", created_at: "2026-03-18" },
];
