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
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(params: SearchParams) {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        carat: params.carat.toString(),
        cut: params.cut,
        color: params.color,
        clarity: params.clarity,
        ...(params.budget ? { budget: params.budget.toString() } : {}),
      });
      const res = await fetch(`/api/search?${qs}`);
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      if (!data.fairPrice || !data.listings) {
        setError("Unexpected response. Please try again.");
        return;
      }
      setResults({ params, ...data });
    } catch {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pb-20">
      {/* Hero gradient header */}
      <div
        className="pt-14 pb-10 px-5 text-center"
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #fafbfd 100%)",
        }}
      >
        <div className="max-w-[800px] mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <svg
              className="diamond-icon"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#d4a853" }}
            >
              <path d="M6 3h12l4 6-10 13L2 9z" />
              <path d="M2 9h20" />
              <path d="M10 3l-2 6 4 13 4-13-2-6" />
            </svg>
            <h1
              className="text-[32px] font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              find
              <span style={{ color: "#d4a853" }}>my</span>
              diamond
            </h1>
          </div>
          <p className="text-[15px] max-w-[360px] mx-auto" style={{ color: "#64748b" }}>
            Check if you&apos;re getting a fair price on a UK diamond
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-6 text-xs" style={{ color: "#94a3b8" }}>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              GIA &amp; IGI Certified
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              UK Jewellers Only
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Free to Use
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-5">
        {/* Search Form */}
        <div className="animate-fade-in-up -mt-2">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl p-5 mb-6 text-center animate-fade-in-up"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p className="text-sm font-medium" style={{ color: "#b91c1c" }}>
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {results && !error && (
          <div className="animate-fade-in-up">
            <Results
              params={results.params}
              fairPrice={results.fairPrice}
              listings={results.listings}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-[800px] mx-auto px-5 mt-16 pt-8 border-t" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex items-center justify-between text-xs" style={{ color: "#94a3b8" }}>
          <span>findmydiamond.co.uk</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:underline" style={{ color: "#64748b" }}>
              Privacy Policy
            </a>
          </div>
        </div>
        <p className="text-xs mt-3 pb-6" style={{ color: "#cbd5e1" }}>
          Prices are indicative and sourced from UK retailers. Always verify with the jeweller before purchasing.
        </p>
      </footer>
    </main>
  );
}
