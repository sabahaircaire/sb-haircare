import { useEffect, useRef, useState } from "react";
import { ScrollView, View, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Pill } from "@/components/Pill";
import { colors } from "@/theme/colors";
import { getRecipe } from "@/lib/learn";

function formatMMSS(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function RecipeReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = getRecipe(id as string);

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeStep === null || timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setActiveStep(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeStep]);

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <Text variant="h2" className="p-6">
          Recette introuvable
        </Text>
      </SafeAreaView>
    );
  }

  const startTimer = (i: number, seconds: number) => {
    setActiveStep(i);
    setTimeLeft(seconds);
  };

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Hero */}
        <View style={{ position: "relative", height: 240 }}>
          <Image
            source={recipe.hero_image}
            style={{ width: "100%", height: 240 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(74, 16, 21, 0.35)",
            }}
          />
          <SafeAreaView edges={["top"]} className="absolute top-0 left-0 right-0">
            <Pressable
              onPress={() => router.back()}
              className="bg-cream-light rounded-full w-10 h-10 items-center justify-center ml-4 mt-2"
              hitSlop={8}
            >
              <Text variant="body-medium" className="text-bordeaux">
                ←
              </Text>
            </Pressable>
          </SafeAreaView>
          <View className="absolute bottom-5 left-5 right-5">
            <Text variant="h1" style={{ color: colors.white, fontSize: 26, lineHeight: 32 }}>
              {recipe.title}
            </Text>
            <View className="flex-row gap-2 mt-2">
              <Pill variant="soft">
                <Text variant="caption" className="text-bordeaux">
                  ⏱ {recipe.duration}
                </Text>
              </Pill>
              <Pill variant="soft">
                <Text variant="caption" className="text-bordeaux">
                  🔄 {recipe.frequency}
                </Text>
              </Pill>
            </View>
          </View>
        </View>

        {/* Ingrédients */}
        <View className="px-5 pt-6">
          <Text variant="h2" className="mb-4">
            Ingrédients
          </Text>
          <Card variant="outline" className="mb-6">
            {recipe.ingredients.map((ing, i) => (
              <View
                key={i}
                className="flex-row items-center py-2"
                style={{
                  borderBottomWidth: i < recipe.ingredients.length - 1 ? 1 : 0,
                  borderBottomColor: colors.cream.warm,
                }}
              >
                <Text style={{ fontSize: 22, marginRight: 12 }}>{ing.icon}</Text>
                <View className="flex-1">
                  <Text variant="body-medium">{ing.name}</Text>
                  <Text variant="caption">{ing.qty}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Étapes */}
        <View className="px-5">
          <Text variant="h2" className="mb-4">
            Étapes
          </Text>
          {recipe.steps.map((step, i) => (
            <View key={i} className="flex-row gap-3 mb-5 items-start">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.bordeaux.DEFAULT }}
              >
                <Text style={{ color: colors.white, fontWeight: "700" }}>
                  {i + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text variant="body-medium" className="mb-1">
                  {step.title}
                </Text>
                <Text variant="body" style={{ lineHeight: 22 }}>
                  {step.text}
                </Text>
                {step.timer_seconds ? (
                  <Pressable
                    onPress={() => startTimer(i, step.timer_seconds!)}
                    disabled={activeStep !== null && activeStep !== i}
                    className={`mt-3 self-start rounded-full px-4 py-2 ${
                      activeStep === i ? "bg-bordeaux" : "bg-cream-light border border-cream-warm"
                    } ${activeStep !== null && activeStep !== i ? "opacity-40" : ""}`}
                  >
                    <Text
                      variant="body-medium"
                      style={{
                        color:
                          activeStep === i
                            ? colors.white
                            : colors.bordeaux.DEFAULT,
                      }}
                    >
                      ⏱{" "}
                      {activeStep === i
                        ? formatMMSS(timeLeft)
                        : `Lancer le minuteur (${Math.floor(step.timer_seconds / 60)} min)`}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Astuce */}
        {recipe.tip ? (
          <View className="px-5 mt-4">
            <Card
              style={{
                borderLeftWidth: 4,
                borderLeftColor: colors.ocre.DEFAULT,
                backgroundColor: colors.cream.light,
              }}
            >
              <Text variant="label" className="mb-1 text-ocre-deep">
                💡 Astuce SB Haircare
              </Text>
              <Text variant="body" style={{ lineHeight: 22 }}>
                {recipe.tip}
              </Text>
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
