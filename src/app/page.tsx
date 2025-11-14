// Súbor: src/app/page.tsx

import MatchCard from "./components/MatchCard";
import { Match, ApiResponse } from "@/lib/types";

const MAX_MATCHES = 6;

async function getLiveMatches(): Promise<Match[]> {
  try {
    const res = await fetch("http://localhost:3000/api/live?sport=football", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Chyba pri volaní API route:", res.status, res.statusText);
      return [];
    }

    const data: ApiResponse = await res.json();

    return data.response.slice(0, MAX_MATCHES);
  } catch (error) {
    console.error("Nastala chyba pri fetchovaní dát:", error);
    return [];
  }
}

export default async function HomePage() {
  const liveMatches = await getLiveMatches();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-8">
        Live Matches 
      </h1>

      {liveMatches.length > 0 ? (
        <div className="grid grid-cols-1 [@media(min-width:1100px)]:grid-cols-2 gap-8 w-full max-w-7xl">

          {liveMatches.map((match) => (
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-white text-xl mt-8">
          Momentálne sa nehrá žiadny live zápas. Skontrolujte neskôr.
        </p>
      )}
    </main>
  );
}
