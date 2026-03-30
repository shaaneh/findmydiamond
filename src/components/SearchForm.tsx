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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-8 mb-8"
    >
      <h2 className="text-base font-semibold mb-5">What are you looking for?</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Shape
          </label>
          <select
            disabled
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm bg-gray-50 text-gray-500"
          >
            <option>Round Brilliant</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Carat
          </label>
          <input
            type="number"
            step="0.01"
            min="0.2"
            max="5"
            value={carat}
            onChange={(e) => setCarat(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Cut
          </label>
          <select
            value={cut}
            onChange={(e) => setCut(e.target.value as Cut)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm bg-white"
          >
            {CUTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Colour
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value as Color)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm bg-white"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Clarity
          </label>
          <select
            value={clarity}
            onChange={(e) => setClarity(e.target.value as Clarity)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm bg-white"
          >
            {CLARITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
            Budget (optional)
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="£5,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gray-900 text-white rounded-md text-[15px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 mt-2 cursor-pointer"
      >
        {loading ? "Checking..." : "Check Price →"}
      </button>
    </form>
  );
}
