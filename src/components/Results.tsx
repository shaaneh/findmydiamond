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

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  if (delta < -1) {
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "#f0fdf4", color: "#15803d" }}
      >
        {Math.abs(delta)}% below
      </span>
    );
  }
  if (delta > 1) {
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
      >
        {delta}% above
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
    >
      Fair price
    </span>
  );
}

function ListingCard({
  listing,
  index,
}: {
  listing: ListingWithDelta;
  index: number;
}) {
  const isBestDeal = index === 0 && listing.deltaPercent !== null && listing.deltaPercent < -1;

  return (
    <div
      className="rounded-xl p-5 mb-3 flex justify-between items-center transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#ffffff",
        border: isBestDeal ? "1.5px solid #d4a853" : "1px solid #f1f5f9",
        boxShadow:
          "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[15px] font-semibold" style={{ color: "#1e293b" }}>
            {listing.carat}ct Round, {listing.color}, {listing.clarity},{" "}
            {listing.cut}
          </h3>
          {isBestDeal && (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "#fdf6e3", color: "#b45309" }}
            >
              Best Deal
            </span>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          {listing.retailer_name}
          <span style={{ color: "#cbd5e1" }}> &middot; </span>
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "#f8fafc", color: "#64748b" }}
          >
            {listing.certification_body}
          </span>
        </p>
        {listing.retailer_url && listing.retailer_url.startsWith("https://") && (
          <a
            href={listing.retailer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs mt-1.5 inline-flex items-center gap-1 hover:underline"
            style={{ color: "#d4a853" }}
          >
            View on retailer site
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        )}
      </div>
      <div className="text-right shrink-0 ml-5">
        <div className="text-xl font-bold" style={{ color: "#0c1222" }}>
          {formatPrice(listing.price_gbp)}
        </div>
        <div className="mt-1">
          <DeltaBadge delta={listing.deltaPercent} />
        </div>
      </div>
    </div>
  );
}

export default function Results({ params, fairPrice, listings }: Props) {
  return (
    <div className="mt-2">
      {/* Fair Price Hero */}
      {!fairPrice.noData && fairPrice.fairPrice !== null ? (
        <div
          className="rounded-xl p-7 mb-6 text-center animate-fade-in-up"
          style={{
            background: "linear-gradient(135deg, #0c1222 0%, #1e293b 100%)",
            boxShadow: "0 4px 24px rgba(15,23,42,0.2)",
          }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "#94a3b8" }}
          >
            Estimated Fair Price
          </div>
          <div
            className="text-[42px] font-bold tracking-tight"
            style={{ color: "#ffffff", fontFamily: "var(--font-display)" }}
          >
            {formatPrice(fairPrice.fairPrice)}
          </div>
          {fairPrice.low !== null && fairPrice.high !== null && (
            <div className="text-sm mt-1" style={{ color: "#94a3b8" }}>
              UK range: {formatPrice(fairPrice.low)} &ndash;{" "}
              {formatPrice(fairPrice.high)}
            </div>
          )}
          {fairPrice.isLimitedData && (
            <div
              className="inline-flex items-center gap-1.5 text-xs mt-3 px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(212,168,83,0.15)", color: "#e2bd6e" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Estimate based on limited data
            </div>
          )}
          <div className="text-xs mt-3" style={{ color: "#64748b" }}>
            Prices may vary by certification body (GIA vs IGI)
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-7 mb-6 text-center animate-fade-in-up"
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
          }}
        >
          <div className="text-base font-semibold mb-2" style={{ color: "#1e293b" }}>
            Not enough data for a fair price estimate
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>
            We don&apos;t have enough UK listings for this spec yet. Below are
            the closest matches we found.
          </p>
        </div>
      )}

      {/* Listings header */}
      {listings.length > 0 && (
        <div className="flex items-center justify-between mb-3 px-1">
          <h2
            className="text-sm font-semibold"
            style={{ color: "#334155" }}
          >
            {listings.length} listing{listings.length !== 1 ? "s" : ""} found
          </h2>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            Sorted by best value
          </span>
        </div>
      )}

      {/* Listings */}
      {listings.length > 0 ? (
        listings.map((listing, i) => (
          <div
            key={listing.id}
            className={
              i === 0
                ? "animate-fade-in-up"
                : i === 1
                  ? "animate-fade-in-up-delay-1"
                  : "animate-fade-in-up-delay-2"
            }
          >
            <ListingCard listing={listing} index={i} />
          </div>
        ))
      ) : (
        <div
          className="rounded-xl p-7 text-center"
          style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            boxShadow:
              "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "#1e293b" }}>
            No diamonds matching this spec yet
          </p>
          <p className="text-sm" style={{ color: "#64748b" }}>
            We&apos;re adding new UK listings every week.
          </p>
        </div>
      )}

      {/* Email Capture */}
      <EmailCapture params={params} fairPrice={fairPrice.fairPrice} />
    </div>
  );
}
