import { Match } from "@/lib/types";
import Image from "next/image";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { home, away } = match.teams;
  const { long: status, elapsed } = match.fixture.status;
  const scoreHome = match.goals.home;
  const scoreAway = match.goals.away;
  const { name: league } = match.league;
  const { date } = match.fixture;

  // Skrátené verzie statusu pre malé obrazovky
  const shortStatus =
    status === "Second Half" ? "SH" :
    status === "First Half" ? "FH" :
    status;

  // Dátum v lokálnom formáte (Europe/Bratislava)
  const fixtureDate = new Date(date);
  const formattedDate = fixtureDate.toLocaleString("sk-SK", {
    timeZone: "Europe/Bratislava",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center bg-gray-800 text-white px-6 py-4 border-b border-gray-700 hover:bg-gray-750/70 transition-colors">

      {/* Ľavý stĺpec – čas / status */}
      <div
        className="
          w-9
          [@media(min-width:500px)]:w-20
          sm:w-28
          flex items-center
          text-xs sm:text-sm font-medium text-gray-300
        "
      >
        {elapsed ? (
          <>
            {/* <500px → Skrátená Verzia (SH, FH) */}
            <span className="block [@media(min-width:500px)]:hidden">
              {shortStatus} {elapsed}'
            </span>

            {/*  ≥500px → Plná Verzia */}
            <span className="hidden [@media(min-width:500px)]:block">
              {status} {elapsed}'
            </span>
          </>
        ) : (
          <span>{status}</span>
        )}
      </div>

      {/* Vertikálna čiara medzi časom a zápasom */}
      <div className="h-10 w-px bg-gray-700/50 mx-2 [@media(min-width:500px)]:mx-4 rounded-full" />

      {/* Stred – tímy + liga + dátum */}
      <div className="flex-1 flex flex-col gap-2 min-w-0 pr-6">

        {/* Domáci tím */}
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={home.logo}
            alt={home.name}
            width={22}
            height={22}
            className="flex-shrink-0 rounded-sm shadow-sm"
          />
          <span className="truncate text-sm sm:text-base text-gray-200">
            {home.name}
          </span>
        </div>

        {/* Hosťujúci tím */}
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={away.logo}
            alt={away.name}
            width={22}
            height={22}
            className="flex-shrink-0 rounded-sm shadow-sm"
          />
          <span className="truncate text-sm sm:text-base text-gray-200">
            {away.name}
          </span>
        </div>

        {/* Liga + dátum */}
        <div className="flex flex-col gap-0.5 text-xs text-gray-400">
          <span className="truncate">{league}</span>
          <span className="truncate text-[11px] text-gray-500">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Pravý stĺpec – skóre */}
      <div
        className="
          w-2 [@media(min-width:500px)]:w-14
          pl-1 [@media(min-width:500px)]:pl-2
          flex flex-col items-end justify-center gap-2 
          text-sm sm:text-base
        "
      >
        <span
          className={
            scoreHome != null && scoreAway != null && scoreHome > scoreAway
              ? "font-bold text-white"
              : "text-gray-400"
          }
        >
          {scoreHome ?? "-"}
        </span>

        <span
          className={
            scoreHome != null && scoreAway != null && scoreAway > scoreHome
              ? "font-bold text-white"
              : "text-gray-400"
          }
        >
          {scoreAway ?? "-"}
        </span>
      </div>

      {/* Pravý vertikálny delimiter */}
      <div className="w-px bg-gray-700 ml-4 opacity-60" />
    </div>
  );
}
