"use client";

import { Match } from "@/lib/types";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";

type FavoriteItem = Match & { sport: string };

interface AuthState {
  session?: Session | null;
  userEmail?: string;
  loading: boolean;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (id: Match["id"], sport: string) => boolean;
  auth: AuthState;
  refreshSession: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  signOut: () => Promise<void>;
}

// globálny context pre obľúbené zápasy
const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

// pomocný kľúč (sport+id)
function makeKey(id: Match["id"], sport: string) {
  return `${sport}:${String(id)}`;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // lokálny stav so zápasmi a auth údajmi
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [auth, setAuth] = useState<AuthState>({
    session: undefined,
    userEmail: undefined,
    loading: true,
  });

  // načítanie supabase session
  const refreshSession = useCallback(async () => {
    if (!supabase) {
      setAuth({ session: undefined, userEmail: undefined, loading: false });
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setAuth({
      session: session ?? undefined,
      userEmail: session?.user?.email ?? undefined,
      loading: false,
    });
  }, []);

  // načítanie zápasov zo supabase tabuľky
  const refreshFavorites = useCallback(async () => {
    if (!supabase) {
      setFavorites([]);
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setFavorites([]);
      return;
    }
    const { data, error } = await supabase
      .from("favorites")
      .select("sport, match_payload")
      .order("created_at", { ascending: false });
    if (error || !data) {
      setFavorites([]);
      return;
    }
    const mapped = data
      .map((row) => {
        if (!row.match_payload) return undefined;
        return { sport: row.sport, ...(row.match_payload as Match) };
      })
      .filter(Boolean) as FavoriteItem[];
    setFavorites(mapped);
  }, []);

  // prvotné načítanie po mountnutí
  useEffect(() => {
    refreshSession();
    refreshFavorites();
  }, [refreshSession, refreshFavorites]);

  // listener na zmeny session
  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshSession();
      refreshFavorites();
    });
    return () => subscription.unsubscribe();
  }, [refreshSession, refreshFavorites]);

  // odhlásenie + lokálny reset
  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuth({ session: undefined, userEmail: undefined, loading: false });
    setFavorites([]);
  }, []);

  const isFavorite = useCallback(
    (id: Match["id"], sport: string) => {
      const key = makeKey(id, sport);
      return favorites.some((item) => makeKey(item.id, item.sport) === key);
    },
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      auth,
      refreshSession,
      refreshFavorites,
      signOut,
    }),
    [favorites, isFavorite, auth, refreshSession, refreshFavorites, signOut]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return ctx;
}

