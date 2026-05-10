import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ProtectiveStyleLog = {
  id: string;
  user_id: string;
  style_code: string;
  style_name: string;
  installed_on: string;
  recommended_remove_on: string;
  removed_on: string | null;
  reminder_enabled: boolean;
  created_at: string;
};

export function useCurrentProtectiveStyle() {
  return useQuery<ProtectiveStyleLog | null>({
    queryKey: ["protective_style", "current"],
    queryFn: async () => {
      if (!isSupabaseConfigured) return null;
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return null;
      const { data } = await supabase
        .from("protective_style_logs")
        .select("*")
        .eq("user_id", userId)
        .is("removed_on", null)
        .order("installed_on", { ascending: false })
        .limit(1)
        .maybeSingle();
      return (data as ProtectiveStyleLog) ?? null;
    },
    staleTime: 30 * 1000,
  });
}

export function useStartProtectiveStyle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      style_code: string;
      style_name: string;
      duration_weeks_max: number;
      installed_on?: string;
    }) => {
      if (!isSupabaseConfigured) throw new Error("Supabase non configuré");
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("Non connectée");
      const installed = params.installed_on ?? new Date().toISOString().slice(0, 10);
      const removeOn = new Date(installed);
      removeOn.setDate(removeOn.getDate() + params.duration_weeks_max * 7);
      const { error } = await supabase.from("protective_style_logs").insert({
        user_id: userId,
        style_code: params.style_code,
        style_name: params.style_name,
        installed_on: installed,
        recommended_remove_on: removeOn.toISOString().slice(0, 10),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protective_style"] });
    },
  });
}

export function useEndProtectiveStyle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const today = new Date().toISOString().slice(0, 10);
      const { error } = await supabase
        .from("protective_style_logs")
        .update({ removed_on: today })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["protective_style"] });
    },
  });
}

// Utilities
export function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function daysRemaining(log: ProtectiveStyleLog): number {
  const today = new Date().toISOString().slice(0, 10);
  return daysBetween(today, log.recommended_remove_on);
}
