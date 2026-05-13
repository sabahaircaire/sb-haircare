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
  description: string;
  // Rich details (optional — affichés sur la page détail si présents)
  avantages?: string[];
  precautions?: string[];
  routine_sous?: string;
  apres?: string;
  protection?: number; // 0-5
  tension?: number; // 0-5
  is_protective?: boolean;
};

// Map of local hairstyle photos
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
    protection: 5,
    tension: 2,
    is_protective: true,
    description:
      "Les knotless braids sont la version « douce » des box braids classiques. Au lieu de commencer par un nœud à la racine, les extensions sont ajoutées progressivement dans la tresse, ce qui réduit considérablement la tension sur le follicule dès la pose.",
    avantages: [
      "Beaucoup moins de tension à la pose que les box braids classiques",
      "Résultat plus naturel et plus plat à la racine",
      "Excellente protection des longueurs et des pointes",
      "Plus légères — moins de poids sur les follicules",
    ],
    precautions: [
      "Même sans nœud, des knotless trop serrées tirent — si tes bords font mal, c'est trop serré",
      "Ne dépasse pas 6 semaines : la repousse s'emmêle à la racine",
      "Le retrait prend du temps — ne tire jamais, humidifie et démêle section par section",
      "Protège tes bords en demandant un tressage plus lâche sur le contour",
    ],
    routine_sous:
      "Vaporise eau + Huile Raiponce sur le cuir chevelu tous les 2-3 jours. Bonnet satin chaque nuit. Lave le cuir chevelu toutes les 2 semaines avec un shampoing dilué dans un applicateur.",
    apres:
      "Défais avec patience. Shampoing clarifiant + après-shampoing riche + bain d'huile à l'Huile Raiponce. Minimum 1 semaine de repos.",
  },
  {
    code: "box_braids",
    name: "Box Braids",
    category: "braids",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    protection: 5,
    tension: 3,
    is_protective: true,
    description:
      "Les box braids (tresses individuelles avec extensions) sont la coiffure protectrice reine. Chaque mèche est séparée en petites sections carrées et tressée avec du kanekalon ou des cheveux naturels. Le résultat dure longtemps et protège efficacement les longueurs.",
    avantages: [
      "Excellente protection des longueurs et des pointes",
      "Réduction drastique de la manipulation quotidienne",
      "Polyvalentes : portées libres, en chignon, en queue haute",
      "Le look dure 6 à 9 semaines avec un bon entretien",
    ],
    precautions: [
      "La tension à la pose est le facteur critique : si tes bords te font mal dans les 24h, les tresses sont trop serrées — n'hésite pas à le dire à ta coiffeuse",
      "Pas d'extensions trop lourdes : le poids tire sur le follicule et affaiblit la racine",
      "Protège tes bords en demandant des tresses plus lâches sur le contour du visage",
      "Ne garde pas plus de 9 semaines — les frisottis à la racine s'emmêlent en nœuds irréversibles",
    ],
    routine_sous:
      "Vaporise eau + Huile Raiponce sur le cuir chevelu tous les 2-3 jours. Enroule tes tresses dans un foulard satin la nuit. Lave le cuir chevelu toutes les 2 semaines avec un shampoing dilué dans un applicateur, sèche complètement pour éviter les odeurs.",
    apres:
      "Défais avec patience : coupe l'extension en bas, démêle chaque tresse à l'eau + Huile Raiponce sur les doigts. Shampoing clarifiant + après-shampoing riche + bain d'huile. Minimum 1 semaine de repos avant la prochaine coiffure.",
  },
  {
    code: "mini_braids",
    name: "Mini Braids",
    category: "braids",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    protection: 5,
    tension: 2,
    is_protective: true,
    description:
      "Les mini braids sont de très petites tresses faites avec tes propres cheveux (sans extensions) ou avec très peu d'ajouts. Plus fines que les box braids, elles sont légères et permettent une rétention de longueur exceptionnelle.",
    avantages: [
      "Ultra-légères — quasiment aucun poids sur les follicules",
      "Peuvent être faites sans extensions (100% tes cheveux)",
      "Excellente rétention de longueur sur 6-9 semaines",
      "Faciles à hydrater (accès direct au cuir chevelu)",
    ],
    precautions: [
      "Le temps de pose est long (4-8h selon l'épaisseur)",
      "Ne serre pas les racines pour compenser la finesse",
      "Hydrate régulièrement — les mini braids assèchent vite si tu oublies",
      "Au retrait, prends ton temps pour démêler chaque micro-tresse",
    ],
    routine_sous:
      "Vaporise eau + Huile Raiponce tous les 2 jours. Bonnet satin la nuit. Tu peux laver tes mini braids sous la douche — elles résistent bien au shampoing dilué.",
    apres:
      "Démêlage doux à l'Huile Raiponce, shampoing clarifiant, après-shampoing, bain d'huile. 1 semaine de repos.",
  },
  {
    code: "mini_twists",
    name: "Mini Twists",
    category: "twists",
    duration_weeks_min: 3,
    duration_weeks_max: 5,
    protection: 4,
    tension: 1,
    is_protective: true,
    description:
      "Les mini twists (vanilles) sont des torsades à deux brins faites avec tes propres cheveux. C'est la coiffure protectrice la plus douce — quasiment aucune tension. Parfaite pour laisser tes cheveux respirer tout en les protégeant.",
    avantages: [
      "Tension minimale — la coiffure la plus safe pour les bords fragiles",
      "Pas d'extensions nécessaires",
      "Tu peux les faire toi-même à la maison",
      "Défaites, elles donnent un twist-out défini",
    ],
    precautions: [
      "Durée plus courte que les tresses (3-5 semaines max) — les twists se défont plus vite",
      "Évite les twists trop fins sur cheveux courts — ils cassent",
      "Bonnet satin obligatoire la nuit (les twists s'aplatissent sur du coton)",
      "Ne retords pas les twists défaits — ça crée de la friction répétée sur les mêmes zones",
    ],
    routine_sous:
      "Huile Raiponce sur le cuir chevelu tous les 2-3 jours. Vaporise un peu d'eau sur les twists pour rafraîchir. Bonnet satin chaque nuit pour maintenir la définition.",
    apres:
      "Détords doucement chaque twist (ne tire pas). Démêle avec les doigts + Huile Raiponce. Shampoing + après-shampoing. Profite du twist-out avant le prochain style !",
  },
  {
    code: "cornrows",
    name: "Cornrows",
    category: "cornrows",
    duration_weeks_min: 2,
    duration_weeks_max: 3,
    protection: 4,
    tension: 4,
    is_protective: true,
    description:
      "Les cornrows (tresses plaquées) collent au cuir chevelu en lignes ou motifs. Classiques, elles peuvent être droites, en zigzag, ou avec des designs élaborés. Attention : c'est la coiffure protectrice avec le plus de tension directe sur les follicules.",
    avantages: [
      "Rendu esthétique propre et net",
      "Protection complète des longueurs",
      "Polyvalentes (sous perruque, seules, avec extensions)",
      "Séchage rapide après le lavage",
    ],
    precautions: [
      "DANGER sur les bords : les cornrows tirent directement sur la ligne frontale — surveille tes tempes",
      "Durée MAX 2-3 semaines — au-delà, la repousse tire encore plus",
      "Pas de cornrows si tes bords sont déjà fragiles ou clairsemés",
      "Demande à ta coiffeuse de NE PAS tirer sur les premières rangées du contour",
    ],
    routine_sous:
      "Huile Raiponce sur le cuir chevelu chaque soir entre les tresses. Bonnet satin obligatoire. Nettoie le cuir chevelu avec un coton imbibé d'eau micellaire si besoin — ne mouille pas les cornrows (frisottis).",
    apres:
      "Humidifie tout avant de défaire. Démêle avec Huile Raiponce. Shampoing + après-shampoing + bain d'huile. Repos minimum 1 semaine. Si tes bords montrent des signes de fatigue, repos 3 semaines.",
  },
  {
    code: "stitch_braids",
    name: "Stitch Braids",
    category: "cornrows",
    duration_weeks_min: 2,
    duration_weeks_max: 3,
    protection: 4,
    tension: 4,
    is_protective: true,
    description:
      "Les stitch braids sont des cornrows avec un point de couture visible — le « stitch » crée un motif géométrique sur le cuir chevelu. Très esthétiques, elles ont les mêmes contraintes de tension que les cornrows classiques.",
    avantages: [
      "Rendu esthétique très propre et original",
      "Protection des longueurs (cheveux plaqués, pas de friction)",
      "Moins d'entretien quotidien qu'un afro libre",
    ],
    precautions: [
      "DANGER sur les bords : les stitch braids tirent autant que les cornrows",
      "Durée MAX 2-3 semaines",
      "Hydrate le cuir chevelu quotidiennement : les tresses plaquées assèchent le scalp",
      "Pas de stitch braids si tes bords sont déjà fragiles — choisis un style plus lâche",
    ],
    routine_sous:
      "Huile Raiponce sur le cuir chevelu chaque soir avec un applicateur fin ou du bout des doigts entre les tresses. Bonnet satin obligatoire pour maintenir le motif et réduire la friction.",
    apres:
      "Au retrait : humidifie TOUT avant de défaire. Démêle doucement avec de l'Huile Raiponce. Shampoing + après-shampoing + bain d'huile. Repos minimum 1 semaine.",
  },
  {
    code: "tissage",
    name: "Tissage / Sew-In",
    category: "wig",
    duration_weeks_min: 4,
    duration_weeks_max: 6,
    protection: 4,
    tension: 3,
    is_protective: true,
    description:
      "Le tissage (weave / sew-in) consiste à coudre ou coller des extensions sur tes cheveux naturels, souvent sur un tressage plaqué. Tu peux changer de longueur, de texture et de couleur sans toucher à tes vrais cheveux.",
    avantages: [
      "Protège 100% des longueurs (aucune manipulation quotidienne)",
      "Permet de changer de look radicalement",
      "Rétention de longueur maximale si bien entretenu",
    ],
    precautions: [
      "Le tressage de base ne doit JAMAIS tirer sur les bords et les tempes",
      "Hydrate ton cuir chevelu sous le tissage tous les 2-3 jours",
      "Ne dépasse pas 6 semaines — les nœuds se forment à la racine",
      "Au retrait : humidifie, démêle doucement section par section, JAMAIS arracher",
    ],
    routine_sous:
      "Vaporise un mélange eau + Huile Raiponce sur le cuir chevelu tous les 2-3 jours. Masse à travers le tissage du bout des doigts. Lave le cuir chevelu toutes les 2 semaines avec un shampoing dilué.",
    apres:
      "Semaine de repos obligatoire. Shampoing clarifiant + masque hydratant profond + bain d'huile avant la prochaine coiffure protectrice.",
  },
  {
    code: "wig",
    name: "Perruque",
    category: "wig",
    duration_weeks_min: 1,
    duration_weeks_max: 8,
    protection: 5,
    tension: 1,
    is_protective: true,
    description:
      "La perruque offre la flexibilité ultime : tu peux la retirer chaque soir pour aérer tes cheveux naturels, varier les looks sans engagement, et préserver tes longueurs entre deux styles intensifs.",
    avantages: [
      "Tu retires la perruque chaque soir = aération du cuir chevelu",
      "Zéro tension sur les follicules (si bien posée)",
      "Tu peux varier les looks à volonté",
      "Idéal pour les bords fragiles",
    ],
    precautions: [
      "La perruque ne doit pas frotter sur les bords — bonnet wig grip si besoin",
      "Sous la perruque : tresses douces ou cornrows non serrées",
      "Aère tes cheveux naturels chaque soir, dors en bonnet satin",
      "Hydrate sous la perruque tous les 2-3 jours",
    ],
    routine_sous:
      "Sous la perruque, vaporise eau + Huile Raiponce sur le cuir chevelu et les tresses de base 2-3 fois par semaine. Retire la perruque chaque soir, dors en bonnet satin sur tes cheveux naturels.",
    apres:
      "Quand tu changes de base de tressage : shampoing doux + après-shampoing + bain d'huile à l'Huile Raiponce. Repos avant la prochaine coiffure.",
  },
  {
    code: "locs_retwist",
    name: "Locs Retwist",
    category: "locs",
    duration_weeks_min: 6,
    duration_weeks_max: 9,
    protection: 4,
    tension: 3,
    is_protective: true,
    description:
      "Retwist des racines pour des locs nettes et ordonnées. C'est l'entretien régulier des locs entre deux : on retord uniquement la repousse à la base, on ne touche pas aux locs établies.",
    avantages: [
      "Aspect propre et défini après chaque retwist",
      "Renforce la base des locs",
      "Préserve l'uniformité du motif",
    ],
    precautions: [
      "Ne retwist pas trop souvent (max toutes les 6-9 semaines) — la base s'amincit avec la tension répétée",
      "Trop serré = casse à la base et locs fines",
      "Hydrate les locs entre deux retwists (les locs sèches deviennent cassantes)",
    ],
    routine_sous:
      "Bain d'huile à l'Huile Raiponce sur les longueurs des locs 1x/semaine. Vaporise eau + huile sur les locs et le cuir chevelu tous les 2-3 jours. Bonnet satin la nuit.",
    apres:
      "Entre deux retwists : focus sur l'hydratation et le bain d'huile. Évite les produits qui laissent des résidus blancs.",
  },
  {
    code: "afro_libre",
    name: "Afro libre",
    category: "natural",
    duration_weeks_min: 0,
    duration_weeks_max: 2,
    protection: 1,
    tension: 0,
    is_protective: false,
    description:
      "L'afro libre, c'est tes cheveux dans leur état naturel — shrinkage compris. La coiffure la plus belle mais aussi celle qui expose le plus tes cheveux à la friction, au vent, et à la manipulation.",
    avantages: [
      "Zéro tension sur les bords et les follicules",
      "Permet d'appliquer tes soins directement sans obstacles",
      "Pas de coût additionnel (extensions, coiffeuse)",
    ],
    precautions: [
      "La friction est ton ennemi n°1 : bonnet satin CHAQUE nuit",
      "Résiste à l'envie de toucher tes cheveux — chaque manipulation = friction = casse",
      "Pineapple ou loose bun en hiver (manteau/écharpe = friction)",
      "Hydrate + scelle TOUS les 2-3 jours",
    ],
    routine_sous:
      "Méthode LOC/LCO chaque matin ou tous les 2 jours : eau/leave-in → Huile Raiponce → Chantilly si haute porosité. Démêle uniquement sous la douche avec après-shampoing, des pointes vers les racines.",
    apres:
      "Wash day hebdomadaire : pré-poo à l'Huile Raiponce → shampoing doux → après-shampoing → Masque Ayurvédique 1x/mois.",
  },
];

export function durationLabel(s: Hairstyle): string {
  if (s.duration_weeks_max === s.duration_weeks_min) {
    return `${s.duration_weeks_max} sem max`;
  }
  return `${s.duration_weeks_min}-${s.duration_weeks_max} sem`;
}

export function getHairstyle(code: string): Hairstyle | undefined {
  return HAIRSTYLES.find((s) => s.code === code);
}

export const CATEGORY_LABELS: Record<HairstyleCategory, string> = {
  braids: "Tresses",
  twists: "Twists",
  cornrows: "Cornrows",
  wig: "Perruques & Tissages",
  natural: "Naturel",
  locs: "Locs",
};
