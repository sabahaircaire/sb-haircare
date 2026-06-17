import { useEffect, useState, useRef } from "react";
import { View, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { useWashFlow } from "@/store/washFlow";
import { notifyStepComplete, primeStepAudio } from "@/lib/stepFeedback";
import { colors } from "@/theme/colors";

function formatMMSS(totalSeconds: number) {
  const m = Math.max(0, Math.floor(totalSeconds / 60));
  const s = Math.max(0, totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function WashStep() {
  const router = useRouter();
  const flow = useWashFlow((s) => s.flow);
  const idx = useWashFlow((s) => s.currentStepIndex);
  const completeCurrentStep = useWashFlow((s) => s.completeCurrentStep);
  const skipCurrentStep = useWashFlow((s) => s.skipCurrentStep);

  const step = flow?.steps[idx];

  // Three sub-screens per step: suggestion (if any) → timer → reminder (if any)
  type Phase = "suggestion" | "timer" | "reminder";
  const initialPhase: Phase = step?.suggestion
    ? "suggestion"
    : step?.reminder && step.duration_min === 0
      ? "reminder"
      : "timer";
  const [phase, setPhase] = useState<Phase>(initialPhase);

  const [secondsLeft, setSecondsLeft] = useState((step?.duration_min ?? 0) * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Célébration de fin de minuteur (vibration + son + visuel festif)
  const [celebrating, setCelebrating] = useState(false);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const firedRef = useRef(false);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when step changes
  useEffect(() => {
    if (!step) return;
    setPhase(
      step.suggestion
        ? "suggestion"
        : step.reminder && step.duration_min === 0
          ? "reminder"
          : "timer",
    );
    setSecondsLeft(step.duration_min * 60);
    setRunning(false);
    // reset de la célébration au changement d'étape
    firedRef.current = false;
    setCelebrating(false);
    flashOpacity.setValue(0);
    checkScale.setValue(0);
  }, [idx, step?.order]);

  // Déclenché une seule fois quand le minuteur atteint 0
  useEffect(() => {
    if (
      phase !== "timer" ||
      secondsLeft !== 0 ||
      !step ||
      step.duration_min <= 0 ||
      firedRef.current
    ) {
      return;
    }
    firedRef.current = true;
    notifyStepComplete();
    setCelebrating(true);
    flashOpacity.setValue(0);
    checkScale.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.45,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();
    celebrateTimeout.current = setTimeout(() => setCelebrating(false), 1700);
  }, [secondsLeft, phase, step?.duration_min]);

  // Nettoyage du timeout de célébration
  useEffect(() => {
    return () => {
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  if (!flow) {
    router.replace("/wash/select");
    return null;
  }

  // End of flow
  if (idx >= flow.steps.length) {
    router.replace("/wash/photo");
    return null;
  }

  if (!step) return null;

  const goNext = () => {
    if (step.reminder && phase !== "reminder") {
      setPhase("reminder");
      return;
    }
    completeCurrentStep();
    if (idx + 1 >= flow.steps.length) {
      router.replace("/wash/photo");
    }
  };

  const onClose = () => router.replace("/(tabs)/washday");

  if (phase === "suggestion" && step.suggestion) {
    return (
      <ScreenContainer scroll={false}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text variant="body-medium" className="text-bordeaux">
            ✕
          </Text>
        </Pressable>
        <View className="flex-1 items-center justify-center px-4">
          <Text variant="label" className="mb-3 text-ocre-deep">
            💡 Suggestion
          </Text>
          <Text variant="h2" className="text-center mb-10 max-w-[320px]">
            {step.suggestion}
          </Text>
          <Button
            label="Essayer"
            className="w-full max-w-[280px] mb-3"
            onPress={() => setPhase("timer")}
          />
          <Pressable onPress={() => setPhase("timer")}>
            <Text variant="caption" className="text-ink-muted">
              Passer
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  if (phase === "reminder" && step.reminder) {
    return (
      <ScreenContainer scroll={false}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text variant="body-medium" className="text-bordeaux">
            ✕
          </Text>
        </Pressable>
        <View className="flex-1 items-center justify-center px-4">
          <Text variant="label" className="mb-3">
            🔔 Rappel
          </Text>
          <Text variant="h2" className="text-center mb-10 max-w-[320px]">
            {step.reminder}
          </Text>
          <Button
            label="J'ai compris"
            className="w-full max-w-[280px]"
            onPress={() => {
              completeCurrentStep();
              if (idx + 1 >= flow.steps.length) {
                router.replace("/wash/photo");
              }
            }}
          />
        </View>
      </ScreenContainer>
    );
  }

  // Timer phase
  const done = secondsLeft === 0;
  return (
    <ScreenContainer scroll={false}>
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={onClose} hitSlop={12}>
          <Text variant="body-medium" className="text-bordeaux">
            ✕
          </Text>
        </Pressable>
        <Text variant="caption">
          Étape {idx + 1} / {flow.steps.length}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <Card variant="outline" className="w-full mb-8">
          <Text variant="label" className="mb-2">
            {step.title}
          </Text>
          <Text variant="body">{step.instructions}</Text>
        </Card>

        {done ? (
          <Animated.View
            className="mb-2 items-center"
            style={{ transform: [{ scale: checkScale }] }}
          >
            <Text variant="display" className="text-7xl text-ocre-deep">
              ✓
            </Text>
          </Animated.View>
        ) : (
          <Text variant="display" className="text-7xl mb-2">
            {formatMMSS(secondsLeft)}
          </Text>
        )}
        <Text variant="caption" className="mb-10">
          {done ? "Étape terminée · bravo ✨" : "Minuteur"}
        </Text>

        {!done ? (
          <View className="flex-row gap-3 w-full max-w-[320px]">
            <Button
              label={running ? "Pause" : "▶ Démarrer"}
              className="flex-1"
              onPress={() => {
                if (!running) primeStepAudio();
                setRunning((r) => !r);
              }}
            />
            <Button
              label="Ignorer"
              variant="ghost"
              className="flex-1"
              onPress={() => {
                skipCurrentStep();
                if (idx + 1 >= flow.steps.length) {
                  router.replace("/wash/photo");
                }
              }}
            />
          </View>
        ) : (
          <Button
            label="✓ Terminer"
            className="w-full max-w-[320px]"
            onPress={goNext}
          />
        )}
      </View>

      {/* Flash de célébration plein écran */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: colors.ocre.DEFAULT,
          opacity: flashOpacity,
        }}
      />
      {celebrating && <ConfettiBurst key={idx} />}
    </ScreenContainer>
  );
}
