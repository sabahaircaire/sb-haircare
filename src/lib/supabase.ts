import "react-native-url-polyfill/auto";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Falls back to a stub URL so static rendering / first runs don't crash before
// the user provisions Supabase. Real calls will fail at runtime if env is missing.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured =
  !!process.env.EXPO_PUBLIC_SUPABASE_URL &&
  !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// During static rendering (Expo Web SSR pass), there's no `window`, so
// AsyncStorage's web adapter crashes. Use an in-memory no-op storage when
// running on the server, real storage in the browser/native.
const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const memoryStorage = (() => {
  const store = new Map<string, string>();
  return {
    getItem: async (k: string) => store.get(k) ?? null,
    setItem: async (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: async (k: string) => {
      store.delete(k);
    },
  };
})();

const storage =
  Platform.OS === "web" ? (isBrowser ? AsyncStorage : memoryStorage) : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: isBrowser || Platform.OS !== "web",
    persistSession: isBrowser || Platform.OS !== "web",
    detectSessionInUrl: false,
  },
});
