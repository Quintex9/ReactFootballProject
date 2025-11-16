"use client";

import { Match } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavoriteAction } from "@/app/actions/favorites";

// kódy pre živý zápas
const LIVE_CODES = new Set([
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

const FINISHED_CODES = new Set([
  "FT",
  "AOT",
  "FT_PEN",
  "FT_OT",
  "FINAL",
  "ENDED",
  "AFTER OT",
  "FT.ET",
]);

const SCHEDULED_CODES = new Set(["NS", "TBD", "POSTP", "CANC", "SCHED", "NOT STARTED"]);

type StatusVariant = "live" | "finished" | "scheduled" | "default";

// vizuálne varianty podľa stavu zápasu
const STATUS_STYLES: Record<
  StatusVariant,
  { card: string; dot: string }
> = {
  live: {
    card: "bg-emerald-900/20 border border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.25)]",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse",
  },
  finished: {
    card: "bg-slate-900/40 border border-slate-700/70",
    dot: "bg-slate-400",
  },
  scheduled: {
    card: "bg-amber-900/25 border border-amber-500/30",
    dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]",
  },
  default: {
    card: "bg-gray-800 border border-gray-700/80",
    dot: "bg-gray-400",
  },
};

// rozhodne vizuálny variant podľa statusu zápasu
function resolveStatusVariant(status: Match["status"]): StatusVariant {
  const code = (status.short || status.long || "").toUpperCase();
  const long = status.long.toLowerCase();

  if (LIVE_CODES.has(code) || long.includes("live") || long.includes("in play")) {
    return "live";
  }
  if (FINISHED_CODES.has(code) || long.includes("finished") || long.includes("ended")) {
    return "finished";
  }
  if (SCHEDULED_CODES.has(code) || long.includes("scheduled") || long.includes("not started")) {
    return "scheduled";
  }
  return "default";
}

interface MatchCardProps {
  match: Match;
  sport: string;
}

// hlavná karta jedného zápasu s akciou na obľúbené
export default function MatchCard({ match, sport }: MatchCardProps) {
  const { isFavorite, auth, refreshFavorites } = useFavorites();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { home, away } = match;
  const { long: status, elapsed } = match.status;
  const scoreHome = match.score.home;
  const scoreAway = match.score.away;
  const { name: league } = match.league;
  const date = match.date;
  const season = match.season;

  const shortStatus =
    status === "Second Half" ? "SH" :
    status === "First Half" ? "FH" :
    status;

  const fixtureDate = new Date(date);
  const formattedDate = fixtureDate.toLocaleString("sk-SK", {
    timeZone: "Europe/Bratislava",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // vytvorenie odkazu na detail so serializovaným zápasom
  const buildDetailHref = (teamId?: number | string) => {
    const encodedSport = encodeURIComponent(sport);
    const matchPayload = encodeURIComponent(JSON.stringify(match));
    const seasonParam =
      season != null ? `&season=${encodeURIComponent(String(season))}` : "";
    const teamParam = teamId ? `&teamId=${encodeURIComponent(String(teamId))}` : "";
    return `/details/${match.id}?sport=${encodedSport}${teamParam}&matchData=${matchPayload}${seasonParam}`;
  };

  // vzhľad karty podľa stavu
  const statusVariant = resolveStatusVariant(match.status);
  const theme = STATUS_STYLES[statusVariant];

  const homeLogo = home.logo ?? "/window.svg";
  const awayLogo = away.logo ?? "/window.svg";
  const favorite = isFavorite(match.id, sport);

  const cardHref = buildDetailHref();

  return (
    <Link
      href={cardHref}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div
        className={`relative flex items-center text-white px-6 py-5 rounded-2xl transition-colors duration-200 transition-transform hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(0,0,0,0.35)] ${theme.card}`}
      >
      <span
        className={`absolute top-3 left-3 h-2 w-2 rounded-full ${theme.dot}`}
      />

      {/* hviezdička na toggle obľúbeného */}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (auth.loading) return;
          if (!auth.session) {
            router.push("/auth");
            return;
          }
          startTransition(async () => {
            await toggleFavoriteAction(match, sport);
            await refreshFavorites();
          });
        }}
        aria-label={favorite ? "Odstrániť z obľúbených" : "Pridať medzi obľúbené"}
        aria-pressed={favorite}
        className="absolute top-2 right-2 text-lg text-gray-500 hover:text-yellow-300 transition-colors disabled:opacity-40"
        disabled={isPending}
      >
        {favorite ? "★" : "☆"}
      </button>

      {/* textový blok so statusom */}
      <div
        className="
          w-9
          [@media(min-width:500px)]:w-20
          sm:w-28
          flex flex-col
          text-xs sm:text-sm font-medium text-gray-200
        "
      >
        {elapsed ? (
          <>
            <span className="block [@media(min-width:500px)]:hidden">
              {shortStatus} {elapsed}'
            </span>
            <span className="hidden [@media(min-width:500px)]:block">
              {status} {elapsed}'
            </span>
          </>
        ) : (
          <span>{status}</span>
        )}
      </div>

      <div className="h-10 w-px bg-gray-700/50 mx-2 [@media(min-width:500px)]:mx-4 rounded-full" />

      {/* názvy tímov + liga */}
      <div className="flex-1 flex flex-col gap-2 min-w-0 pr-6">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={homeLogo}
            alt={home.name}
            width={22}
            height={22}
            className="flex-shrink-0 rounded-sm shadow-sm"
          />
          <span className="truncate text-sm sm:text-base text-gray-100">
            {home.name}
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={awayLogo}
            alt={away.name}
            width={22}
            height={22}
            className="flex-shrink-0 rounded-sm shadow-sm"
          />
          <span className="truncate text-sm sm:text-base text-gray-100">
            {away.name}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 text-xs text-gray-300">
          <span className="truncate">{league}</span>
          <span className="truncate text-[11px] text-gray-500">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* výsledok vpravo */}
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
              : "text-gray-300"
          }
        >
          {scoreHome ?? "-"}
        </span>

        <span
          className={
            scoreHome != null && scoreAway != null && scoreAway > scoreHome
              ? "font-bold text-white"
              : "text-gray-300"
          }
        >
          {scoreAway ?? "-"}
        </span>
      </div>

      <div className="w-px bg-gray-700 ml-4 opacity-60" />
      </div>
    </Link>
  );
}
