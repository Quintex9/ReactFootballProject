"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SportSelector, { SPORTS } from "./components/SportSelector";
import LeagueSelector from "./components/LeagueSelector";
import LiveMatches from "./components/LiveMatches";
import { useFavorites } from "@/context/FavoritesContext";

function HomeContent() {
  const { auth, signOut } = useFavorites();
  const searchParams = useSearchParams();
  const selectedSport = searchParams.get("sport") || "football";
  const selectedLeague = searchParams.get("league") || "";

  const sportLabel =
    SPORTS.find((sport) => sport.key === selectedSport)?.label ?? "Football";

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
          <div className="space-y-4 text-sm text-gray-200">
            <div className="flex items-center gap-3">
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-400" />
              <span>Práve prebieha</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
              <span>Zápas sa ešte nezačal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block h-3 w-3 rounded-full bg-slate-500" />
              <span>Dohraný alebo odložený duel</span>
            </div>
          </div>
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
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#050505] via-slate-950 to-[#050505] text-white">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-xl">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.5em] text-indigo-200/70">
              Live monitoring
            </p>

            <div className="flex flex-col gap-2">
              <h1 className="text-4xl sm:text-5xl font-semibold">
                Live športové výsledky
              </h1>
              <p className="text-base text-slate-200/80 max-w-2xl">
                Sledujte aktuálne dianie naprieč viacerými ligami. Obnovujeme
                každých 20 sekúnd.
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-200/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Auto-refresh
                </dt>
                <dd className="text-lg font-semibold text-white">20 sekúnd</dd>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                  Zdroj dát
                </dt>
                <dd className="text-lg font-semibold text-white">API-SPORTS</dd>
              </div>
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
