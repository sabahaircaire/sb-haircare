import { supabase } from "./supabase";
import type { DiagnosticSummary } from "./db-types";
import type { OnboardingAnswers } from "@/store/onboarding";

async function uriToBase64(uri: string): Promise<{
  base64: string;
  media_type: "image/jpeg" | "image/png" | "image/webp";
}> {
  const resp = await fetch(uri);
  const blob = await resp.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      const m = result.match(/data:(image\/[^;]+);/);
      const mt = (m?.[1] ?? "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/webp";
      resolve({ base64, media_type: mt });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function runDiagnostic(
  answers: OnboardingAnswers,
): Promise<DiagnosticSummary> {
  const payload: Record<string, unknown> = { ...answers };
  delete payload.diagnostic_photo_uri;

  if (answers.diagnostic_photo_uri) {
    try {
      const { base64, media_type } = await uriToBase64(
        answers.diagnostic_photo_uri,
      );
      payload.photo_base64 = base64;
      payload.photo_media_type = media_type;
    } catch {
      // photo optional — ignore on failure
    }
  }

  const { data, error } = await supabase.functions.invoke("diagnostic", {
    body: payload,
  });
  if (error) throw error;
  if (!data?.diagnostic) throw new Error("Diagnostic missing from response");
  return data.diagnostic as DiagnosticSummary;
}
