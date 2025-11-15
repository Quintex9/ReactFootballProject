import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import MatchCard from "@/app/components/MatchCard";
import { Match } from "@/lib/types";
import BackButton from "@/components/BackButton";

type FavoriteRow = {
  sport: string;
  match_payload: Match;
};

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () =>
      cookieStore as unknown as ReturnType<typeof cookies>,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const { data } = (await supabase
    .from("favorites")
    .select("sport, match_payload")
    .order("created_at", { ascending: false })) as {
    data: FavoriteRow[] | null;
  };

  const favorites =
    data?.map((row) => ({
      sport: row.sport,
      ...row.match_payload,
    })) ?? [];
  const favoriteCount = favorites.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] via-slate-950 to-[#030712] text-white">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <BackButton label="Späť" />
          <span className="text-xs uppercase tracking-[0.35em] text-indigo-200/70">
            Synced via Supabase
          </span>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-[0_25px_55px_rgba(15,23,42,0.65)] space-y-5">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.45em] text-indigo-200/80">
              Uložené zápasy
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Obľúbené zápasy
            </h1>
            <p className="text-sm text-slate-200/80 max-w-2xl">
              Hviezdička na liste zápasov okamžite uloží zápas a synchronizuje
              ho s vaším Supabase účtom. Zápasy sa nestratia ani po prihlásení z
              iného zariadenia.
            </p>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-200/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                Počet zápasov
              </dt>
              <dd className="text-3xl font-semibold">{favoriteCount}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                Posledný uložený šport
              </dt>
              <dd className="text-lg font-semibold capitalize">
                {favorites[0]?.sport ?? "—"}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.4em] text-indigo-200">
                Status
              </dt>
              <dd className="text-lg font-semibold text-emerald-300">
                Aktívna synchronizácia
              </dd>
            </div>
          </dl>
        </section>

        {favoriteCount === 0 ? (
          <div className="rounded-3xl border border-gray-800/70 bg-gray-900/70 px-6 py-10 text-center text-gray-300 shadow-[0_15px_40px_rgba(15,23,42,0.45)]">
            <p className="text-lg font-semibold mb-2">
              Zatiaľ žiadne obľúbené zápasy
            </p>
            <p className="text-sm text-gray-400">
              Kliknite na hviezdičku pri živom zápase a okamžite ho uložíme do
              vášho účtu.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {favorites.map((favorite) => (
              <MatchCard
                key={`${favorite.sport}-${favorite.id}`}
                match={favorite}
                sport={favorite.sport}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
