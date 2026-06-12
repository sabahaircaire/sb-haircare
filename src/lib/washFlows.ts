import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { WashDayFlow } from "./db-types";

// Bundled brand photos for flows. Fallback to bordeaux placeholder otherwise.
export const FLOW_PHOTOS: Record<string, number | undefined> = {
  jour_de_lavage: require("../../assets/learn/saba-img-wash-day-shower.jpg"),
  bain_huile: require("../../assets/learn/saba-img-wet-hair-stretched.jpg"),
  masque_ayurvedique: require("../../assets/learn/saba-img-masque-hibiscus-bowl.jpg"),
  hydrater: require("../../assets/learn/saba-img-defined-curls.jpg"),
  remise_en_forme_cuir_chevelu: require("../../assets/learn/saba-img-curl-closeup-hand.jpg"),
  dormir_satin: require("../../assets/learn/saba-img-volume-mirror.jpg"),
  fin_faible_porosite: require("../../assets/learn/saba-img-wet-hair-stretched.jpg"),
};

// Local fallback so the app works offline / before Supabase is provisioned.
const LOCAL_FLOWS: WashDayFlow[] = [
  {
    id: "local_jour_de_lavage",
    code: "jour_de_lavage",
    title: "Jour de lavage",
    description:
      "Routine de lavage complète : pré-poo, shampoing, après-shampoing, hydratation, coiffure",
    total_duration_min: 60,
    cadence: "every_2_weeks",
    active: true,
    steps: [
      {
        order: 1,
        title: "Pré-poo",
        duration_min: 30,
        instructions:
          "Sur cheveux démêlés et hydratés, appliquez votre pré-poo et laissez agir au moins 30 minutes.",
        suggestion:
          "Avant de laver, démêlez doucement avec les doigts ou un peigne à dents larges. Commencez par les pointes.",
      },
      {
        order: 2,
        title: "Lavage",
        duration_min: 3,
        instructions:
          "Lavez vos cheveux en sections, en insistant sur le cuir chevelu et les racines.",
      },
      {
        order: 3,
        title: "Après-shampoing",
        duration_min: 10,
        instructions:
          "Rincez puis appliquez l'après-shampoing sur les longueurs et pointes.",
        suggestion: "Si besoin, utilisez plutôt un soin profond.",
      },
      {
        order: 4,
        title: "LOC ou LCO",
        duration_min: 10,
        instructions: "Rincez puis coiffez avec la méthode LOC ou LCO.",
        reminder: "Rincez puis coiffez avec LOC ou LCO",
      },
      {
        order: 5,
        title: "Séchage étiré",
        duration_min: 5,
        instructions:
          "Mettez chaque section en vanilles/tresses pour sécher étiré.",
        reminder: "Mettez chaque section en vanilles/tresses pour sécher étiré",
      },
    ],
  },
  {
    id: "local_bain_huile",
    code: "bain_huile",
    title: "Rituel bain d'huile",
    description: "Pré-poo profond à l'huile chaude pour nourrir les longueurs",
    total_duration_min: 45,
    cadence: "monthly",
    active: true,
    steps: [
      {
        order: 1,
        title: "Préparer l'huile",
        duration_min: 5,
        instructions:
          "Faites tiédir un mélange d'huile de coco, ricin et amande douce.",
      },
      {
        order: 2,
        title: "Application section par section",
        duration_min: 10,
        instructions:
          "Appliquez généreusement sur cheveux secs, des racines aux pointes.",
      },
      {
        order: 3,
        title: "Laisser poser",
        duration_min: 30,
        instructions: "Couvrez d'un bonnet chauffant ou serviette chaude.",
        suggestion: "Profitez-en pour boire un thé.",
      },
    ],
  },
  {
    id: "local_masque_ayur",
    code: "masque_ayurvedique",
    title: "Masque ayurvédique",
    description:
      "Mélange de poudres indiennes : Bringaraj, Brahmi, Fenugrec, Hibiscus, Guimauve",
    total_duration_min: 60,
    cadence: "monthly",
    active: true,
    steps: [
      {
        order: 1,
        title: "Mélange",
        duration_min: 5,
        instructions:
          "Mélangez 3 à 4 cuillères à soupe de poudre avec un liquide chaud (eau, lait végétal, hydrolat).",
      },
      {
        order: 2,
        title: "Application",
        duration_min: 10,
        instructions:
          "Appliquez sur cheveux propres et humides, du cuir chevelu aux pointes.",
      },
      {
        order: 3,
        title: "Pose sous chaleur",
        duration_min: 40,
        instructions: "Couvrez d'un bonnet chauffant. Laissez poser 30 à 60 min.",
        reminder: "Rincez abondamment à la fin",
      },
      {
        order: 4,
        title: "Rinçage",
        duration_min: 5,
        instructions:
          "Rincez très abondamment puis appliquez après-shampoing si besoin.",
      },
    ],
  },
  {
    id: "local_hydrater",
    code: "hydrater",
    title: "Hydrater",
    description: "Routine express d'hydratation entre les wash days",
    total_duration_min: 10,
    cadence: "as_needed",
    active: true,
    steps: [
      {
        order: 1,
        title: "Vaporiser",
        duration_min: 2,
        instructions:
          "Vaporisez un mélange eau + jus d'aloe vera sur les longueurs.",
      },
      {
        order: 2,
        title: "Leave-in",
        duration_min: 3,
        instructions: "Appliquez un leave-in crème en sections.",
      },
      {
        order: 3,
        title: "Sceller",
        duration_min: 3,
        instructions:
          "Scellez avec une huile légère sur les longueurs et pointes.",
      },
      {
        order: 4,
        title: "Recoiffer",
        duration_min: 2,
        instructions: "Recoiffez en vanilles ou bantu knots pour la nuit.",
      },
    ],
  },
  {
    id: "local_remise_en_forme",
    code: "remise_en_forme_cuir_chevelu",
    title: "Remise en forme du cuir chevelu",
    description: "Massage rapide pour relancer la circulation",
    total_duration_min: 5,
    cadence: "as_needed",
    active: true,
    steps: [
      {
        order: 1,
        title: "Huile pour le cuir chevelu",
        duration_min: 1,
        instructions:
          "Quelques gouttes d'huile (jojoba, ricin) directement sur le cuir chevelu.",
      },
      {
        order: 2,
        title: "Massage",
        duration_min: 3,
        instructions:
          "Massez en cercles avec le bout des doigts, sans frotter avec les ongles.",
      },
      {
        order: 3,
        title: "Étirements",
        duration_min: 1,
        instructions:
          "Pincez et soulevez doucement le cuir chevelu pour relâcher les tensions.",
      },
    ],
  },
  {
    id: "local_dormir_satin",
    code: "dormir_satin",
    title: "Dormir en satin",
    description: "Routine du soir pour préserver tes longueurs",
    total_duration_min: 5,
    cadence: "as_needed",
    active: true,
    steps: [
      {
        order: 1,
        title: "Recoiffer",
        duration_min: 2,
        instructions:
          "Recoiffe en grosses vanilles, ananas, ou bantu knots selon la longueur.",
      },
      {
        order: 2,
        title: "Bonnet satin",
        duration_min: 1,
        instructions:
          "Couvre tes cheveux d'un bonnet ou foulard satin/soie.",
      },
      {
        order: 3,
        title: "Taie d'oreiller",
        duration_min: 2,
        instructions:
          "Vérifie que ta taie d'oreiller est en satin/soie en backup.",
      },
    ],
  },
  {
    id: "local_fin_faible_porosite",
    code: "fin_faible_porosite",
    title: "Wash Day cheveux fins · faible porosité",
    description:
      "Routine sur-mesure pour cheveux fins, faible porosité et texturés : tout en chaleur, en couches fines, anti-buildup. On travaille tiède/chaud du début à la fin.",
    total_duration_min: 65,
    cadence: "every_2_weeks",
    active: true,
    steps: [
      {
        order: 1,
        title: "Pré-poo Huile Raiponce",
        duration_min: 25,
        instructions:
          "Tiédis l'Huile Raiponce entre tes mains. Masse le cuir chevelu en cercles 3–4 min (Bhringaraj + Romarin = pousse), puis descends sur longueurs et pointes pour protéger la fibre du lavage. Dose modérée : cheveu fin = on ne noie pas. Couvre charlotte + serviette chaude et laisse poser 20–30 min.",
        suggestion:
          "Faible porosité : la chaleur n'est pas négociable. C'est elle qui ouvre la cuticule et fait pénétrer l'huile au lieu de la laisser en surface.",
      },
      {
        order: 2,
        title: "Lavage clarifiant",
        duration_min: 5,
        instructions:
          "Eau tiède (jamais froide pendant le soin, le froid referme la cuticule). Shampoing clarifiant focus cuir chevelu, en deux passages courts plutôt qu'un long. Les longueurs se nettoient avec la mousse qui descend.",
        suggestion:
          "Clarifie toutes les 2–3 lavages minimum : sur cheveu fin faible porosité, le buildup est l'ennemi n°1.",
      },
      {
        order: 3,
        title: "Masque ayurvédique sous chaleur",
        duration_min: 20,
        instructions:
          "Mélange la poudre (Lalo + Guimauve pour le slip) avec de l'eau tiède jusqu'à une pâte type yaourt épais. Applique en 4 sections, charlotte + chaleur douce, 15–20 min. Démêle aux doigts grâce au slip, sans alourdir.",
        suggestion:
          "Zéro protéine hydrolysée dans ce masque : pas de risque de protein overload, vas-y sereine. Max 1 fois toutes les 1–2 semaines, sur-traiter le cheveu fin l'alourdit.",
        reminder:
          "Rince hyper soigneusement — un grain de poudre résiduel = buildup, et la faible porosité déteste ça.",
      },
      {
        order: 4,
        title: "Scellage méthode LCO",
        duration_min: 8,
        instructions:
          "L (Liquide) : cheveux humides, pas trempés — un vapo d'eau si besoin, c'est ta source d'hydratation. C (Crème) : une noisette de leave-in / crème hydratante légère, réchauffée entre les paumes, longueurs et pointes seulement, jamais les racines. O (Huile) : 2–3 gouttes d'Huile Raiponce sur les pointes pour fermer.",
        suggestion:
          "Jour « cheveux très fins / plats » ? Saute la crème et contente-toi de L + O.",
        reminder:
          "LCO et pas LOC : sur faible porosité, l'huile en premier bloquerait l'eau dehors. Le léger entre d'abord, l'huile scelle en dernier.",
      },
      {
        order: 5,
        title: "Séchage volume",
        duration_min: 7,
        instructions:
          "Éponge en microfibre ou vieux t-shirt sans frotter (plopping court possible). Sèche les racines en premier, à l'air ou au diffuseur tiède : le cheveu fin garde mieux le volume si tu ne le gaves pas.",
        suggestion:
          "Si après quelques semaines les cheveux semblent « lourds sans raison » → c'est du buildup, repasse en lavage clarifiant.",
      },
    ],
  },
];

export function useWashDayFlows() {
  return useQuery<WashDayFlow[]>({
    queryKey: ["wash_day_flows"],
    // Seed with local templates so the UI never flashes empty.
    initialData: LOCAL_FLOWS,
    queryFn: async () => {
      // Try Supabase, fall back to local templates on any failure.
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) return LOCAL_FLOWS;
      try {
        const { data, error } = await supabase
          .from("wash_day_flows")
          .select("*")
          .eq("active", true)
          .order("total_duration_min", { ascending: true });
        if (error || !data || data.length === 0) return LOCAL_FLOWS;
        return data as WashDayFlow[];
      } catch {
        return LOCAL_FLOWS;
      }
    },
    staleTime: 1000 * 60 * 60,
  });
}
