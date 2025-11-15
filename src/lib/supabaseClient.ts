"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// čítame verejné supabase údaje z env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Auth UI will be disabled."
  );
}

// klient sa vytvorí len ak máme konfiguráciu
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClientComponentClient({
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      })
    : undefined;
