"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Match } from "@/lib/types";

export async function toggleFavoriteAction(match: Match, sport: string) {
  const cookieStore = await cookies();
  const supabase = createServerActionClient({
    cookies: () =>
      cookieStore as unknown as ReturnType<typeof cookies>,
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("match_id", match.id)
    .eq("sport", sport)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
  } else {
    await supabase.from("favorites").insert({
      user_id: user.id,
      match_id: String(match.id),
      sport,
      match_payload: match,
    });
  }

  revalidatePath("/favorites");
}

