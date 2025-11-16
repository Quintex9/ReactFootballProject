"use client";

import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

export default function LeagueSelector({ sport }: { sport: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const selectedLeague = params.get("league") ?? "";

  const { data, isLoading } = useSWR(
    `/api/live?sport=${sport}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const matches = data?.response ?? [];

  //spracovanie rôznych API štruktúr
  const leagues = Array.from(
    new Map(
      matches.map((m: any) => {
        const leagueId =
          m?.league?.id ??
          m?.league?.league_id ??  // V1 športy
          m?.league_id ??
          null;

        const leagueName =
          m?.league?.name ??
          m?.league?.league_name ??
          m?.league_name ??
          "Unknown League";

        return [
          leagueId,
          { id: leagueId, name: leagueName }
        ];
      })
    ).values()
  ).filter((l: any) => l.id !== null); // odstráni null/undefined


  function updateLeague(newLeague: string) {
    const search = new URLSearchParams(params.toString());

    if (newLeague) search.set("league", newLeague);
    else search.delete("league");

    router.push("/?" + search.toString());
  }

  return (
    <select
      disabled={isLoading}
      className="mb-6 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
      value={selectedLeague}
      onChange={(e) => updateLeague(e.target.value)}
    >
      <option value="">All leagues</option>

      {leagues.map((l: any) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
}
