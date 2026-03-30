"use client";

import { useState } from "react";
import type { SearchParams } from "@/lib/types";

interface Props {
  params: SearchParams;
  fairPrice: number | null;
}

export default function EmailCapture({ params, fairPrice }: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Please tick the consent checkbox to continue.");
      return;
    }
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shape: "Round",
          carat: params.carat,
          cut: params.cut,
          color: params.color,
          clarity: params.clarity,
          target_price_gbp: fairPrice,
          gdpr_consent: consent,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 text-center">
        <h3 className="text-[15px] font-semibold mb-1">You&apos;re all set!</h3>
        <p className="text-sm text-gray-500">
          We&apos;ll email you when prices drop for this spec.
        </p>
      </div>
    );
  }

  const specLabel = `${params.carat}ct ${params.color} ${params.clarity}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 mt-6 text-center"
    >
      <h3 className="text-[15px] font-semibold mb-1">
        Get alerted when prices drop
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        We&apos;ll email you when a {specLabel} drops
        {fairPrice ? ` below ${formatPrice(fairPrice)}` : ""} from a UK
        jeweller.
      </p>

      <div className="flex gap-2 max-w-[400px] mx-auto mb-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-gray-900 text-white rounded text-sm font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer"
        >
          Set Alert
        </button>
      </div>

      <label className="flex items-start gap-2 max-w-[400px] mx-auto text-left cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 cursor-pointer"
        />
        <span className="text-xs text-gray-500">
          I consent to receiving price alert emails. You can unsubscribe at any
          time. See our{" "}
          <a href="/privacy" className="underline">
            privacy policy
          </a>
          .
        </span>
      </label>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </form>
  );
}

function formatPrice(price: number): string {
  return "£" + price.toLocaleString("en-GB");
}
