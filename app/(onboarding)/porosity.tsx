import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Choice } from "@/components/Choice";
import { useOnboarding } from "@/store/onboarding";
import type { Porosity } from "@/lib/db-types";

const POROSITY: { value: Porosity; label: string; desc: string }[] = [
  {
    value: "low",
    label: "Faible",
    desc: "L'eau perle sur tes cheveux, tes produits restent en surface",
  },
  {
    value: "medium",
    label: "Moyenne",
    desc: "Tes cheveux absorbent l'eau et les produits normalement",
  },
  {
    value: "high",
    label: "Élevée",
    desc: "Tes cheveux boivent vite mais sèchent vite aussi, frisottis",
  },
];

export default function PorosityStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  return (
    <OnboardingShell
      step={2}
      total={7}
      title="Et ta porosité ?"
      subtitle="C'est la capacité de tes cheveux à absorber et retenir l'eau."
      onNext={() => router.push("/(onboarding)/length")}
      nextDisabled={!answers.porosity}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {POROSITY.map((p) => (
          <Choice
            key={p.value}
            label={p.label}
            description={p.desc}
            selected={answers.porosity === p.value}
            onPress={() => set({ porosity: p.value })}
          />
        ))}
      </ScrollView>
    </OnboardingShell>
  );
}
