import { useMemo, useState } from "react";
import { View, Pressable, Image, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { colors } from "@/theme/colors";
import {
  HAIRSTYLES,
  HAIRSTYLE_PHOTOS,
  durationLabel,
  type Hairstyle,
  type HairstyleCategory,
} from "@/lib/hairstyles";
import {
  useCurrentProtectiveStyle,
  useStartProtectiveStyle,
  useEndProtectiveStyle,
  daysRemaining,
} from "@/lib/hooks/useProtectiveStyle";

const FILTERS: { value: HairstyleCategory | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "braids", label: "Tresses" },
  { value: "twists", label: "Twists" },
  { value: "cornrows", label: "Cornrows" },
  { value: "wig", label: "Tissages" },
  { value: "natural", label: "Naturel" },
];

export default function HairstyleScreen() {
  const [filter, setFilter] = useState<HairstyleCategory | "all">("all");
  const { data: current } = useCurrentProtectiveStyle();
  const startMut = useStartProtectiveStyle();
  const endMut = useEndProtectiveStyle();

  const filtered = useMemo(() => {
    if (filter === "all") return HAIRSTYLES;
    return HAIRSTYLES.filter((s) => s.category === filter);
  }, [filter]);

  const onStartStyle = (s: Hairstyle) => {
    startMut.mutate({
      style_code: s.code,
      style_name: s.name,
      duration_weeks_max: s.duration_weeks_max,
    });
  };

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        HairStyle
      </Text>
      <Text variant="h1" className="mb-6">
        Mon planner cheveux
      </Text>

      {/* Compteur de style protecteur */}
      {current ? (
        <CurrentStyleCard
          log={current}
          onEnd={() => endMut.mutate(current.id)}
        />
      ) : (
        <Card variant="outline" className="mb-6">
          <Text variant="label" className="mb-2">
            🎀 Compteur de style
          </Text>
          <Text variant="body" className="mb-3">
            Aucun style protecteur en cours. Choisis-en un dans la galerie pour
            lancer le compteur.
          </Text>
        </Card>
      )}

      {/* Catégories filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <Pressable key={f.value} onPress={() => setFilter(f.value)}>
                <View
                  className={`rounded-full px-4 py-2 border ${
                    active
                      ? "bg-bordeaux border-bordeaux"
                      : "bg-cream-light border-cream-warm"
                  }`}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: active ? colors.white : colors.ink.DEFAULT,
                      fontFamily: active
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                    }}
                  >
                    {f.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Inspiration grid (2 columns) */}
      <Text variant="label" className="mb-3">
        ✨ Inspiration
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {filtered.map((s) => (
          <StyleCard
            key={s.code}
            style={s}
            isCurrent={current?.style_code === s.code}
            onStart={() => onStartStyle(s)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

// -----------------------------------------------------------------------------
// Current style card with countdown
// -----------------------------------------------------------------------------

function CurrentStyleCard({
  log,
  onEnd,
}: {
  log: { id: string; style_name: string; recommended_remove_on: string; installed_on: string };
  onEnd: () => void;
}) {
  const remaining = daysRemaining(log as any);
  const overdue = remaining < 0;
  const removeDate = new Date(log.recommended_remove_on).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long" },
  );

  return (
    <Card variant="bordeaux" className="mb-6">
      <Text variant="label" className="mb-2" style={{ color: "#E8C481" }}>
        STYLE EN COURS
      </Text>
      <Text variant="h2" className="mb-1" style={{ color: colors.white }}>
        {log.style_name}
      </Text>
      <Text variant="body" className="mb-1" style={{ color: colors.cream.light }}>
        {overdue
          ? `Retrait recommandé il y a ${Math.abs(remaining)} jours`
          : remaining === 0
            ? "Retrait recommandé aujourd'hui"
            : `${remaining} jours restants — retrait conseillé le ${removeDate}`}
      </Text>
      <View className="h-2 rounded-full overflow-hidden mt-3 mb-3" style={{ backgroundColor: "#3A0B10" }}>
        <View
          style={{
            width: `${overdue ? 100 : Math.min(100, ((daysSinceInstall(log.installed_on)) / Math.max(1, daysSinceInstall(log.installed_on) + remaining)) * 100)}%`,
            height: "100%",
            backgroundColor: overdue ? "#D4A24C" : "#E8C481",
          }}
        />
      </View>
      <Pressable
        onPress={onEnd}
        className="self-start bg-cream-light rounded-full px-4 py-2"
      >
        <Text variant="body-medium" className="text-bordeaux">
          ✓ J'ai retiré
        </Text>
      </Pressable>
    </Card>
  );
}

function daysSinceInstall(install: string): number {
  const ms = new Date().getTime() - new Date(install).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

// -----------------------------------------------------------------------------
// Style card (image or gradient placeholder)
// -----------------------------------------------------------------------------

function StyleCard({
  style,
  isCurrent,
  onStart,
}: {
  style: Hairstyle;
  isCurrent: boolean;
  onStart: () => void;
}) {
  return (
    <Pressable
      onPress={isCurrent ? undefined : onStart}
      className="bg-cream-light rounded-2xl overflow-hidden border border-cream-warm"
      style={{ width: "48%" }}
    >
      <View className="h-36 bg-bordeaux items-center justify-center">
        {HAIRSTYLE_PHOTOS[style.code] ? (
          <Image
            source={HAIRSTYLE_PHOTOS[style.code] as number}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Text
            variant="h3"
            style={{
              color: colors.cream.light,
              textAlign: "center",
              paddingHorizontal: 8,
              fontSize: 14,
              lineHeight: 18,
            }}
          >
            {style.name}
          </Text>
        )}
        {isCurrent ? (
          <View className="absolute top-2 left-2 bg-cream-light rounded-full px-2 py-0.5">
            <Text variant="caption" className="text-bordeaux">
              ● En cours
            </Text>
          </View>
        ) : null}
      </View>
      <View className="p-3">
        <Text variant="body-medium" className="mb-0.5">
          {style.name}
        </Text>
        <Text variant="caption">{durationLabel(style)}</Text>
      </View>
    </Pressable>
  );
}
