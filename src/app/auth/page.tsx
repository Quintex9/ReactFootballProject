"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  // prepínač medzi loginom a registráciou
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // obsluha formulára
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage("Supabase nie je nakonfigurované. Doplňte env premenné.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Prihlásenie prebehlo úspešne.");
        router.push("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Skontrolujte email a potvrďte registráciu.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Neznáma chyba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-200 transition-colors"
        >
          <span>←</span> Späť na hlavnú stránku
        </Link>
        <div className="grid md:grid-cols-2 gap-6 bg-gray-900/70 border border-gray-800 rounded-3xl p-6 shadow-2xl">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {mode === "signin" ? "Prihlásenie" : "Registrácia"}
            </h1>
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "signin" ? "signup" : "signin"))
              }
              className="text-xs text-indigo-300 border border-indigo-500/40 rounded-full px-3 py-1 hover:bg-indigo-500/10 transition-colors"
            >
              {mode === "signin" ? "Prepnúť na registráciu" : "Prepnúť na login"}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {mode === "signin"
              ? "Zadajte email a heslo pre prístup k personalizovaným funkciám."
              : "Vytvorte si nový účet a synchronizujte obľúbené zápasy."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="john@doe.com"
              className="rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            <label className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Heslo
            </label>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="min. 6 znakov"
              className="rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-3 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-sm font-semibold py-2 transition-colors disabled:opacity-50"
            >
              {loading
                ? "Spracovanie..."
                : mode === "signin"
                ? "Prihlásiť sa"
                : "Registrovať"}
            </button>

            {message && (
              <p className="text-xs text-gray-300 border border-gray-700 rounded-xl px-3 py-2 bg-gray-900/50">
                {message}
              </p>
            )}
          </form>
        </section>

        <section className="flex flex-col gap-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
          <h2 className="text-xl font-semibold">Nemáte účet?</h2>
          <p className="text-sm text-gray-400">
            Registrácia vám umožní ukladať obľúbené zápasy.
          </p>
          <div className="space-y-3">
            <div className="rounded-xl bg-gray-800/60 border border-gray-700 px-4 py-3 text-sm text-gray-300">
              <span className="font-semibold text-white">Supabase Auth</span>
              <p className="text-gray-500 text-xs mt-1">
                Bezpečný email+heslo login, magic linky alebo OAuth poskytovatelia.
              </p>
            </div>
            <div className="rounded-xl bg-gray-800/40 border border-gray-700 px-4 py-3 text-sm text-gray-300">
              <span className="font-semibold text-white">
                Bezpečné uloženie údajov
              </span>
              <p className="text-gray-500 text-xs mt-1">
                Všetky obľúbené zápasy sa ukladajú do Supabase DB s RLS.
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p>1. Vyplňte email + heslo</p>
            <p>2. Potvrďte email (pri registrácii)</p>
            <p>3. Po prihlásení sprístupníme obľúbené zápasy</p>
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}
