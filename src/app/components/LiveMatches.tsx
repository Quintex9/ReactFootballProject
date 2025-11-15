"use client";

import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import { Match } from "@/lib/types";

export default function LiveMatches({ sport }: { sport: string }) {
  const [matches, setMatches] = useState<Match[]>([]);

  // načítanie dát z internej API route
  async function load() {
    try {
      const res = await fetch(`/api/live?sport=${sport}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setMatches(json.response ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setMatches([]); // reset pri zmene sportu
    load();

    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, [sport]);


  if (matches.length === 0) {
    return (
      <div className="w-full max-w-5xl rounded-3xl border border-gray-800/70 bg-gray-900/70 px-6 py-10 text-center text-gray-300 mt-8">
        <p className="text-lg font-semibold mb-2">
          Momentálne nevidíme žiadne live zápasy.
        </p>
        <p className="text-sm text-gray-400">
          Buď sa práve nehrá, alebo API dosiahlo denný limit požiadaviek.
          Skúste to o pár minút neskôr.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 [@media(min-width:1100px)]:grid-cols-2 gap-8 w-full max-w-7xl">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} sport={sport} />
      ))}
    </div>
  );
}
