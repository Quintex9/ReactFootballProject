"use client";

import { useRouter, useSearchParams } from "next/navigation";

// dostupné športy v prepínači
export const SPORTS = [
  { key: "football", label: "Football" },
  { key: "nba", label: "NBA" },
  { key: "mlb", label: "MLB" },
  { key: "nfl", label: "NFL" },
  { key: "hockey", label: "Hockey" },
  { key: "handball", label: "Handball" },
];

export default function SportSelector() {
  const router = useRouter();
  const params = useSearchParams();

  const current = params.get("sport") || "football";

  return (
    <div className="w-full max-w-4xl">
      {/* hlavička prepínača */}
      <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">
        Výber športu
      </p>
      <div className="flex flex-wrap gap-2">
        {SPORTS.map((sport) => {
          const active = current === sport.key;
          return (
            <button
              key={sport.key}
              type="button"
              aria-pressed={active}
              onClick={() => router.push(`/?sport=${sport.key}`)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                active
                  ? "bg-indigo-500 text-white border-indigo-400 shadow-[0_5px_25px_rgba(99,102,241,0.35)]"
                  : "bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {sport.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
