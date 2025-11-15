"use client";

import { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import { Match } from "@/lib/types";

export default function LiveMatches({ sport }: { sport: string }) {
  const [matches, setMatches] = useState<Match[]>([]);

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
      <p className="text-white text-xl mt-8">
        Momentálne sa nehrá žiadny live zápas alebo sa presiahol denný limit requestov - 100 za deň. Skontrolujte neskôr.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 [@media(min-width:1100px)]:grid-cols-2 gap-8 w-full max-w-7xl">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
