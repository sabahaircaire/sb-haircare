import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Choice } from "@/components/Choice";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { useOnboarding } from "@/store/onboarding";

const SCALPS = [
  { value: "dry", label: "Sec" },
  { value: "oily", label: "Gras" },
  { value: "balanced", label: "Équilibré" },
  { value: "sensitive", label: "Sensible / réactif" },
] as const;

const FREQ = [
  { value: "low", label: "Rarement / jamais" },
  { value: "medium", label: "Parfois" },
  { value: "high", label: "Souvent" },
] as const;

export default function RoutineStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  return (
    <OnboardingShell
      step={5}
      total={7}
      title="Ton quotidien"
      subtitle="Quelques infos sur ton cuir chevelu et ta routine actuelle."
      onNext={() => router.push("/(onboarding)/photo")}
      nextDisabled={!answers.scalp_condition || !answers.styling_frequency}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="label" className="mb-3">
          Cuir chevelu
        </Text>
        <View className="mb-6">
          {SCALPS.map((s) => (
            <Choice
              key={s.value}
              label={s.label}
              selected={answers.scalp_condition === s.value}
              onPress={() => set({ scalp_condition: s.value })}
            />
          ))}
        </View>

        <Text variant="label" className="mb-3">
          Coiffures protectrices
        </Text>
        <View className="mb-6">
          {FREQ.map((f) => (
            <Choice
              key={f.value}
              label={f.label}
              selected={answers.styling_frequency === f.value}
              onPress={() => set({ styling_frequency: f.value })}
            />
          ))}
        </View>

        <Input
          label="Ta routine actuelle (optionnel)"
          value={answers.current_routine_summary ?? ""}
          onChangeText={(t) => set({ current_routine_summary: t })}
          placeholder="Ex : co-wash chaque semaine, leave-in tous les 3 jours..."
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />
      </ScrollView>
    </OnboardingShell>
  );
}
