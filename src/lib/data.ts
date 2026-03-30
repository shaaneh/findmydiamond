import type { Listing } from "./types";
import { sampleListings } from "./sample-data";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export async function getListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured()) {
    return sampleListings;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("shape", "Round")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    return sampleListings;
  }
  return (data as Listing[]) || sampleListings;
}
