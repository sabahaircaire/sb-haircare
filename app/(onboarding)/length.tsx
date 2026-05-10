import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Choice } from "@/components/Choice";
import { Text } from "@/components/Text";
import { useOnboarding } from "@/store/onboarding";
import type { LengthLabel } from "@/lib/db-types";

const LENGTHS: { value: LengthLabel; label: string }[] = [
  { value: "oreille", label: "Oreille" },
  { value: "cou", label: "Cou" },
  { value: "epaules", label: "Épaules" },
  { value: "poitrine", label: "Poitrine" },
  { value: "hanches", label: "Hanches" },
  { value: "taille", label: "Taille" },
  { value: "coccyx", label: "Coccyx" },
];

export default function LengthStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  return (
    <OnboardingShell
      step={3}
      total={7}
      title="Ta longueur"
      subtitle="Actuelle et objectif — pour suivre ta rétention au fil du temps."
      onNext={() => router.push("/(onboarding)/concerns")}
      nextDisabled={!answers.current_length || !answers.goal_length}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="label" className="mb-3">
          Longueur actuelle (étirée)
        </Text>
        <View className="mb-6">
          {LENGTHS.map((l) => (
            <Choice
              key={`current-${l.value}`}
              label={l.label}
              selected={answers.current_length === l.value}
              onPress={() => set({ current_length: l.value })}
            />
          ))}
        </View>

        <Text variant="label" className="mb-3">
          Objectif de longueur
        </Text>
        <View>
          {LENGTHS.map((l) => (
            <Choice
              key={`goal-${l.value}`}
              label={l.label}
              selected={answers.goal_length === l.value}
              onPress={() => set({ goal_length: l.value })}
            />
          ))}
        </View>
      </ScrollView>
    </OnboardingShell>
  );
}
