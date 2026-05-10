import { View } from "react-native";
import { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ScreenContainer } from "./ScreenContainer";
import { Text } from "./Text";
import { ProgressDots } from "./ProgressDots";
import { Button } from "./Button";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
};

export function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  children,
  onNext,
  nextLabel = "Continuer",
  nextDisabled = false,
  showBack = true,
}: Props) {
  const router = useRouter();
  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-6">
          {showBack ? (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text variant="body-medium" className="text-bordeaux">
                ← Retour
              </Text>
            </Pressable>
          ) : (
            <View />
          )}
          <ProgressDots total={total} current={step} />
          <View style={{ width: 60 }} />
        </View>

        <Text variant="h1" className="mb-2">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="body" className="text-ink-soft mb-6">
            {subtitle}
          </Text>
        ) : null}

        <View className="flex-1">{children}</View>

        <Button
          label={nextLabel}
          onPress={onNext}
          className={nextDisabled ? "opacity-40" : ""}
          disabled={nextDisabled}
        />
      </View>
    </ScreenContainer>
  );
}
