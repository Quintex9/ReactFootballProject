"use client";

import useSWR from "swr";
import MatchCard from "./MatchCard";
import { Match } from "@/lib/types";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

export default function LiveMatches({ 
  sport, 
  league = "" 
}: { 
  sport: string; 
  league?: string;
}) {
  // kľúč sa mení podľa SPORT + LEAGUE → SWR automaticky refetchne
  const apiUrl = `/api/live?sport=${sport}${league ? `&league=${league}` : ""}`;

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 20000, // každých 20 sekúnd
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const matches: Match[] = data?.response ?? [];

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl rounded-3xl border border-gray-800/70 bg-gray-900/70 px-6 py-10 text-center text-gray-300 mt-8">
        <p className="text-lg font-semibold mb-2">Načítavam live zápasy…</p>
        <p className="text-sm text-gray-400">Prosím počkajte.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl rounded-3xl border border-gray-800/70 bg-gray-900/70 px-6 py-10 text-center text-gray-300 mt-8">
        <p className="text-lg font-semibold mb-2">Chyba pri načítaní dát.</p>
        <p className="text-sm text-gray-400">
          Skontrolujte pripojenie alebo API limity.
        </p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="w-full max-w-5xl rounded-3xl border border-gray-800/70 bg-gray-900/70 px-6 py-10 text-center text-gray-300 mt-8">
        <p className="text-lg font-semibold mb-2">
          Žiadne zápasy pre túto ligu alebo šport.
        </p>
        <p className="text-sm text-gray-400">Skúste zmeniť filter.</p>
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
