"use client";

import { useState } from "react";
import type { SearchParams, Cut, Color, Clarity, CertificationBody } from "@/lib/types";
import { ALL_CERT_LABS } from "@/lib/types";

const CUTS: Cut[] = ["Excellent", "Very Good", "Good", "Fair"];
const COLORS: Color[] = ["D", "E", "F", "G", "H", "I", "J"];
const CLARITIES: Clarity[] = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: Props) {
  const [carat, setCarat] = useState("1.00");
  const [cut, setCut] = useState<Cut>("Very Good");
  const [color, setColor] = useState<Color>("G");
  const [clarity, setClarity] = useState<Clarity>("VS1");
  const [budget, setBudget] = useState("");
  const [diamondType, setDiamondType] = useState<"all" | "natural" | "lab-grown">("all");
  const [certLabs, setCertLabs] = useState<CertificationBody[]>([...ALL_CERT_LABS]);

  function toggleCertLab(lab: CertificationBody) {
    setCertLabs((prev) =>
      prev.includes(lab) ? prev.filter((l) => l !== lab) : [...prev, lab]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const caratNum = parseFloat(carat);
    if (isNaN(caratNum) || caratNum <= 0) return;
    if (certLabs.length === 0) return;

    onSearch({
      carat: caratNum,
      cut,
      color,
      clarity,
      diamondType,
      certLabs,
      ...(budget ? { budget: parseInt(budget.replace(/[^0-9]/g, ""), 10) } : {}),
    });
  }

  const inputClasses =
    "w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200";
  const labelClasses =
    "block text-[11px] font-semibold mb-1.5 uppercase tracking-wider";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 sm:p-7"
      style={{
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--gold)" }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <h2
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          What are you looking for?
        </h2>
      </div>

      {/* Diamond Type Segmented Control */}
      <div className="flex rounded-lg overflow-hidden mb-4" style={{ border: "1px solid var(--border)" }}>
        {(["all", "natural", "lab-grown"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setDiamondType(type)}
            className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              background: diamondType === type ? "var(--gold)" : "var(--bg-card)",
              color: diamondType === type ? "white" : "var(--text-secondary)",
            }}
          >
            {type === "all" ? "All" : type === "natural" ? "Natural" : "Lab-Grown"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label
            htmlFor="shape"
            className={labelClasses}
            style={{ color: "var(--text-muted)" }}
          >
            Shape
          </label>
          <select
            id="shape"
            disabled
            className={inputClasses}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-light)",
              cursor: "not-allowed",
            }}
          >
            <option>Round Brilliant</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="carat"
            className={labelClasses}
            style={{ color: "var(--text-muted)" }}
          >
            Carat
          </label>
          <input
            id="carat"
            type="number"
            step="0.01"
            min="0.2"
            max="5"
            value={carat}
            onChange={(e) => setCarat(e.target.value)}
            className={inputClasses}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label
            htmlFor="cut"
            className={labelClasses}
            style={{ color: "var(--text-muted)" }}
          >
            Cut
          </label>
          <select
            id="cut"
            value={cut}
            onChange={(e) => setCut(e.target.value as Cut)}
            className={inputClasses}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          >
            {CUTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="colour"
            className={labelClasses}
            style={{ color: "var(--text-muted)" }}
          >
            Colour
          </label>
          <select
            id="colour"
            value={color}
            onChange={(e) => setColor(e.target.value as Color)}
            className={inputClasses}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="clarity"
            className={labelClasses}
            style={{ color: "var(--text-muted)" }}
          >
            Clarity
          </label>
          <select
            id="clarity"
            value={clarity}
            onChange={(e) => setClarity(e.target.value as Clarity)}
            className={inputClasses}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          >
            {CLARITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Certification Lab Pills */}
      <div className="mb-4">
        <label className={labelClasses} style={{ color: "var(--text-muted)" }}>
          Certification
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_CERT_LABS.map((lab) => (
            <button
              key={lab}
              type="button"
              onClick={() => toggleCertLab(lab)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: certLabs.includes(lab) ? "var(--gold-bg)" : "var(--bg-elevated)",
                color: certLabs.includes(lab) ? "var(--gold)" : "var(--text-light)",
                border: certLabs.includes(lab) ? "1px solid var(--gold-light)" : "1px solid var(--border)",
              }}
            >
              {lab}
            </button>
          ))}
        </div>
        {certLabs.length === 0 && (
          <p className="text-xs mt-1" style={{ color: "var(--deal-poor)" }}>
            Select at least one certification lab
          </p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="budget"
          className={labelClasses}
          style={{ color: "var(--text-muted)" }}
        >
          Budget (optional)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="budget"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 5000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={`${inputClasses} max-w-[200px]`}
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          />
          <span className="text-xs" style={{ color: "var(--text-light)" }}>
            GBP
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg text-[15px] font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer"
        style={{
          background: loading
            ? "var(--text-light)"
            : "linear-gradient(135deg, var(--bg-hero) 0%, #1E2D3D 100%)",
          color: "var(--text-inverse)",
          boxShadow: loading ? "none" : "var(--shadow-hero)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Checking prices...
          </span>
        ) : (
          "Check Price"
        )}
      </button>
    </form>
  );
}
