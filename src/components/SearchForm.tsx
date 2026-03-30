"use client";

import { useState } from "react";
import type { SearchParams, Cut, Color, Clarity } from "@/lib/types";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const caratNum = parseFloat(carat);
    if (isNaN(caratNum) || caratNum <= 0) return;

    onSearch({
      carat: caratNum,
      cut,
      color,
      clarity,
      ...(budget ? { budget: parseInt(budget.replace(/[^0-9]/g, ""), 10) } : {}),
    });
  }

  const inputClasses =
    "w-full px-3.5 py-2.5 border rounded-lg text-sm transition-all duration-200";
  const inputStyle = {
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  };
  const labelClasses = "block text-[11px] font-semibold mb-1.5 uppercase tracking-wider";
  const labelStyle = { color: "#64748b" };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-7 mb-8"
      style={{
        background: "#ffffff",
        boxShadow:
          "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
        border: "1px solid #f1f5f9",
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "#d4a853" }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <h2 className="text-base font-semibold" style={{ color: "#1e293b" }}>
          What are you looking for?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="shape" className={labelClasses} style={labelStyle}>
            Shape
          </label>
          <select
            id="shape"
            disabled
            className={inputClasses}
            style={{
              ...inputStyle,
              backgroundColor: "#f8fafc",
              color: "#94a3b8",
              cursor: "not-allowed",
            }}
          >
            <option>Round Brilliant</option>
          </select>
        </div>
        <div>
          <label htmlFor="carat" className={labelClasses} style={labelStyle}>
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
            style={inputStyle}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="cut" className={labelClasses} style={labelStyle}>
            Cut
          </label>
          <select
            id="cut"
            value={cut}
            onChange={(e) => setCut(e.target.value as Cut)}
            className={inputClasses}
            style={inputStyle}
          >
            {CUTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="colour" className={labelClasses} style={labelStyle}>
            Colour
          </label>
          <select
            id="colour"
            value={color}
            onChange={(e) => setColor(e.target.value as Color)}
            className={inputClasses}
            style={inputStyle}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="clarity" className={labelClasses} style={labelStyle}>
            Clarity
          </label>
          <select
            id="clarity"
            value={clarity}
            onChange={(e) => setClarity(e.target.value as Clarity)}
            className={inputClasses}
            style={inputStyle}
          >
            {CLARITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="budget" className={labelClasses} style={labelStyle}>
          Budget (optional)
        </label>
        <input
          id="budget"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 5000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={`${inputClasses} max-w-[200px]`}
          style={inputStyle}
        />
        <span className="text-xs ml-2" style={{ color: "#94a3b8" }}>
          GBP
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-lg text-[15px] font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer"
        style={{
          background: loading
            ? "#94a3b8"
            : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "#ffffff",
          boxShadow: loading
            ? "none"
            : "0 2px 8px rgba(15,23,42,0.15), 0 1px 2px rgba(15,23,42,0.1)",
        }}
        onMouseEnter={(e) => {
          if (!loading)
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 4px 16px rgba(15,23,42,0.2), 0 2px 4px rgba(15,23,42,0.12)";
        }}
        onMouseLeave={(e) => {
          if (!loading)
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 2px 8px rgba(15,23,42,0.15), 0 1px 2px rgba(15,23,42,0.1)";
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
