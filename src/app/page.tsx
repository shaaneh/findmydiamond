"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import Results from "@/components/Results";
import type { SearchParams, FairPriceResult, ListingWithDelta } from "@/lib/types";
import { ALL_CERT_LABS } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<{
    params: SearchParams;
    fairPrice: FairPriceResult;
    listings: ListingWithDelta[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labFairPrice, setLabFairPrice] = useState<FairPriceResult | null>(null);

  async function handleSearch(params: SearchParams) {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/search?carat=${params.carat}&cut=${params.cut}&color=${params.color}&clarity=${params.clarity}${params.budget ? `&budget=${params.budget}` : ""}&diamondType=${params.diamondType || "all"}&certLabs=${(params.certLabs || ALL_CERT_LABS).join(",")}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      if (!data.fairPrice || !data.listings) {
        setError("Unexpected response. Please try again.");
        return;
      }
      setLabFairPrice(data.labFairPrice);
      setResults({ params, ...data });
    } catch {
      setError("Could not connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-40"
        style={{
          background: "rgba(250, 250, 248, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-[1080px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--gold)" }}
            >
              <path d="M6 3h12l4 6-10 13L2 9z" />
              <path d="M2 9h20" />
              <path d="M10 3l-2 6 4 13 4-13-2-6" />
            </svg>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              find<span style={{ color: "var(--gold)" }}>my</span>diamond
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="hidden sm:inline">UK Diamond Prices</span>
            <a
              href="/privacy"
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              Privacy
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header
        className="relative overflow-hidden"
        style={{ background: "var(--bg-hero)" }}
      >
        <div className="max-w-[1080px] mx-auto px-5 pt-16 pb-20 text-center relative z-10">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] mb-4 animate-fade-in"
            style={{ color: "var(--gold)" }}
          >
            UK Diamond Price Comparison
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-inverse)",
              lineHeight: 1.15,
            }}
          >
            Are you paying<br />a fair price?
          </h1>
          <p
            className="text-base sm:text-lg max-w-[440px] mx-auto mb-10 animate-fade-in-up stagger-1"
            style={{ color: "#94A3B0", lineHeight: 1.6 }}
          >
            Compare prices from trusted UK retailers. See the fair market
            value before you buy.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in-up stagger-2">
            {[
              {
                icon: (
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                ),
                label: "GIA & IGI Certified",
              },
              {
                icon: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </>
                ),
                label: "UK Retailers Only",
              },
              {
                icon: (
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                ),
                label: "100% Free",
              },
            ].map((badge) => (
              <span
                key={badge.label}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--gold-light)" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {badge.icon}
                </svg>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        {/* Subtle gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to bottom, transparent, var(--bg))`,
          }}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-[720px] mx-auto px-5 -mt-8 relative z-10 pb-20">
        {/* Search Form */}
        <div className="animate-fade-in-up">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl p-5 mb-6 text-center animate-fade-in"
            style={{
              background: "var(--deal-poor-bg)",
              border: "1px solid #FECACA",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--deal-poor)" }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && (
          <div className="space-y-4 mt-6 animate-fade-in">
            <div
              className="rounded-xl p-8"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="h-4 w-40 mx-auto rounded animate-shimmer mb-4" />
              <div className="h-10 w-48 mx-auto rounded animate-shimmer mb-3" />
              <div className="h-3 w-56 mx-auto rounded animate-shimmer" />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl p-5 flex justify-between items-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 rounded animate-shimmer" />
                  <div className="h-3 w-32 rounded animate-shimmer" />
                </div>
                <div className="h-6 w-20 rounded animate-shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && !error && !loading && (
          <div className="animate-fade-in-up mt-6">
            <Results
              params={results.params}
              fairPrice={results.fairPrice}
              labFairPrice={labFairPrice}
              listings={results.listings}
              diamondType={results.params.diamondType || "all"}
            />
          </div>
        )}

        {/* How We Calculate (shown before search) */}
        {!results && !loading && (
          <section className="mt-12 animate-fade-in-up stagger-3">
            <h2
              className="text-xl font-semibold mb-6 text-center"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              How it works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Tell us the spec",
                  desc: "Enter the 4Cs: carat, cut, colour, and clarity of the diamond you want.",
                },
                {
                  step: "2",
                  title: "We check the market",
                  desc: "We compare prices from Blue Nile, James Allen, 77 Diamonds, and more.",
                },
                {
                  step: "3",
                  title: "See the fair price",
                  desc: "Get the median market price and see which retailers offer the best deals.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl p-5 text-center"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-3"
                    style={{
                      background: "var(--gold-bg)",
                      color: "var(--gold)",
                    }}
                  >
                    {item.step}
                  </div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 4Cs quick guide */}
            <div
              className="rounded-xl p-6 mt-6"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-4 text-center"
                style={{ color: "var(--text-primary)" }}
              >
                Understanding the 4Cs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {[
                  { name: "Carat", desc: "Weight of the diamond. 1ct = 0.2 grams." },
                  { name: "Cut", desc: "How well the diamond reflects light. Excellent is best." },
                  { name: "Colour", desc: "D is colourless (rarest). G-H is popular value." },
                  { name: "Clarity", desc: "How clean the diamond is. VS1-VS2 is eye-clean." },
                ].map((c) => (
                  <div key={c.name}>
                    <div
                      className="text-xs font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--gold)" }}
                    >
                      {c.name}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "var(--bg-hero)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1080px] mx-auto px-5 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: "var(--gold)" }}
              >
                <path d="M6 3h12l4 6-10 13L2 9z" />
                <path d="M2 9h20" />
                <path d="M10 3l-2 6 4 13 4-13-2-6" />
              </svg>
              <span
                className="text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-inverse)",
                }}
              >
                findmydiamond
              </span>
            </div>
            <div
              className="flex items-center gap-5 text-xs"
              style={{ color: "#64748b" }}
            >
              <a href="/privacy" className="hover:underline transition-colors" style={{ color: "#94A3B0" }}>
                Privacy Policy
              </a>
              <span style={{ color: "#334155" }}>|</span>
              <span>findmydiamond.co.uk</span>
            </div>
          </div>
          <p
            className="text-xs mt-4 text-center sm:text-left"
            style={{ color: "#475569" }}
          >
            Prices are indicative and sourced from UK retailers. Always verify
            with the jeweller before purchasing. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
