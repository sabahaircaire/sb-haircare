import { create } from "zustand";
import type {
  HairType,
  Porosity,
  LengthLabel,
  DiagnosticSummary,
} from "@/lib/db-types";

export type OnboardingAnswers = {
  display_name?: string;
  hair_type?: HairType;
  porosity?: Porosity;
  current_length?: LengthLabel;
  goal_length?: LengthLabel;
  scalp_condition?: "dry" | "oily" | "balanced" | "sensitive";
  hair_concerns?: string[];
  styling_frequency?: "low" | "medium" | "high";
  protective_style_user?: boolean;
  current_routine_summary?: string;
  diagnostic_photo_uri?: string;
};

type OnboardingState = {
  answers: OnboardingAnswers;
  diagnostic: DiagnosticSummary | null;
  set: (patch: Partial<OnboardingAnswers>) => void;
  setDiagnostic: (d: DiagnosticSummary) => void;
  reset: () => void;
};

export const useOnboarding = create<OnboardingState>((set) => ({
  answers: {},
  diagnostic: null,
  set: (patch) => set((s) => ({ answers: { ...s.answers, ...patch } })),
  setDiagnostic: (d) => set({ diagnostic: d }),
  reset: () => set({ answers: {}, diagnostic: null }),
}));
