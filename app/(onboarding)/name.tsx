import { useState } from "react";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Input } from "@/components/Input";
import { useOnboarding } from "@/store/onboarding";

export default function NameStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  const [name, setName] = useState(answers.display_name ?? "");

  return (
    <OnboardingShell
      step={0}
      total={7}
      title="Comment t'appelles-tu ?"
      subtitle="Pour personnaliser ton rituel."
      onNext={() => {
        set({ display_name: name.trim() });
        router.push("/(onboarding)/hair-type");
      }}
      nextDisabled={!name.trim()}
      showBack={false}
    >
      <Input
        label="Ton prénom"
        value={name}
        onChangeText={setName}
        placeholder="Saba"
        autoCapitalize="words"
        autoComplete="name"
      />
    </OnboardingShell>
  );
}
