import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { WashDayFlow } from "./db-types";

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
];

export function useWashDayFlows() {
  return useQuery<WashDayFlow[]>({
    queryKey: ["wash_day_flows"],
    queryFn: async () => {
      // Try Supabase first; fall back to local templates if env not set or query fails.
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) return LOCAL_FLOWS;
      const { data, error } = await supabase
        .from("wash_day_flows")
        .select("*")
        .eq("active", true)
        .order("total_duration_min", { ascending: true });
      if (error || !data || data.length === 0) return LOCAL_FLOWS;
      return data as WashDayFlow[];
    },
    staleTime: 1000 * 60 * 60,
  });
}
