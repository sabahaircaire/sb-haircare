import { Platform, Alert } from "react-native";

// Lazy import to avoid web SSR errors
let NotifModule: typeof import("expo-notifications") | null = null;
async function getNotif() {
  if (Platform.OS === "web" && typeof window === "undefined") return null;
  if (NotifModule) return NotifModule;
  try {
    NotifModule = await import("expo-notifications");
    return NotifModule;
  } catch {
    return null;
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  // Web: use the browser Notification API
  if (Platform.OS === "web") {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const res = await Notification.requestPermission();
    return res === "granted";
  }

  const N = await getNotif();
  if (!N) return false;
  const { status: existing } = await N.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await N.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedule a wash day reminder. Fires at 9am on the given date.
 * Returns the scheduled notification id on native, or "web" if browser-scheduled.
 * On web, we just show an immediate confirmation since persistent scheduling
 * isn't reliable across browser sessions.
 */
export async function scheduleWashDayReminder(dateIso: string): Promise<string | null> {
  const target = new Date(dateIso + "T09:00:00");
  if (target.getTime() < Date.now()) {
    // Past or now — show immediately
    target.setTime(Date.now() + 5000);
  }

  if (Platform.OS === "web") {
    if (typeof window === "undefined" || !("Notification" in window)) return null;
    if (Notification.permission !== "granted") return null;
    // Schedule via setTimeout (only works while browser tab is open).
    // Best-effort — production should use a server-side push.
    const delay = target.getTime() - Date.now();
    if (delay > 0 && delay < 24 * 3600 * 1000) {
      setTimeout(() => {
        new Notification("🌸 C'est ton wash day !", {
          body: "Lance ton flow et prends soin de tes cheveux ✨",
        });
      }, delay);
    }
    return "web";
  }

  const N = await getNotif();
  if (!N) return null;
  return await N.scheduleNotificationAsync({
    content: {
      title: "🌸 C'est ton wash day !",
      body: "Lance ton flow et prends soin de tes cheveux ✨",
      sound: "default",
    },
    trigger: { type: N.SchedulableTriggerInputTypes.DATE, date: target } as any,
  });
}

export async function cancelAllScheduled() {
  if (Platform.OS === "web") return;
  const N = await getNotif();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
}

export async function getReminderStatus(): Promise<
  "granted" | "denied" | "undetermined" | "unsupported"
> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined" || !("Notification" in window))
      return "unsupported";
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    return "undetermined";
  }
  const N = await getNotif();
  if (!N) return "unsupported";
  const { status } = await N.getPermissionsAsync();
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
}

export function notifyImmediate(title: string, body: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch {}
    }
    return;
  }
  // Native fallback — fire-and-forget local notification
  (async () => {
    const N = await getNotif();
    if (!N) return;
    await N.scheduleNotificationAsync({
      content: { title, body, sound: "default" },
      trigger: null,
    });
  })();
}
