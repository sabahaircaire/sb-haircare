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

export function notifyStepComplete() {
  // Vibration
  if (Platform.OS === "web") {
    try {
      (navigator as any)?.vibrate?.([80, 40, 120]);
    } catch {
      // navigator.vibrate absent (iOS Safari) — on ignore silencieusement
    }
  } else {
    try {
      Vibration.vibrate([0, 80, 40, 120]);
    } catch {
      // pas de moteur de vibration — on ignore
    }
  }

  // Son (web uniquement pour l'instant — synthétisé, sans asset)
  playChime();
}
