import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { UserStats, Mission } from "@/lib/db-types";

const COMPLETED_TODAY_KEY = ["user_missions", "today"] as const;

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
    queryKey: COMPLETED_TODAY_KEY,
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

// Coche / décoche une mission pour aujourd'hui (persisté en base), avec
// mise à jour optimiste du Set des missions complétées et rollback en cas d'échec.
export function useToggleMission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mission,
      done,
    }: {
      mission: Mission;
      done: boolean;
    }) => {
      if (!isSupabaseConfigured) return;
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("not_authenticated");
      const today = new Date().toISOString().slice(0, 10);
      if (done) {
        const { error } = await supabase
          .from("user_missions")
          .delete()
          .eq("user_id", userId)
          .eq("mission_id", mission.id)
          .eq("completed_date", today);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_missions").insert({
          user_id: userId,
          mission_id: mission.id,
          completed_date: today,
          xp_earned: mission.xp_reward,
        });
        if (error) throw error;
      }
    },
    onMutate: async ({ mission, done }) => {
      await qc.cancelQueries({ queryKey: COMPLETED_TODAY_KEY });
      const prev = qc.getQueryData<Set<string>>(COMPLETED_TODAY_KEY);
      const next = new Set(prev ?? []);
      if (done) next.delete(mission.id);
      else next.add(mission.id);
      qc.setQueryData(COMPLETED_TODAY_KEY, next);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(COMPLETED_TODAY_KEY, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: COMPLETED_TODAY_KEY });
    },
  });
}
