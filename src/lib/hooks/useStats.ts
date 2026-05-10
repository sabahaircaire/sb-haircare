import { useQuery } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { UserStats, Mission } from "@/lib/db-types";

export function useUserStats() {
  return useQuery<UserStats | null>({
    queryKey: ["user_stats"],
    queryFn: async () => {
      if (!isSupabaseConfigured) return null;
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return null;
      const { data } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .single();
      return (data as UserStats) ?? null;
    },
    staleTime: 30 * 1000,
  });
}

export function useDailyMissions() {
  return useQuery<Mission[]>({
    queryKey: ["missions"],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("active", true)
        .limit(3);
      if (error || !data) return [];
      return data as Mission[];
    },
    staleTime: 60 * 1000,
  });
}

export function useTodayCompletedMissionIds() {
  return useQuery<Set<string>>({
    queryKey: ["user_missions", "today"],
    queryFn: async () => {
      if (!isSupabaseConfigured) return new Set<string>();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return new Set<string>();
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("user_missions")
        .select("mission_id")
        .eq("user_id", userId)
        .eq("completed_date", today);
      return new Set((data ?? []).map((r) => r.mission_id as string));
    },
    staleTime: 10 * 1000,
  });
}
