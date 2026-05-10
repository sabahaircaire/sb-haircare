import { supabase } from "./supabase";

type Result = { step_order: number; completed: boolean; skipped: boolean };

export async function saveWashDayLog(params: {
  flowId: string;
  results: Result[];
  feedback?: "amazing" | "good" | "could_be_better";
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error("Not authenticated");

  const { error } = await supabase.from("wash_day_logs").insert({
    user_id: userId,
    flow_id: params.flowId,
    completed_at: new Date().toISOString(),
    steps_completed: params.results,
    feedback: params.feedback ?? null,
    before_photo_url: params.beforePhotoUrl ?? null,
    after_photo_url: params.afterPhotoUrl ?? null,
  });
  if (error) throw error;
}
