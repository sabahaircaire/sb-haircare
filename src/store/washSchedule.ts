import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@sb/wash-schedule-v2";

export type Scheduled = {
  date: string; // YYYY-MM-DD
  flow_code?: string;
  product_slugs?: string[]; // SB or market product slugs (mixed)
  notes?: string;
};

type State = {
  loaded: boolean;
  scheduled: Scheduled[];
  load: () => Promise<void>;
  schedule: (entry: Scheduled) => Promise<void>;
  unschedule: (date: string) => Promise<void>;
  getForDate: (date: string) => Scheduled | undefined;
};

async function persist(items: Scheduled[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const useWashSchedule = create<State>((set, get) => ({
  loaded: false,
  scheduled: [],

  load: async () => {
    try {
      // Try v2 first, then migrate v1 if present
      let raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const v1 = await AsyncStorage.getItem("@sb/wash-schedule-v1");
        if (v1) raw = v1;
      }
      const parsed: Scheduled[] = raw ? JSON.parse(raw) : [];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      const fresh = parsed.filter((s) => s.date >= cutoffStr);
      set({ scheduled: fresh, loaded: true });
    } catch {
      set({ scheduled: [], loaded: true });
    }
  },

  schedule: async (entry) => {
    const next = [
      ...get().scheduled.filter((s) => s.date !== entry.date),
      entry,
    ].sort((a, b) => a.date.localeCompare(b.date));
    set({ scheduled: next });
    await persist(next);
  },

  unschedule: async (date) => {
    const next = get().scheduled.filter((s) => s.date !== date);
    set({ scheduled: next });
    await persist(next);
  },

  getForDate: (date) => get().scheduled.find((s) => s.date === date),
}));

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isPast(iso: string): boolean {
  return iso < todayISO();
}

export function isFuture(iso: string): boolean {
  return iso > todayISO();
}

export function nextNDays(
  n: number,
  start?: Date,
): { iso: string; date: Date }[] {
  const result: { iso: string; date: Date }[] = [];
  const base = start ? new Date(start) : new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    result.push({ iso: d.toISOString().slice(0, 10), date: d });
  }
  return result;
}
