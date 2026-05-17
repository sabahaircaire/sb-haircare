import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@sb/wash-schedule-v1";

type Scheduled = {
  date: string; // YYYY-MM-DD
  flow_code?: string;
};

type State = {
  loaded: boolean;
  scheduled: Scheduled[];
  load: () => Promise<void>;
  schedule: (date: string, flow_code?: string) => Promise<void>;
  unschedule: (date: string) => Promise<void>;
  getForDate: (date: string) => Scheduled | undefined;
};

async function persist(items: Scheduled[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore — best effort
  }
}

export const useWashSchedule = create<State>((set, get) => ({
  loaded: false,
  scheduled: [],

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: Scheduled[] = raw ? JSON.parse(raw) : [];
      // Drop entries older than 30 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      const fresh = parsed.filter((s) => s.date >= cutoffStr);
      set({ scheduled: fresh, loaded: true });
    } catch {
      set({ scheduled: [], loaded: true });
    }
  },

  schedule: async (date, flow_code) => {
    const next = [
      ...get().scheduled.filter((s) => s.date !== date),
      { date, flow_code },
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

export function nextNDays(n: number, start?: Date): { iso: string; date: Date }[] {
  const result: { iso: string; date: Date }[] = [];
  const base = start ? new Date(start) : new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    result.push({ iso: d.toISOString().slice(0, 10), date: d });
  }
  return result;
}
