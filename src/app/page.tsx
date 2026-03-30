"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import Results from "@/components/Results";
import type { SearchParams, FairPriceResult, ListingWithDelta } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<{
    params: SearchParams;
    fairPrice: FairPriceResult;
    listings: ListingWithDelta[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(params: SearchParams) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        carat: params.carat.toString(),
        cut: params.cut,
        color: params.color,
        clarity: params.clarity,
        ...(params.budget ? { budget: params.budget.toString() } : {}),
      });
      const res = await fetch(`/api/search?${qs}`);
      const data = await res.json();
      setResults({ params, ...data });
    } catch {
      // TODO: error handling
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="max-w-[800px] mx-auto px-5 pt-12">
        {/* Header */}
        <div className="text-center pb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            find<span className="text-gray-400 font-light">my</span>diamond
          </h1>
          <p className="text-gray-500 text-[15px] mt-2">
            Check if you&apos;re getting a fair price on a UK diamond
          </p>
        </div>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Results */}
        {results && (
          <Results
            params={results.params}
            fairPrice={results.fairPrice}
            listings={results.listings}
          />
        )}
      </div>
    </main>
  );
}
