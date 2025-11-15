import Image from "next/image";
import { Match } from "@/lib/types";

interface MatchDetailsProps {
  match: Match;
  headToHead?: Match[];
  showComparison?: boolean;
  showHero?: boolean;
}

export default function MatchDetails({
  match,
  headToHead = [],
  showComparison = true,
  showHero = true,
}: MatchDetailsProps) {
  const fixtureDate = new Date(match.date).toLocaleString("sk-SK", {
    timeZone: "Europe/Bratislava",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // jednoduchý renderer karty tímu
  const renderTeam = (team: Match["home"], score: number | null) => {
    const logo = team.logo ?? "/window.svg";
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src={logo}
          alt={team.name}
          width={72}
          height={72}
          className="rounded-full bg-gray-800 p-3"
        />
        <p className="text-lg font-semibold text-white">{team.name}</p>
        <span className="text-2xl font-bold text-white">{score ?? "-"}</span>
      </div>
    );
  };

  // základné informácie o zápase
  const matchInfo = [
    { label: "Dátum a čas", value: fixtureDate },
    { label: "Liga", value: match.league.name },
    { label: "ID zápasu", value: match.id },
    { label: "Štadión", value: match.venue ?? "Neznáme" },
    {
      label: "Sezóna",
      value:
        match.season != null && match.season !== ""
          ? String(match.season)
          : new Date(match.date).getFullYear(),
    },
  ];

  // sekcia stavu stretnutia
  const statusInfo = [
    { label: "Stav", value: match.status.long },
    { label: "Kód stavu", value: match.status.short || "—" },
    {
      label: "Uplynulý čas",
      value:
        match.status.elapsed != null ? `${match.status.elapsed}' min` : "—",
    },
    {
      label: "Skóre",
      value: `${match.score.home ?? "-"} : ${match.score.away ?? "-"}`,
    },
  ];

  const calcResult = (isHome: boolean) => {
    const teamScore = isHome ? match.score.home : match.score.away;
    const oppScore = isHome ? match.score.away : match.score.home;

    if (teamScore == null || oppScore == null) {
      return { label: "Bez výsledku", color: "text-gray-300" };
    }

    if (teamScore > oppScore) {
      return { label: "Výhra", color: "text-emerald-300" };
    }
    if (teamScore < oppScore) {
      return { label: "Prehra", color: "text-rose-300" };
    }
    return { label: "Remíza", color: "text-amber-300" };
  };

  // sumár pre každý tím
  const teamInfo = [
    {
      side: "Domáci tím",
      team: match.home,
      score: match.score.home,
      result: calcResult(true),
    },
    {
      side: "Hosťujúci tím",
      team: match.away,
      score: match.score.away,
      result: calcResult(false),
    },
  ];

  const renderInfoCard = (
    title: string,
    rows: { label: string; value: string | number | null }[]
  ) => (
    <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
      <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 border-b border-gray-800 pb-2 last:border-b-0 last:pb-0"
          >
            <span className="text-xs uppercase text-gray-500">
              {row.label}
            </span>
            <span className="text-base text-white">
              {row.value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const hasHeadToHead = headToHead.length > 0;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-10 text-white">
      {showHero && (
        <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="text-sm uppercase tracking-widest text-indigo-300">
              {match.league.name}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">
              {match.home.name} vs {match.away.name}
            </h1>
            <p className="text-gray-400 text-sm">{fixtureDate}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
            {renderTeam(match.home, match.score.home)}

            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-xs uppercase tracking-[0.4em] text-gray-400">
                {match.status.short}
              </span>
              <p className="text-lg text-gray-300">{match.status.long}</p>
              <div className="text-4xl font-black tracking-widest">
                {match.score.home ?? "-"} : {match.score.away ?? "-"}
              </div>
              {match.status.elapsed != null && (
                <p className="text-gray-500 text-sm">
                  {match.status.elapsed}' min
                </p>
              )}
            </div>

            {renderTeam(match.away, match.score.away)}
          </div>
        </div>
      )}

      <div
        className={`${showHero ? "mt-10" : ""} grid gap-6 md:grid-cols-2`}
      >
        {renderInfoCard("O zápase", matchInfo)}
        {renderInfoCard("Stav stretnutia", statusInfo)}
      </div>

      {showComparison && (
        <div className="mt-6 bg-gray-900/70 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300 mb-4">
            Porovnanie tímov
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {teamInfo.map(({ side, team, score, result }) => (
              <div
                key={side}
                className="flex flex-col gap-3 bg-gray-900/60 border border-gray-800 rounded-xl p-4"
              >
                <span className="text-xs uppercase text-gray-500">{side}</span>
                <div className="flex items-center gap-4">
                  <Image
                    src={team.logo ?? "/window.svg"}
                    alt={team.name}
                    width={40}
                    height={40}
                    className="rounded bg-gray-800 p-1"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{team.name}</span>
                    <span className="text-xs text-gray-500">ID: {team.id}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Skóre v zápase:{" "}
                  <span className="text-white font-semibold">
                    {score ?? "-"}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Výsledok:{" "}
                  <span className={`${result.color} font-semibold`}>
                    {result.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasHeadToHead && (
        <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Vzájomné zápasy</h2>
            <span className="text-sm text-gray-400">
              {headToHead.length} zápasov
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {headToHead.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-800/60 rounded-xl p-4 bg-gray-900/70"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-400">
                    {new Date(item.date).toLocaleDateString("sk-SK", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-base font-semibold">
                    {item.home.name} vs {item.away.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">
                    {item.score.home ?? "-"}
                  </span>
                  <span className="text-gray-500">:</span>
                  <span className="text-lg font-bold">
                    {item.score.away ?? "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showComparison && !hasHeadToHead && (
        <div className="mt-6 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-sm text-gray-400">
          Vzájomné zápasy sa nepodarilo načítať.
        </div>
      )}

    </section>
  );
}