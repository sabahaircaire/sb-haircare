export type HairType = "3a" | "3b" | "3c" | "4a" | "4b" | "4c";
export type Porosity = "low" | "medium" | "high";
export type LengthLabel =
  | "oreille"
  | "cou"
  | "epaules"
  | "poitrine"
  | "hanches"
  | "taille"
  | "coccyx";
export type Mood = "amazing" | "good" | "could_be_better";

export type DiagnosticSummary = {
  hair_type: HairType;
  porosity: Porosity;
  density?: "low" | "medium" | "high";
  needs: string[];
  routine_recommendation: {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };
  best_method: "LOC" | "LCO";
  notes: string;
};

export type WashDayStep = {
  order: number;
  title: string;
  duration_min: number;
  instructions: string;
  suggestion?: string;
  reminder?: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  hair_type: HairType | null;
  porosity: Porosity | null;
  current_length: LengthLabel | null;
  goal_length: LengthLabel | null;
  diagnostic_summary: DiagnosticSummary | null;
  diagnostic_completed_at: string | null;
  journey_started_at: string;
  created_at: string;
  updated_at: string;
};

export type UserStats = {
  user_id: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  level_code: string;
  last_active_date: string | null;
  updated_at: string;
};

export type Mission = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  xp_reward: number;
  category: string | null;
  active: boolean;
};

export type WashDayFlow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  total_duration_min: number;
  cadence: string | null;
  steps: WashDayStep[];
  active: boolean;
};
