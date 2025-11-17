"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SportSelector, { SPORTS } from "./components/SportSelector";
import LeagueSelector from "./components/LeagueSelector";
import LiveMatches from "./components/LiveMatches";
import { useFavorites } from "@/context/FavoritesContext";
import InfoCard from "./components/InfoCard"
import StatusLegendItem from "./components/StatusLegendItem";

function HomeContent() {
  const { auth, signOut } = useFavorites();
  const searchParams = useSearchParams();
  const selectedSport = searchParams.get("sport") || "football";
  const selectedLeague = searchParams.get("league") || "";

  return (
    <>
      <Suspense fallback={<div className="h-12" />}>
        <SportSelector />
      </Suspense>
      <Suspense fallback={<div className="h-12" />}>
        <LeagueSelector sport={selectedSport} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-900/70 border border-gray-800/70 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/70 mb-4">
            Legenda statusov
          </p>
          <StatusLegendItem color="bg-emerald-400" label="Práve prebieha" />
          <StatusLegendItem color="bg-amber-400" label="Zápas sa ešte nezačal" />
          <StatusLegendItem color="bg-slate-500" label="Dohraný alebo odložený duel" />

        </div>

        <div className="rounded-2xl bg-gray-900/70 border border-gray-800/70 p-5 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-100/70">
            Rýchla navigácia
          </p>

          <div className="flex flex-wrap gap-3">
            {!auth.loading && !auth.session && (
              <Link
                href="/auth"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-indigo-500/50 bg-indigo-500/15 px-5 py-2 text-sm font-semibold text-indigo-100"
              >
                Prihlásiť / Registrovať →
              </Link>
            )}

            {!auth.loading && auth.session && (
              <button
                onClick={signOut}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-rose-500/50 bg-rose-500/15 px-5 py-2 text-sm font-semibold text-rose-100"
              >
                Odhlásiť sa
              </button>
            )}

            <Link
              href="/favorites"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/15 px-5 py-2 text-sm font-semibold text-yellow-100"
            >
              Obľúbené zápasy ★
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            Uložené zápasy sa synchronizujú cez Supabase.
          </p>
        </div>
      </div>

      <LiveMatches sport={selectedSport} league={selectedLeague} />
    </>
  );
}

export default function HomePage() {
  const sportsCount = SPORTS.length;

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#050505] via-slate-950 to-[#050505] text-white">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl p-6 md:p-10 shadow-[0_20px_70px_rgba(15,15,25,0.45)]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl sm:text-5xl font-semibold">
                Live športové výsledky
              </h1>
              <p className="text-base text-slate-200/85 max-w-3xl">
                Sledujte aktuálne dianie naprieč viacerými ligami. Dáta obnovujeme automaticky,
                aby ste mali vždy čerstvé skóre aj status zápasov.
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-200/80">
              <InfoCard
                icon="🔁"
                title="Auto-refresh"
                value="20 s"
                note="okamžité obnovenie feedu cez SWR"
                hoverBorderClass="hover:border-indigo-300/40"
                hoverShadowClass="hover:shadow-indigo-500/10"
              />

              <InfoCard
                icon="📡"
                title="Zdroj dát"
                value="API-SPORTS"
                note="oficiálne live endpointy a štatistiky"
                hoverBorderClass="hover:border-emerald-200/40"
                hoverShadowClass="hover:shadow-emerald-400/10"
              />

              <InfoCard
                icon="⭐"
                title="Pokryté športy"
                value={`${sportsCount}+`}
                note="futbal, basketbal, hokej a ďalšie ligy"
                hoverBorderClass="hover:border-amber-200/40"
                hoverShadowClass="hover:shadow-amber-400/10"
              />
            </dl>
          </div>
        </header>

        <Suspense fallback={<div className="text-center py-12">Načítavam…</div>}>
          <HomeContent />
        </Suspense>
      </div>
    </main>
  );
}
