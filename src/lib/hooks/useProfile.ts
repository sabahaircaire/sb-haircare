import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/lib/db-types";

export function useProfile() {
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!isSupabaseConfigured) return null;
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) return null;
      return data as Profile;
    },
    staleTime: 30 * 1000,
  });
}

// Generate a stylized "username" from hair type + porosity.
export function buildUsername(profile: Profile | null | undefined): string {
  if (!profile?.hair_type) return "@SBHaircare";
  const ht = profile.hair_type.toUpperCase();
  const por = profile.porosity ?? "medium";
  const porLabel =
    por === "low" ? "Low" : por === "high" ? "High" : "Medium";
  return `@${ht}${porLabel}Crown`;
}

export function porosityLabel(
  p: Profile["porosity"] | undefined,
): string {
  if (p === "low") return "Porosité faible";
  if (p === "high") return "Porosité élevée";
  return "Porosité moyenne";
}

export function bestMethod(p: Profile["porosity"]): "LCO" | "LOC" {
  // Low porosity benefits from leave-in-Cream-Oil order; LOC for medium/high.
  return p === "low" ? "LCO" : "LOC";
}

export function todayTip(p: Profile["porosity"]): string {
  if (p === "low") return "Hydrate avec chaleur douce — la clé pour pénétrer.";
  if (p === "high")
    return "Scelle avec une huile lourde après chaque hydratation.";
  return "Hydrate tous les 2-3 jours pour garder tes coils souples.";
}
