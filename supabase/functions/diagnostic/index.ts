// SB Haircare — Diagnostic IA Edge Function
// Reçoit les réponses du questionnaire + image base64 (optionnelle),
// appelle Claude pour générer un profil capillaire structuré.
//
// Déploiement : `supabase functions deploy diagnostic --no-verify-jwt false`
// Secrets requis : ANTHROPIC_API_KEY (à set via `supabase secrets set ANTHROPIC_API_KEY=...`)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

type DiagnosticInput = {
  display_name?: string;
  hair_type?: string;
  porosity?: string;
  current_length?: string;
  goal_length?: string;
  scalp_condition?: string;
  hair_concerns?: string[];
  styling_frequency?: string;
  protective_style_user?: boolean;
  current_routine_summary?: string;
  photo_base64?: string;
  photo_media_type?: "image/jpeg" | "image/png" | "image/webp";
};

const SYSTEM_PROMPT = `Tu es l'experte capillaire de SB Haircare, marque artisanale française dédiée aux cheveux afro-texturés et à l'approche ayurvédique. Tu rédiges un diagnostic capillaire personnalisé en français, à partir des réponses d'un questionnaire et éventuellement d'une photo.

Ton rôle :
- Analyser le profil et identifier 3 à 5 besoins prioritaires (hydratation, rétention, cuir chevelu, casse, définition, etc.)
- Recommander une routine quotidienne (2-3 gestes), hebdomadaire (2-4 gestes), mensuelle (1-2 gestes)
- Choisir entre méthode LOC ou LCO selon la porosité (LOC = porosité moyenne/élevée, LCO = porosité faible)
- Rédiger 2-3 phrases bienveillantes et motivantes pour conclure

Tu réponds UNIQUEMENT en JSON strict, sans texte autour, au format suivant :
{
  "hair_type": "<le type confirmé/ajusté>",
  "porosity": "low|medium|high",
  "density": "low|medium|high",
  "needs": ["besoin 1", "besoin 2", "..."],
  "routine_recommendation": {
    "daily": ["geste 1", "..."],
    "weekly": ["geste 1", "..."],
    "monthly": ["geste 1", "..."]
  },
  "best_method": "LOC|LCO",
  "notes": "2-3 phrases personnalisées"
}`;

function buildUserPrompt(input: DiagnosticInput): string {
  const parts: string[] = [
    `Profil de ${input.display_name ?? "l'utilisatrice"} :`,
    `- Type de cheveux : ${input.hair_type ?? "non précisé"}`,
    `- Porosité auto-évaluée : ${input.porosity ?? "non précisée"}`,
    `- Longueur actuelle : ${input.current_length ?? "non précisée"}`,
    `- Objectif de longueur : ${input.goal_length ?? "non précisé"}`,
    `- Cuir chevelu : ${input.scalp_condition ?? "non précisé"}`,
    `- Préoccupations : ${(input.hair_concerns ?? []).join(", ") || "aucune précisée"}`,
    `- Fréquence des coiffures protectrices : ${input.styling_frequency ?? "non précisée"}`,
  ];
  if (input.current_routine_summary) {
    parts.push(`- Routine actuelle : ${input.current_routine_summary}`);
  }
  if (input.photo_base64) {
    parts.push(
      `\nUne photo des cheveux est jointe. Vérifie/ajuste le type et la porosité si tu vois des indices visuels (forme des coils, brillance, frisottis, état des pointes).`,
    );
  }
  parts.push(
    "\nGénère le diagnostic en JSON strict (aucun texte avant/après).",
  );
  return parts.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
  };

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing ANTHROPIC_API_KEY secret" }),
      { status: 500, headers: corsHeaders },
    );
  }

  let input: DiagnosticInput;
  try {
    input = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const userContent: Array<Record<string, unknown>> = [
    { type: "text", text: buildUserPrompt(input) },
  ];

  if (input.photo_base64 && input.photo_media_type) {
    userContent.unshift({
      type: "image",
      source: {
        type: "base64",
        media_type: input.photo_media_type,
        data: input.photo_base64,
      },
    });
  }

  const apiResp = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    }),
  });

  if (!apiResp.ok) {
    const text = await apiResp.text();
    return new Response(
      JSON.stringify({ error: "Anthropic API error", detail: text }),
      { status: 502, headers: corsHeaders },
    );
  }

  const apiJson = await apiResp.json();
  const textBlock = apiJson?.content?.find?.(
    (b: { type: string }) => b.type === "text",
  );
  const raw = textBlock?.text ?? "";

  let diagnostic: unknown;
  try {
    diagnostic = JSON.parse(raw);
  } catch {
    return new Response(
      JSON.stringify({
        error: "Failed to parse Claude JSON response",
        raw,
      }),
      { status: 502, headers: corsHeaders },
    );
  }

  return new Response(JSON.stringify({ diagnostic }), { headers: corsHeaders });
});
