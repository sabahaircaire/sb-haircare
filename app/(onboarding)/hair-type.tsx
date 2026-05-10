import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Choice } from "@/components/Choice";
import { useOnboarding } from "@/store/onboarding";
import type { HairType } from "@/lib/db-types";

const TYPES: { value: HairType; label: string; desc: string }[] = [
  { value: "3a", label: "3A — Boucles larges", desc: "Boucles définies en spirales lâches" },
  { value: "3b", label: "3B — Boucles serrées", desc: "Spirales bien définies, taille d'un marqueur" },
  { value: "3c", label: "3C — Boucles très serrées", desc: "Tire-bouchons fins et denses" },
  { value: "4a", label: "4A — Coils définis", desc: "Petits coils en S avec bonne définition" },
  { value: "4b", label: "4B — Coils en Z", desc: "Motif en Z, moins défini, très volumineux" },
  { value: "4c", label: "4C — Coils serrés", desc: "Motif fragile, peu défini, gros shrinkage" },
];

export default function HairTypeStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  return (
    <OnboardingShell
      step={1}
      total={7}
      title="Quel est ton type de cheveux ?"
      subtitle="Pas sûre ? Choisis le plus proche, on affinera ensemble."
      onNext={() => router.push("/(onboarding)/porosity")}
      nextDisabled={!answers.hair_type}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {TYPES.map((t) => (
          <Choice
            key={t.value}
            label={t.label}
            description={t.desc}
            selected={answers.hair_type === t.value}
            onPress={() => set({ hair_type: t.value })}
          />
        ))}
      </ScrollView>
    </OnboardingShell>
  );
}
