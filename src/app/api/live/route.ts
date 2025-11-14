import { NextRequest, NextResponse } from "next/server";

const LIVE_API: Record<string, string> = {
  football: "https://v3.football.api-sports.io/fixtures?live=all",
  mlb: "https://v1.baseball.api-sports.io/games?league=1&live=all", 
  nba: "https://v1.basketball.api-sports.io/games?league=12&live=all", 
  nfl: "https://v1.american-football.api-sports.io/games?league=1&live=all",
  hockey: "https://v1.hockey.api-sports.io/games?live=all",
  handball: "https://v1.handball.api-sports.io/games?live=all",
};

export async function GET(req: NextRequest) {
  const apiKey = process.env.APISPORTS_KEY;
  const sport = req.nextUrl.searchParams.get("sport") ?? "football";

  if (!LIVE_API[sport]) {
    return NextResponse.json(
      { error: `Neznámy šport: ${sport}` },
      { status: 400 }
    );
  }

  const url = LIVE_API[sport];

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": apiKey! },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API chyba", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      sport,
      response: data.response ?? [],
      raw: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Nepodaril sa fetch live dát", details: String(err) },
      { status: 500 }
    );
  }
}
