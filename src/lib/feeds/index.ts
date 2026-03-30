import type { Listing } from "../types";
import { fetchBluenileFeed } from "./bluenile";
import { fetchJamesAllenFeed } from "./jamesallen";

export type FeedResult = Omit<Listing, "id" | "created_at">;

/**
 * Fetch listings from all configured feeds.
 * Each feed module is independent, so one failing doesn't block the others.
 */
export async function fetchAllFeeds(usdToGbp: number): Promise<FeedResult[]> {
  const results = await Promise.allSettled([
    fetchBluenileFeed(usdToGbp),
    fetchJamesAllenFeed(usdToGbp),
  ]);

  const listings: FeedResult[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      listings.push(...result.value);
    } else {
      console.error("Feed failed:", result.reason);
    }
  }

  return listings;
}
