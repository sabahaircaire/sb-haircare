import { ScrollView, View, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Pill } from "@/components/Pill";
import { colors } from "@/theme/colors";
import {
  getHairstyle,
  HAIRSTYLE_PHOTOS,
  durationLabel,
} from "@/lib/hairstyles";
import {
  useStartProtectiveStyle,
  useCurrentProtectiveStyle,
} from "@/lib/hooks/useProtectiveStyle";

export default function HairstyleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const style = getHairstyle(id as string);
  const startMut = useStartProtectiveStyle();
  const { data: current } = useCurrentProtectiveStyle();

  if (!style) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <Text variant="h2" className="p-6">
          Style introuvable
        </Text>
      </SafeAreaView>
    );
  }

  const isCurrent = current?.style_code === style.code;
  const photo = HAIRSTYLE_PHOTOS[style.code];

  const onStart = () => {
    if (isCurrent) return;
    if (current) {
      Alert.alert(
        "Style déjà en cours",
        `Tu as actuellement "${current.style_name}". Termine-le avant d'en démarrer un autre.`,
      );
      return;
    }
    startMut.mutate(
      {
        style_code: style.code,
        style_name: style.name,
        duration_weeks_max: style.duration_weeks_max,
      },
      {
        onSuccess: () => router.replace("/(tabs)/hairstyle"),
      },
    );
  };

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={{ position: "relative", height: 280 }}>
          {photo ? (
            <Image
              source={photo}
              style={{ width: "100%", height: 280 }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="w-full h-full bg-bordeaux items-center justify-center"
              style={{ height: 280 }}
            >
              <Text variant="h1" style={{ color: colors.cream.light }}>
                {style.name}
              </Text>
            </View>
          )}
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
          <SafeAreaView
            edges={["top"]}
            className="absolute top-0 left-0 right-0"
          >
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
            {isCurrent ? (
              <View className="self-start bg-cream-light rounded-full px-3 py-1 mb-2">
                <Text variant="caption" className="text-bordeaux">
                  ● En cours
                </Text>
              </View>
            ) : null}
            <Text
              variant="h1"
              style={{ color: colors.white, fontSize: 30, lineHeight: 36 }}
            >
              {style.name}
            </Text>
            <View className="flex-row gap-2 mt-2">
              <Pill variant="soft">
                <Text variant="caption" className="text-bordeaux">
                  ⏱ {durationLabel(style)}
                </Text>
              </Pill>
              {style.is_protective ? (
                <Pill variant="soft">
                  <Text variant="caption" className="text-bordeaux">
                    🛡 Protectrice
                  </Text>
                </Pill>
              ) : (
                <Pill variant="soft">
                  <Text variant="caption" className="text-bordeaux">
                    🌿 Libre
                  </Text>
                </Pill>
              )}
            </View>
          </View>
        </View>

        {/* Scores */}
        {style.protection !== undefined || style.tension !== undefined ? (
          <View className="px-5 pt-5 flex-row gap-3">
            {style.protection !== undefined ? (
              <ScoreCard
                label="Protection"
                value={style.protection}
                color={colors.bordeaux.DEFAULT}
                icon="🛡"
              />
            ) : null}
            {style.tension !== undefined ? (
              <ScoreCard
                label="Tension"
                value={style.tension}
                color={
                  style.tension >= 4
                    ? "#D32F2F"
                    : style.tension >= 3
                      ? colors.ocre.DEFAULT
                      : colors.bordeaux.DEFAULT
                }
                icon="⚡"
                warning={style.tension >= 4}
              />
            ) : null}
          </View>
        ) : null}

        {/* Description */}
        <View className="px-5 pt-5">
          <Text variant="body" style={{ lineHeight: 24 }}>
            {style.description}
          </Text>
        </View>

        {/* Avantages */}
        {style.avantages?.length ? (
          <View className="px-5 pt-6">
            <Text variant="h2" className="mb-3">
              ✨ Avantages
            </Text>
            {style.avantages.map((a, i) => (
              <View key={i} className="flex-row gap-2 mb-2">
                <Text variant="body-medium" className="text-bordeaux">
                  ·
                </Text>
                <Text variant="body" className="flex-1" style={{ lineHeight: 22 }}>
                  {a}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Précautions */}
        {style.precautions?.length ? (
          <View className="px-5 pt-6">
            <Text variant="h2" className="mb-3">
              ⚠️ Précautions
            </Text>
            {style.precautions.map((p, i) => (
              <View key={i} className="flex-row gap-2 mb-2">
                <Text variant="body-medium" className="text-ocre-deep">
                  ·
                </Text>
                <Text variant="body" className="flex-1" style={{ lineHeight: 22 }}>
                  {p}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Routine sous le style */}
        {style.routine_sous ? (
          <View className="px-5 pt-6">
            <Text variant="h2" className="mb-3">
              💧 Routine pendant le style
            </Text>
            <Card variant="outline">
              <Text variant="body" style={{ lineHeight: 22 }}>
                {style.routine_sous}
              </Text>
            </Card>
          </View>
        ) : null}

        {/* Après retrait */}
        {style.apres ? (
          <View className="px-5 pt-6">
            <Text variant="h2" className="mb-3">
              🪮 Au retrait
            </Text>
            <Card
              style={{
                borderLeftWidth: 4,
                borderLeftColor: colors.ocre.DEFAULT,
                backgroundColor: colors.cream.light,
              }}
            >
              <Text variant="body" style={{ lineHeight: 22 }}>
                {style.apres}
              </Text>
            </Card>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky bottom CTA */}
      {style.is_protective !== false ? (
        <View
          className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 border-t border-cream-warm"
          style={{ backgroundColor: colors.cream.DEFAULT }}
        >
          <Pressable
            onPress={onStart}
            disabled={isCurrent || startMut.isPending}
            className={`rounded-full py-4 items-center ${
              isCurrent ? "bg-cream-warm" : "bg-bordeaux"
            }`}
          >
            <Text
              variant="body-medium"
              style={{
                color: isCurrent
                  ? colors.ink.muted
                  : colors.white,
              }}
            >
              {isCurrent
                ? "● Déjà en cours"
                : startMut.isPending
                  ? "Démarrage…"
                  : "Démarrer ce style"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function ScoreCard({
  label,
  value,
  color,
  icon,
  warning,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
  warning?: boolean;
}) {
  return (
    <View
      className="flex-1 rounded-2xl p-3 border"
      style={{
        backgroundColor: colors.cream.light,
        borderColor: warning ? "#D32F2F33" : colors.cream.warm,
      }}
    >
      <Text variant="caption" className="mb-1">
        {icon} {label}
      </Text>
      <View className="flex-row items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{
              backgroundColor: i < value ? color : colors.cream.warm,
            }}
          />
        ))}
      </View>
      <Text
        variant="body-medium"
        className="mt-1"
        style={{ color: warning ? "#D32F2F" : colors.ink.DEFAULT }}
      >
        {value}/5
      </Text>
    </View>
  );
}
