"use client";

import type { SearchParams, FairPriceResult, ListingWithDelta } from "@/lib/types";
import EmailCapture from "./EmailCapture";

interface Props {
  params: SearchParams;
  fairPrice: FairPriceResult;
  listings: ListingWithDelta[];
}

function formatPrice(price: number): string {
  return "£" + price.toLocaleString("en-GB");
}

function DeltaBadge({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  if (delta < -1) {
    return (
      <div className="text-xs mt-1 text-green-700 font-medium">
        {Math.abs(delta)}% below fair price
      </div>
    );
  }
  if (delta > 1) {
    return (
      <div className="text-xs mt-1 text-red-600 font-medium">
        {delta}% above fair price
      </div>
    );
  }
  return (
    <div className="text-xs mt-1 text-gray-500 font-medium">At fair price</div>
  );
}

export default function Results({ params, fairPrice, listings }: Props) {
  return (
    <div className="mt-2">
      {/* Fair Price Hero */}
      {!fairPrice.noData && fairPrice.fairPrice !== null ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Estimated Fair Price (UK)
          </div>
          <div className="text-4xl font-bold mt-2 mb-2">
            {formatPrice(fairPrice.fairPrice)}
          </div>
          {fairPrice.low !== null && fairPrice.high !== null && (
            <div className="text-sm text-gray-500">
              UK range: {formatPrice(fairPrice.low)} &ndash;{" "}
              {formatPrice(fairPrice.high)} for this spec
            </div>
          )}
          {fairPrice.isLimitedData && (
            <div className="text-xs text-amber-600 mt-2">
              Estimate based on limited data
            </div>
          )}
          <div className="text-xs text-gray-400 mt-2">
            Prices may vary by certification
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5 text-center">
          <div className="text-base font-semibold mb-2">
            Not enough data for a fair price estimate
          </div>
          <p className="text-sm text-gray-500">
            We don&apos;t have enough UK listings for this spec yet. Below are
            the closest matches we found.
          </p>
        </div>
      )}

      {/* Listings */}
      {listings.length > 0 ? (
        listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white border border-gray-200 rounded-lg p-5 mb-3 flex justify-between items-center"
          >
            <div>
              <h3 className="text-[15px] font-semibold">
                {listing.carat}ct Round, {listing.color}, {listing.clarity},{" "}
                {listing.cut}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {listing.retailer_name} &middot; {listing.certification_body}{" "}
                Certified
              </p>
              {listing.retailer_url && (
                <a
                  href={listing.retailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 underline mt-1.5 inline-block"
                >
                  View on retailer site &rarr;
                </a>
              )}
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-xl font-bold">
                {formatPrice(listing.price_gbp)}
              </div>
              <DeltaBadge delta={listing.deltaPercent} />
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-sm font-semibold mb-1">
            No diamonds matching this spec yet
          </p>
          <p className="text-sm text-gray-500">
            We&apos;re adding new UK listings every week.
          </p>
        </div>
      )}

      {/* Email Capture */}
      <EmailCapture params={params} fairPrice={fairPrice.fairPrice} />
    </div>
  );
}
