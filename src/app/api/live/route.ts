import { NextRequest, NextResponse } from "next/server";
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

/* -----------------------------------------
   FOOTBALL (v3)
----------------------------------------- */
function normalizeFootball(item: any): Match {
  return {
    id: item.fixture.id,
    date: item.fixture.date,

    league: {
      id: item.league.id,
      name: item.league.name,
      logo: item.league.logo,
    },

    status: {
      long: item.fixture.status.long,
      short: item.fixture.status.short,
      elapsed: item.fixture.status.elapsed ?? null,
    },

    home: {
      id: item.teams.home.id,
      name: item.teams.home.name,
      logo: item.teams.home.logo,
    },
    away: {
      id: item.teams.away.id,
      name: item.teams.away.name,
      logo: item.teams.away.logo,
    },

    score: {
      home: item.goals.home,
      away: item.goals.away,
    },
  };
}

/* -----------------------------------------
   V1 ŠPORTY (NBA, MLB, NFL, NHL, Handball)
----------------------------------------- */

function normalizeV1(item: any): Match {
  const teams = item.teams ?? item.game?.teams ?? {};
  const homeTeam = teams.home ?? teams.localteam ?? {};
  const awayTeam = teams.away ?? teams.visitors ?? teams.visitorteam ?? {};

  const scores = item.scores ?? item.score ?? item.goals ?? {};

  const homeScore =
    scores.home?.total ??     // NBA/MLB/NHL/Handball
    (typeof scores.home === "number" ? scores.home : null);

  const awayScore =
    scores.away?.total ??
    (typeof scores.away === "number" ? scores.away : null);

  const st = item.status ?? item.game?.status ?? item.time ?? {};

  return {
    id: item.id ?? item.game?.id ?? "-",
    date: item.date ?? item.game?.date ?? "",

    league: {
      id: item.league?.id ?? "-",
      name: item.league?.name ?? "Unknown League",
      logo: item.league?.logo ?? null,
    },

    status: {
      long: st.long ?? st.current ?? "Unknown",
      short: st.short ?? "",
      elapsed: st.elapsed ?? st.minute ?? null,
    },

    home: {
      id: homeTeam.id ?? "-",
      name: homeTeam.name ?? "Home",
      logo: homeTeam.logo ?? null,
    },

    away: {
      id: awayTeam.id ?? "-",
      name: awayTeam.name ?? "Away",
      logo: awayTeam.logo ?? null,
    },

    score: {
      home: homeScore,
      away: awayScore,
    },
  };
}



/* -----------------------------------------
   API Handler
----------------------------------------- */

export async function GET(req: NextRequest) {
  const apiKey = process.env.APISPORTS_KEY;
  const sport = req.nextUrl.searchParams.get("sport") ?? "football";

  if (!LIVE_API[sport]) {
    return NextResponse.json(
      { error: `Unknown sport: ${sport}` },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(LIVE_API[sport], {
      headers: { "x-apisports-key": apiKey! },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API error", status: res.status },
        { status: res.status }
      );
    }

    const raw = await res.json();

    const list =
      raw.response?.games ??
      raw.games ??
      raw.response ??
      [];

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
