import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Choice } from "@/components/Choice";
import { useOnboarding } from "@/store/onboarding";

const CONCERNS = [
  { value: "casse", label: "Casse en pointes" },
  { value: "secheresse", label: "Sécheresse" },
  { value: "shrinkage", label: "Beaucoup de shrinkage" },
  { value: "noeuds", label: "Nœuds et emmêlement" },
  { value: "manque_definition", label: "Manque de définition" },
  { value: "cuir_chevelu_sec", label: "Cuir chevelu sec / pellicules" },
  { value: "perte_cheveux", label: "Perte de cheveux" },
  { value: "stagne", label: "Mes cheveux ne poussent plus" },
];

export default function ConcernsStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  const selected = answers.hair_concerns ?? [];

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    set({ hair_concerns: next });
  };

  return (
    <OnboardingShell
      step={4}
      total={7}
      title="Tes préoccupations"
      subtitle="Sélectionne tout ce qui s'applique. On adaptera ton plan."
      onNext={() => router.push("/(onboarding)/routine")}
      nextDisabled={selected.length === 0}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {CONCERNS.map((c) => (
          <Choice
            key={c.value}
            label={c.label}
            selected={selected.includes(c.value)}
            onPress={() => toggle(c.value)}
          />
        ))}
      </ScrollView>
    </OnboardingShell>
  );
}
