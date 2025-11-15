import MatchDetails from "@/app/components/MatchDetails";
import { Match } from "@/lib/types";
import { resolveSport, SportKey } from "@/lib/sportsConfig";
import BackButton from "@/components/BackButton";

const FALLBACK_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Internal fetch failed (${res.status})`);
  }
  return res.json();
}

async function fetchMatchFromApiRoute(
  origin: string,
  sport: SportKey,
  matchId: string
): Promise<Match | null> {
  const data = await fetchJson(
    `${origin}/api/live?sport=${sport}&matchId=${matchId}`
  );
  const list = Array.isArray(data.response) ? data.response : [];
  return list[0] ?? null;
}

async function fetchHeadToHead(
  origin: string,
  sport: SportKey,
  homeId: string | number,
  awayId: string | number
) {
  const data = await fetchJson(
    `${origin}/api/live?sport=${sport}&h2h=${homeId}-${awayId}&last=6`
  );
  return Array.isArray(data.response) ? data.response : [];
}

const LIVE_STATUS_CODES = new Set([
  "LIVE",
  "1H",
  "2H",
  "3H",
  "4H",
  "OT",
  "HT",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "ST",
  "P1",
  "P2",
  "P3",
]);

function isLiveStatus(status: Match["status"]) {
  const code = (status.short || status.long || "").toUpperCase();
  if (LIVE_STATUS_CODES.has(code)) {
    return true;
  }
  const long = status.long?.toLowerCase() ?? "";
  return long.includes("live") || long.includes("in play");
}

interface MatchDetailsPageProps {
  params: { matchId: string };
  searchParams: Promise<{
    sport?: string;
    matchData?: string;
  }>;
}

export default async function MatchDetailsPage({
  params,
  searchParams,
}: MatchDetailsPageProps) {
  const { matchId } = params;
  const query = await searchParams;
  const sport = resolveSport(query?.sport as string);
  let matchFromQuery: Match | null = null;

  if (query?.matchData) {
    try {
      const decoded = decodeURIComponent(query.matchData);
      matchFromQuery = JSON.parse(decoded) as Match;
    } catch {
      matchFromQuery = null;
    }
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_ORIGIN;

  if (!origin) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 text-center">
        <div className="space-y-3 max-w-md">
          <p className="text-2xl font-semibold">Požiadavka sa nedá obslúžiť</p>
          <p className="text-gray-400">
            Nepodarilo sa zostaviť internú URL pre API.
          </p>
        </div>
      </main>
    );
  }

  try {
    let match: Match | null = matchFromQuery;

    try {
      if (!match) {
        const liveResponse = await fetch(
          `${origin}/api/live?sport=${sport}`,
          {
            cache: "no-store",
          }
        );

        if (liveResponse.ok) {
          const liveJson = await liveResponse.json();
          const matches: Match[] = liveJson.response ?? [];
          const found =
            matches.find((m) => String(m.id) === matchId) ??
            matches.find((m) => String(m.id) === String(matchId));
          match = found ?? null;
        }
      }
    } catch {
      // Ignored – fallback na API route
    }

    if (!match) {
      match = await fetchMatchFromApiRoute(origin, sport, matchId);
    }

    if (!match) {
      throw new Error("Zápas sa nenašiel ani v live ani v API odpovedi");
    }

    const shouldShowH2H =
      sport === "football" && isLiveStatus(match.status);

    const headToHead = shouldShowH2H
      ? await fetchHeadToHead(origin, sport, match.home.id, match.away.id)
      : [];

    const fixtureDate = new Date(match.date).toLocaleString("sk-SK", {
      timeZone: "Europe/Bratislava",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const venue = match.venue ?? "Neznáme";
    const season =
      match.season != null && match.season !== ""
        ? String(match.season)
        : new Date(match.date).getFullYear().toString();
    const scoreLine = `${match.score.home ?? "-"} : ${
      match.score.away ?? "-"
    }`;

    return (
      <main className="min-h-screen bg-gradient-to-b from-[#030712] via-slate-950 to-[#030712] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="flex items-center justify-between gap-4">
            <BackButton label="Späť" />
            <span className="text-xs uppercase tracking-[0.35em] text-indigo-200/70">
              ID #{match.id}
            </span>
          </div>

          <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-[0_25px_55px_rgba(15,23,42,0.65)]">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.45em] text-indigo-200/80">
                {match.league.name}
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold">
                {match.home.name} vs {match.away.name}
              </h1>
              <p className="text-sm text-slate-200/80">
                {fixtureDate} · {venue}
              </p>
            </div>

            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-lg font-semibold">
                <span className="text-gray-300">{match.home.name}</span>
                <span className="text-gray-500 text-base">vs</span>
                <span className="text-gray-300">{match.away.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-xs uppercase tracking-[0.35em] text-indigo-200/80 text-center">
                  {match.status.short ?? "—"}
                  <p className="text-sm text-gray-300 tracking-normal">
                    {match.status.long}
                  </p>
                </div>
                <div className="text-4xl font-black">{scoreLine}</div>
                {match.status.elapsed != null && (
                  <div className="text-sm text-gray-400">
                    {match.status.elapsed}' min
                  </div>
                )}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-200/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Šport
                </dt>
                <dd className="text-lg font-semibold capitalize">{sport}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Sezóna
                </dt>
                <dd className="text-lg font-semibold">{season}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Miesto
                </dt>
                <dd className="text-lg font-semibold">{venue}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Zdroj
                </dt>
                <dd className="text-lg font-semibold">API-SPORTS</dd>
              </div>
            </dl>
          </section>

          <MatchDetails
            match={match}
            headToHead={headToHead}
            showComparison={!shouldShowH2H}
            showHero={false}
          />
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 text-center">
        <div className="space-y-3 max-w-md">
          <p className="text-2xl font-semibold">
            Nepodarilo sa načítať detail zápasu
          </p>
          <p className="text-gray-400 text-sm">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </main>
    );
  }
}

