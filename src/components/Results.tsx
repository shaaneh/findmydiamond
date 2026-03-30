"use client";

import type {
  SearchParams,
  FairPriceResult,
  ListingWithDelta,
} from "@/lib/types";
import { formatPrice } from "@/lib/format";
import EmailCapture from "./EmailCapture";

interface Props {
  params: SearchParams;
  fairPrice: FairPriceResult;
  listings: ListingWithDelta[];
}

function getDealInfo(delta: number | null): {
  label: string;
  color: string;
  bg: string;
} {
  if (delta === null) return { label: "N/A", color: "var(--text-muted)", bg: "var(--bg-elevated)" };
  if (delta <= -10) return { label: "Great Deal", color: "var(--deal-great)", bg: "var(--deal-great-bg)" };
  if (delta <= -3) return { label: "Good Deal", color: "var(--deal-great)", bg: "var(--deal-great-bg)" };
  if (delta <= 3) return { label: "Fair Price", color: "var(--deal-fair)", bg: "var(--deal-fair-bg)" };
  if (delta <= 10) return { label: "Above Avg", color: "var(--deal-poor)", bg: "var(--deal-poor-bg)" };
  return { label: "Overpriced", color: "var(--deal-poor)", bg: "var(--deal-poor-bg)" };
}

function SpectrumBar({
  fairPrice,
  low,
  high,
}: {
  fairPrice: number;
  low: number;
  high: number;
}) {
  const range = high - low;
  const fairPos = range > 0 ? ((fairPrice - low) / range) * 100 : 50;
  const clampedPos = Math.max(5, Math.min(95, fairPos));

  return (
    <div className="mt-4 mb-1 px-1">
      <div className="relative">
        <div
          className="spectrum-bar h-2 rounded-full w-full"
          style={{ opacity: 0.85 }}
        />
        {/* Fair price marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${clampedPos}%` }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 -ml-2"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--text-primary)",
              boxShadow: "var(--shadow-md)",
            }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: "var(--deal-great)" }}>
          {formatPrice(low)}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Fair: {formatPrice(fairPrice)}
        </span>
        <span className="text-xs" style={{ color: "var(--deal-poor)" }}>
          {formatPrice(high)}
        </span>
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  index,
}: {
  listing: ListingWithDelta;
  index: number;
}) {
  const isBestDeal =
    index === 0 && listing.deltaPercent !== null && listing.deltaPercent < -1;
  const deal = getDealInfo(listing.deltaPercent);
  const staggerClass =
    index < 5 ? `stagger-${index + 1}` : "";

  return (
    <div
      className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:shadow-md animate-fade-in-up ${staggerClass}`}
      style={{
        background: "var(--bg-card)",
        border: isBestDeal
          ? "1.5px solid var(--gold)"
          : "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className="text-[15px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {listing.carat}ct {listing.color} {listing.clarity} {listing.cut}
          </h3>
          {isBestDeal && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "var(--gold-bg)",
                color: "var(--gold)",
              }}
            >
              Best Deal
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {listing.retailer_name}
          </span>
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-muted)",
            }}
          >
            {listing.certification_body}
          </span>
        </div>
        {listing.retailer_url &&
          listing.retailer_url.startsWith("https://") && (
            <a
              href={listing.retailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: "var(--gold)" }}
            >
              View on {listing.retailer_name}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
      </div>
      <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
        <div
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {formatPrice(listing.price_gbp)}
        </div>
        <span
          className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: deal.bg, color: deal.color }}
        >
          {listing.deltaPercent !== null && listing.deltaPercent < -1
            ? `${Math.abs(listing.deltaPercent)}% below`
            : listing.deltaPercent !== null && listing.deltaPercent > 1
              ? `${listing.deltaPercent}% above`
              : deal.label}
        </span>
      </div>
    </div>
  );
}

export default function Results({ params, fairPrice, listings }: Props) {
  return (
    <div>
      {/* Fair Price Hero Card */}
      {!fairPrice.noData && fairPrice.fairPrice !== null ? (
        <div
          className="rounded-xl p-7 mb-6 text-center animate-fade-in-up"
          style={{
            background: "var(--bg-hero)",
            boxShadow: "var(--shadow-hero)",
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
            style={{ color: "var(--gold-light)" }}
          >
            Estimated Fair Price
          </div>
          <div
            className="text-5xl font-bold tracking-tight animate-count-up"
            style={{
              color: "var(--text-inverse)",
              fontFamily: "var(--font-display)",
            }}
          >
            {formatPrice(fairPrice.fairPrice)}
          </div>
          <div className="text-sm mt-1" style={{ color: "#94A3B0" }}>
            for a {params.carat}ct {params.color} {params.clarity} Round
          </div>

          {/* Spectrum Bar */}
          {fairPrice.low !== null && fairPrice.high !== null && (
            <div className="max-w-[400px] mx-auto mt-4">
              <SpectrumBar
                fairPrice={fairPrice.fairPrice}
                low={fairPrice.low}
                high={fairPrice.high}
              />
            </div>
          )}

          {fairPrice.isLimitedData && (
            <div
              className="inline-flex items-center gap-1.5 text-xs mt-4 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(197, 165, 114, 0.15)",
                color: "var(--gold-light)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4M12 17h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Estimate based on limited data
            </div>
          )}
        </div>
      ) : (
        <div
          className="rounded-xl p-7 mb-6 text-center animate-fade-in-up"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            className="text-base font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Not enough data for a fair price estimate
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            We don&apos;t have enough UK listings for this spec yet. Below are
            the closest matches we found.
          </p>
        </div>
      )}

      {/* Listings */}
      {listings.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {listings.length} listing{listings.length !== 1 ? "s" : ""} found
            </h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Sorted by best value
            </span>
          </div>
          <div className="space-y-3">
            {listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </>
      )}

      {listings.length === 0 && (
        <div
          className="rounded-xl p-7 text-center"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            No diamonds matching this spec yet
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            We&apos;re adding new UK listings every week.
          </p>
        </div>
      )}

      {/* Email Capture */}
      <EmailCapture params={params} fairPrice={fairPrice.fairPrice} />
    </div>
  );
}
