"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SPORTS = [
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
    <select
      className="mb-6 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
      value={current}
      onChange={(e) => router.push(`/?sport=${e.target.value}`)}
    >
      {SPORTS.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
