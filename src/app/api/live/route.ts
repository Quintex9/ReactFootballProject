import { NextRequest, NextResponse } from "next/server";
import { normalizeFootball, normalizeV1 } from "@/lib/normalize";
import {
  SPORT_CONFIG,
  extractList,
  SportKey,
} from "@/lib/sportsConfig";
import { Match } from "@/lib/types";

const today = new Date().toISOString().split("T")[0];

const LIVE_API: Record<string, string> = {
  football: "https://v3.football.api-sports.io/fixtures?live=all",

  // V1 športy NEMAJÚ LIVE v base/free pláne, použijem podľa dátumu:
  nba: `https://v1.basketball.api-sports.io/games?date=${today}`,
  mlb: `https://v1.baseball.api-sports.io/games?date=${today}`,
  nfl: `https://v1.american-football.api-sports.io/games?date=${today}`,
  hockey: `https://v1.hockey.api-sports.io/games?date=${today}`,
  handball: `https://v1.handball.api-sports.io/games?date=${today}`,
};

async function fetchFromApi(url: string, apiKey: string) {
  const res = await fetch(url, {
    headers: { "x-apisports-key": apiKey },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Upstream API error (${res.status})`);
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.APISPORTS_KEY;
  const sportKey = (req.nextUrl.searchParams.get("sport") ??
    "football") as SportKey;
  const sport = SPORT_CONFIG[sportKey] ? sportKey : "football";
  const config = SPORT_CONFIG[sport];

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing APISPORTS_KEY env" },
      { status: 500 }
    );
  }

  if (!LIVE_API[sport]) {
    return NextResponse.json(
      { error: `Unknown sport: ${sport}` },
      { status: 400 }
    );
  }

  const matchId = req.nextUrl.searchParams.get("matchId");
  const teamId = req.nextUrl.searchParams.get("teamId");
  const h2h = req.nextUrl.searchParams.get("h2h");
  const last = req.nextUrl.searchParams.get("last") ?? "5";
  const season = req.nextUrl.searchParams.get("season");
  const lastCount = Math.max(parseInt(last, 10) || 5, 1);
  const fallbackSeason = new Date().getFullYear().toString();

  try {
    if (matchId) {
      const data = await fetchFromApi(
        `${config.endpoint}?id=${matchId}`,
        apiKey
      );
      const list = extractList(data).map(config.normalize);
      return NextResponse.json({ sport, response: list });
    }

    if (h2h) {
      if (!config.supportsH2H) {
        return NextResponse.json(
          { error: "H2H unsupported for this sport", response: [] },
          { status: 400 }
        );
      }

      const [teamA, teamB] = h2h.split("-");
      if (!teamA || !teamB) {
        return NextResponse.json(
          { error: "Invalid h2h format, expected teamA-teamB" },
          { status: 400 }
        );
      }

      const params = new URLSearchParams({
        h2h: `${teamA}-${teamB}`,
      });
      if (season) {
        params.set("season", season);
      }

      const data = await fetchFromApi(
        `${config.endpoint}/headtohead?${params.toString()}`,
        apiKey
      );
      const list = extractList(data).map(config.normalize);

      return NextResponse.json({
        sport,
        response: list.slice(0, lastCount),
      });
    }

    if (teamId) {
      const fetchTeamData = async (useLast: boolean) => {
        const params = new URLSearchParams({ team: teamId });

        if (config.supportsLast !== false) {
          params.set("season", season ?? fallbackSeason);
        }
        if (useLast) {
          params.set("last", String(lastCount));
        }
        const data = await fetchFromApi(
          `${config.endpoint}?${params.toString()}`,
          apiKey
        );
        return extractList(data).map(config.normalize);
      };

      const attempts: boolean[] =
        config.supportsLast === false ? [false] : [true, false];

      let list: Match[] = [];
      let lastError: unknown = null;

      for (const useLast of attempts) {
        try {
          list = await fetchTeamData(useLast);
        } catch (err) {
          lastError = err;
          continue;
        }
        if (list.length > 0) {
          break;
        }
      }

      if (!list.length && lastError) {
        throw lastError;
      }

      const limited = list
        .sort(
          (a, b) =>
            new Date(b.date).valueOf() - new Date(a.date).valueOf()
        )
        .slice(0, lastCount);

      return NextResponse.json({ sport, response: limited });
    }

    const res = await fetch(LIVE_API[sport], {
      headers: { "x-apisports-key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API error", status: res.status },
        { status: res.status }
      );
    }

    const raw = await res.json();
    const list = extractList(raw);

    const normalized =
      sport === "football"
        ? list.map(normalizeFootball)
        : list.map(normalizeV1);

    return NextResponse.json({
      sport,
      response: normalized,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Fetch failed", details: String(err) },
      { status: 500 }
    );
  }
}
