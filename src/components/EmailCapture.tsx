"use client";

import { useState } from "react";
import type { SearchParams } from "@/lib/types";
import { formatPrice } from "@/lib/format";

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
      <div
        className="rounded-xl p-7 mt-6 text-center animate-fade-in-up"
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
        }}
      >
        <svg
          className="mx-auto mb-3"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3 className="text-[15px] font-semibold mb-1" style={{ color: "#15803d" }}>
          You&apos;re all set!
        </h3>
        <p className="text-sm" style={{ color: "#16a34a" }}>
          We&apos;ll email you when prices drop for this spec.
        </p>
      </div>
    );
  }

  const specLabel = `${params.carat}ct ${params.color} ${params.clarity}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-7 mt-6 text-center"
      style={{
        background: "linear-gradient(135deg, #fdf6e3 0%, #fffbeb 100%)",
        border: "1px solid #f0d48a",
      }}
    >
      <svg
        className="mx-auto mb-3"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d4a853"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <h3
        className="text-[15px] font-semibold mb-1"
        style={{ color: "#92400e" }}
      >
        Get alerted when prices drop
      </h3>
      <p className="text-sm mb-5" style={{ color: "#b45309" }}>
        We&apos;ll email you when a {specLabel} drops
        {fairPrice ? ` below ${formatPrice(fairPrice)}` : ""} from a UK
        jeweller.
      </p>

      <div className="flex gap-2 max-w-[420px] mx-auto mb-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border rounded-lg text-sm"
          style={{
            borderColor: "#e2e8f0",
            backgroundColor: "#ffffff",
          }}
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #d4a853 0%, #e2bd6e 100%)",
            color: "#ffffff",
            boxShadow: "0 2px 8px rgba(212,168,83,0.3)",
          }}
        >
          Set Alert
        </button>
      </div>

      <label className="flex items-start gap-2 max-w-[420px] mx-auto text-left cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 cursor-pointer"
          style={{ accentColor: "#d4a853" }}
        />
        <span className="text-xs" style={{ color: "#92400e" }}>
          I consent to receiving price alert emails. You can unsubscribe at any
          time. See our{" "}
          <a
            href="/privacy"
            className="underline"
            style={{ color: "#b45309" }}
          >
            privacy policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="text-xs mt-3 font-medium" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
    </form>
  );
}
