"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Match } from "@/lib/types";

export async function toggleFavoriteAction(match: Match, sport: string) {
  // načítame cookies pre server action
  const cookieStore = await cookies();
  const supabase = createServerActionClient({
    cookies: () =>
      cookieStore as unknown as ReturnType<typeof cookies>,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // ak nie je session, stopneme toggle
    throw new Error("Not authenticated");
  }

  // zistíme, či už je zápas v obľúbených 
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("match_id", match.id)
    .eq("sport", sport)
    .maybeSingle();

  if (existing) {
    // ak existuje, vymažeme
    await supabase.from("favorites").delete().eq("id", existing.id);
  } else {
    // inak vložíme nový záznam
    await supabase.from("favorites").insert({
      user_id: user.id,
      match_id: String(match.id),
      sport,
      match_payload: match,
    });
  }

  // revalidujeme server componentu /favorites
  revalidatePath("/favorites");
}

