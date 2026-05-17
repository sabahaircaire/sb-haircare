import { Platform } from "react-native";

// Lazy import expo-haptics to avoid web bundling issues at SSR
let HapticsModule: typeof import("expo-haptics") | null = null;
async function getHaptics() {
  if (Platform.OS === "web") return null;
  if (HapticsModule) return HapticsModule;
  HapticsModule = await import("expo-haptics");
  return HapticsModule;
}

type ImpactStyle = "light" | "medium" | "heavy";

export async function impact(style: ImpactStyle = "medium") {
  if (Platform.OS === "web") {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(style === "light" ? 10 : style === "medium" ? 20 : 40);
    }
    return;
  }
  const H = await getHaptics();
  if (!H) return;
  const map = {
    light: H.ImpactFeedbackStyle.Light,
    medium: H.ImpactFeedbackStyle.Medium,
    heavy: H.ImpactFeedbackStyle.Heavy,
  };
  await H.impactAsync(map[style]);
}

export async function success() {
  if (Platform.OS === "web") {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([10, 50, 20]);
    }
    return;
  }
  const H = await getHaptics();
  if (!H) return;
  await H.notificationAsync(H.NotificationFeedbackType.Success);
}

export async function warning() {
  if (Platform.OS === "web") {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([30, 30, 30]);
    }
    return;
  }
  const H = await getHaptics();
  if (!H) return;
  await H.notificationAsync(H.NotificationFeedbackType.Warning);
}
