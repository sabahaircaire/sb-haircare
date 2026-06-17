import { Platform, Vibration } from "react-native";

// Feedback déclenché quand un minuteur d'étape atteint 0.
// Volontairement sans dépendance : vibration native via l'API React Native,
// vibration web via navigator.vibrate, et son synthétisé via Web Audio
// (aucun fichier audio à bundler). Les haptics iOS fines viendront avec le
// build natif (expo-haptics) — le point d'entrée est déjà prêt.

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (Platform.OS !== "web") return null;
  try {
    const Ctx =
      (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx && audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

// À appeler sur un vrai geste utilisateur (ex: bouton Démarrer) pour
// débloquer l'audio web — sinon le navigateur peut refuser de jouer le son.
export function primeStepAudio() {
  getAudioCtx();
}

// Petit carillon « ding-dong » doux : deux notes sinus qui s'éteignent.
function playChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [
    { freq: 987.77, start: 0, dur: 0.55 }, // Si5
    { freq: 1318.51, start: 0.13, dur: 0.65 }, // Mi6
  ];
  for (const { freq, start, dur } of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t0 = now + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }
}

function vibrate(pattern: number[], webPattern: number[]) {
  if (Platform.OS === "web") {
    try {
      (navigator as any)?.vibrate?.(webPattern);
    } catch {
      // navigator.vibrate absent (iOS Safari) — on ignore silencieusement
    }
  } else {
    try {
      Vibration.vibrate(pattern);
    } catch {
      // pas de moteur de vibration — on ignore
    }
  }
}

export function notifyStepComplete() {
  vibrate([0, 80, 40, 120], [80, 40, 120]);
  // Son (web uniquement pour l'instant — synthétisé, sans asset)
  playChime();
}

// Célébration « majeure » (fin de flow, toutes les missions) — plus
// triomphante : vibration plus longue + petit arpège ascendant.
export function notifyCelebration() {
  vibrate([0, 60, 40, 60, 40, 160], [60, 40, 60, 40, 160]);
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [
    { freq: 1046.5, start: 0 }, // Do6
    { freq: 1318.51, start: 0.12 }, // Mi6
    { freq: 1567.98, start: 0.24 }, // Sol6
    { freq: 2093.0, start: 0.38 }, // Do7
  ];
  for (const { freq, start } of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t0 = now + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.15, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.55);
  }
}
