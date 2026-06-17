// Phrases de félicitation pour les écrans de célébration.

const FLOW_PHRASES = [
  "Tes cheveux te remercient déjà 💛",
  "Une routine de plus vers ta plus belle version 👑",
  "Douceur + régularité = pousse. Tu gères.",
  "Tu as pris ce temps pour toi. C'est ça, le glow up ✨",
  "Wash day bouclé comme une pro. Bravo !",
];

const MISSION_PHRASES = [
  "Toutes tes missions validées, reine 👑",
  "Sans-faute aujourd'hui ! Ta constance paie.",
  "Objectif du jour atteint — tes cheveux adorent cette régularité.",
  "Tu coches, tu brilles. Continue comme ça ✨",
  "Journée parfaite côté soin. On est fières de toi 💛",
];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function pickFlowPhrase(): string {
  return pick(FLOW_PHRASES);
}

export function pickMissionPhrase(): string {
  return pick(MISSION_PHRASES);
}
