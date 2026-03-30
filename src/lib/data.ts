import type { Listing, DiamondType, CertificationBody } from "./types";
import { sampleListings } from "./sample-data";
import { getSupabase, isSupabaseConfigured } from "./supabase";

interface ListingFilters {
  diamondType?: DiamondType | "all";
  certLabs?: CertificationBody[];
}

export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    return applyFilters(sampleListings, filters);
  }

  const supabase = getSupabase();
  let query = supabase
    .from("listings")
    .select("*")
    .eq("shape", "Round")
    .order("created_at", { ascending: false });

  if (filters?.diamondType && filters.diamondType !== "all") {
    query = query.eq("diamond_type", filters.diamondType);
  }

  if (filters?.certLabs && filters.certLabs.length > 0) {
    query = query.in("certification_body", filters.certLabs);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Supabase fetch error:", error);
    return applyFilters(sampleListings, filters);
  }
  return (data as Listing[]) || applyFilters(sampleListings, filters);
}

function applyFilters(listings: Listing[], filters?: ListingFilters): Listing[] {
  let filtered = listings;
  if (filters?.diamondType && filters.diamondType !== "all") {
    filtered = filtered.filter((l) => l.diamond_type === filters.diamondType);
  }
  if (filters?.certLabs && filters.certLabs.length > 0) {
    filtered = filtered.filter((l) => filters.certLabs!.includes(l.certification_body));
  }
  return filtered;
}
