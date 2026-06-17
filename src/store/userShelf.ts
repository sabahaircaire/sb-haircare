import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@sb/user-shelf-v1";

export type ShelfItem = {
  product_slug: string; // ref → MARKET_PRODUCTS
  added_at: string; // ISO
  notes?: string;
  rating?: number; // 1-5
};

type State = {
  loaded: boolean;
  items: ShelfItem[];
  load: () => Promise<void>;
  add: (slug: string) => Promise<void>;
  remove: (slug: string) => Promise<void>;
  setNotes: (slug: string, notes: string) => Promise<void>;
  setRating: (slug: string, rating: number) => Promise<void>;
  has: (slug: string) => boolean;
};

async function persist(items: ShelfItem[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export const useUserShelf = create<State>((set, get) => ({
  loaded: false,
  items: [],

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: ShelfItem[] = raw ? JSON.parse(raw) : [];
      set({ items: parsed, loaded: true });
    } catch {
      set({ items: [], loaded: true });
    }
  },

  add: async (slug) => {
    if (get().items.some((i) => i.product_slug === slug)) return;
    const next = [
      ...get().items,
      { product_slug: slug, added_at: new Date().toISOString() },
    ];
    set({ items: next });
    await persist(next);
  },

  remove: async (slug) => {
    const next = get().items.filter((i) => i.product_slug !== slug);
    set({ items: next });
    await persist(next);
  },

  setNotes: async (slug, notes) => {
    const next = get().items.map((i) =>
      i.product_slug === slug ? { ...i, notes } : i,
    );
    set({ items: next });
    await persist(next);
  },

  setRating: async (slug, rating) => {
    const next = get().items.map((i) =>
      i.product_slug === slug ? { ...i, rating } : i,
    );
    set({ items: next });
    await persist(next);
  },

  has: (slug) => get().items.some((i) => i.product_slug === slug),
}));
