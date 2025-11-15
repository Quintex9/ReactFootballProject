import { Match } from "./types";

export function normalizeFootball(item: any): Match {
  return {
    id: item.fixture.id,
    date: item.fixture.date,
    season: item.league.season ?? new Date(item.fixture.date).getFullYear(),
    venue: item.fixture.venue?.name ?? undefined,

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

export function normalizeV1(item: any): Match {
  const teams = item.teams ?? item.game?.teams ?? {};
  const homeTeam = teams.home ?? teams.localteam ?? {};
  const awayTeam = teams.away ?? teams.visitors ?? teams.visitorteam ?? {};

  const scores = item.scores ?? item.score ?? item.goals ?? {};

  const homeScore =
    scores.home?.total ?? (typeof scores.home === "number" ? scores.home : null);

  const awayScore =
    scores.away?.total ?? (typeof scores.away === "number" ? scores.away : null);

  const st = item.status ?? item.game?.status ?? item.time ?? {};

  const dateValue = item.date ?? item.game?.date ?? "";

  const venueValue = (() => {
    const venue = item.venue ?? item.game?.venue ?? item.game?.arena;
    if (!venue) return undefined;
    if (typeof venue === "string") return venue;
    if (typeof venue?.name === "string") return venue.name;
    if (typeof venue?.fullName === "string") return venue.fullName;
    return undefined;
  })();

  return {
    id: item.id ?? item.game?.id ?? "-",
    date: dateValue,
    season:
      item.season ??
      item.league?.season ??
      (dateValue ? new Date(dateValue).getFullYear() : undefined),
    venue: venueValue,

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


