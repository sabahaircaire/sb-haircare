import { create } from "zustand";
import type { WashDayFlow } from "@/lib/db-types";

type StepResult = {
  step_order: number;
  completed: boolean;
  skipped: boolean;
};

type WashFlowState = {
  flow: WashDayFlow | null;
  currentStepIndex: number;
  results: StepResult[];
  beforePhotoUri?: string;
  afterPhotoUri?: string;
  feedback?: "amazing" | "good" | "could_be_better";
  start: (flow: WashDayFlow) => void;
  completeCurrentStep: () => void;
  skipCurrentStep: () => void;
  setBeforePhoto: (uri: string) => void;
  setAfterPhoto: (uri: string) => void;
  setFeedback: (f: "amazing" | "good" | "could_be_better") => void;
  reset: () => void;
};

export const useWashFlow = create<WashFlowState>((set, get) => ({
  flow: null,
  currentStepIndex: 0,
  results: [],
  start: (flow) =>
    set({
      flow,
      currentStepIndex: 0,
      results: [],
      beforePhotoUri: undefined,
      afterPhotoUri: undefined,
      feedback: undefined,
    }),
  completeCurrentStep: () => {
    const { flow, currentStepIndex, results } = get();
    if (!flow) return;
    const step = flow.steps[currentStepIndex];
    set({
      results: [
        ...results,
        { step_order: step.order, completed: true, skipped: false },
      ],
      currentStepIndex: currentStepIndex + 1,
    });
  },
  skipCurrentStep: () => {
    const { flow, currentStepIndex, results } = get();
    if (!flow) return;
    const step = flow.steps[currentStepIndex];
    set({
      results: [
        ...results,
        { step_order: step.order, completed: false, skipped: true },
      ],
      currentStepIndex: currentStepIndex + 1,
    });
  },
  setBeforePhoto: (uri) => set({ beforePhotoUri: uri }),
  setAfterPhoto: (uri) => set({ afterPhotoUri: uri }),
  setFeedback: (f) => set({ feedback: f }),
  reset: () =>
    set({
      flow: null,
      currentStepIndex: 0,
      results: [],
      beforePhotoUri: undefined,
      afterPhotoUri: undefined,
      feedback: undefined,
    }),
}));
