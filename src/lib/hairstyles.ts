export type HairstyleCategory =
  | "braids"
  | "twists"
  | "cornrows"
  | "wig"
  | "natural"
  | "locs";

export type Hairstyle = {
  code: string;
  name: string;
  category: HairstyleCategory;
  duration_weeks_max: number;
  duration_weeks_min: number;
  // Local require()'d image (bundled in app), OR a remote URL.
  // Drop a file at assets/hairstyles/<code>.jpg|png and import it in the
  // HAIRSTYLE_PHOTOS map below.
  photo?: number | { uri: string };
  description: string;
};

// Map of local hairstyle photos. Drop files at:
//   assets/hairstyles/knotless_braids.jpg
//   assets/hairstyles/mini_braids.jpg
//   assets/hairstyles/mini_twists.jpg
//   assets/hairstyles/cornrows.jpg
//   assets/hairstyles/tissage.jpg
//   etc.
// Then uncomment the require() lines.
export const HAIRSTYLE_PHOTOS: Record<string, number | undefined> = {
  knotless_braids: require("../../assets/hairstyles/knotless_braids.jpg"),
  box_braids: require("../../assets/hairstyles/box_braids.jpg"),
  mini_braids: require("../../assets/hairstyles/mini_braids.jpg"),
  mini_twists: require("../../assets/hairstyles/mini_twists.jpg"),
  cornrows: require("../../assets/hairstyles/cornrows.jpg"),
  stitch_braids: require("../../assets/hairstyles/stitch_braids.jpg"),
  tissage: require("../../assets/hairstyles/tissage.jpg"),
  locs_retwist: require("../../assets/hairstyles/locs_retwist.jpg"),
  afro_libre: require("../../assets/hairstyles/afro_libre.jpg"),
  wig: require("../../assets/hairstyles/perruque.jpg"),
};

export const HAIRSTYLES: Hairstyle[] = [
  {
    code: "knotless_braids",
    name: "Knotless Braids",
    category: "braids",
    duration_weeks_min: 4,
    duration_weeks_max: 6,
    description:
      "Tresses sans nœud aux racines — moins de tension, idéales pour préserver tes edges.",
  },
  {
    code: "box_braids",
    name: "Box Braids",
    category: "braids",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    description:
      "Tresses classiques en sections carrées. Polyvalentes, longue durée.",
  },
  {
    code: "mini_braids",
    name: "Mini Braids",
    category: "braids",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    description:
      "Tresses fines pour un rendu naturel et beaucoup de styling possibles.",
  },
  {
    code: "mini_twists",
    name: "Mini Twists",
    category: "twists",
    duration_weeks_min: 3,
    duration_weeks_max: 5,
    description:
      "Twists fins — protection douce sans extensions. Hydratation hebdo recommandée.",
  },
  {
    code: "cornrows",
    name: "Cornrows",
    category: "cornrows",
    duration_weeks_min: 2,
    duration_weeks_max: 4,
    description:
      "Tresses plaquées au cuir chevelu. Parfait pour le sport ou sous une perruque.",
  },
  {
    code: "stitch_braids",
    name: "Stitch Braids",
    category: "cornrows",
    duration_weeks_min: 2,
    duration_weeks_max: 4,
    description:
      "Cornrows avec effet de lignes nettes. Stylé pour un look soigné.",
  },
  {
    code: "tissage",
    name: "Tissage / Sew-In",
    category: "wig",
    duration_weeks_min: 4,
    duration_weeks_max: 6,
    description:
      "Tissage cousu sur cornrows — laisse tes cheveux respirer en dessous.",
  },
  {
    code: "wig",
    name: "Perruque",
    category: "wig",
    duration_weeks_min: 1,
    duration_weeks_max: 8,
    description:
      "Maximum de flexibilité. Dort en bonnet satin, retire-la régulièrement pour aérer.",
  },
  {
    code: "locs_retwist",
    name: "Locs Retwist",
    category: "locs",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    description:
      "Retwist des racines pour des locs nettes et ordonnées. Bain d'huile entre deux pour la souplesse.",
  },
  {
    code: "afro_libre",
    name: "Afro libre",
    category: "natural",
    duration_weeks_min: 0,
    duration_weeks_max: 2,
    description:
      "Cheveux libres entre deux styles protecteurs. Hydrate quotidiennement.",
  },
];

export function durationLabel(s: Hairstyle): string {
  if (s.duration_weeks_max === s.duration_weeks_min) {
    return `${s.duration_weeks_max} sem max`;
  }
  return `${s.duration_weeks_min}-${s.duration_weeks_max} sem`;
}

export const CATEGORY_LABELS: Record<HairstyleCategory, string> = {
  braids: "Tresses",
  twists: "Twists",
  cornrows: "Cornrows",
  wig: "Perruques & Tissages",
  natural: "Naturel",
  locs: "Locs",
};
