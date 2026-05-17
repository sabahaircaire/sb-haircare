import { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PressableHaptic } from "@/components/PressableHaptic";
import { Input } from "@/components/Input";
import { colors } from "@/theme/colors";
import { useWashDayFlows, FLOW_PHOTOS } from "@/lib/washFlows";
import { useWashSchedule } from "@/store/washSchedule";
import { useUserShelf } from "@/store/userShelf";
import { useProfile } from "@/lib/hooks/useProfile";
import {
  MARKET_PRODUCTS,
  computeMatchBadge,
  BADGE_META,
} from "@/lib/marketCatalog";
import { PRODUCTS as SB_PRODUCTS } from "@/lib/products";
import {
  success as hapticSuccess,
  impact as hapticImpact,
} from "@/lib/haptics";
import {
  ensureNotificationPermission,
  scheduleWashDayReminder,
} from "@/lib/notifications";

export default function PlanWashDay() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = params.date ?? new Date().toISOString().slice(0, 10);
  const router = useRouter();

  const { data: flows } = useWashDayFlows();
  const scheduled = useWashSchedule((s) => s.scheduled);
  const schedule = useWashSchedule((s) => s.schedule);
  const unschedule = useWashSchedule((s) => s.unschedule);

  const userShelf = useUserShelf((s) => s.items);
  const { data: profile } = useProfile();

  const existing = scheduled.find((s) => s.date === date);

  const [flowCode, setFlowCode] = useState<string | undefined>(
    existing?.flow_code ?? "jour_de_lavage",
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(existing?.product_slugs ?? []),
  );
  const [notes, setNotes] = useState<string>(existing?.notes ?? "");
  const [remindMe, setRemindMe] = useState<boolean>(true);

  const shelfProducts = useMemo(() => {
    const sb = SB_PRODUCTS.map((p) => ({
      slug: `sb:${p.slug}`,
      name: p.name,
      brand: "SB Haircare",
      image_url: p.image,
      badge: "top" as const,
    }));
    const userMarket = userShelf
      .map((i) => MARKET_PRODUCTS.find((p) => p.slug === i.product_slug))
      .filter((p): p is (typeof MARKET_PRODUCTS)[number] => !!p)
      .map((p) => {
        const { badge } = computeMatchBadge(
          p,
          profile?.porosity,
          profile?.hair_type,
        );
        return {
          slug: `market:${p.slug}`,
          name: p.name,
          brand: p.brand,
          image_url: p.image_url,
          badge,
        };
      });
    return [...sb, ...userMarket];
  }, [userShelf, profile]);

  const toggleProduct = (slug: string) => {
    hapticImpact("light");
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const onConfirm = async () => {
    await schedule({
      date,
      flow_code: flowCode,
      product_slugs: Array.from(selectedProducts),
      notes: notes.trim() || undefined,
    });
    await hapticSuccess();

    if (remindMe) {
      const ok = await ensureNotificationPermission();
      if (ok) await scheduleWashDayReminder(date);
    }

    router.back();
  };

  const onCancel = () => {
    if (!existing) {
      router.back();
      return;
    }
    Alert.alert(
      "Supprimer ce wash day ?",
      "Tu peux replanifier à tout moment depuis le calendrier.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await unschedule(date);
            router.back();
          },
        },
      ],
    );
  };

  const formatted = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View className="flex-1 bg-cream">
      <ScreenContainer>
        <Pressable onPress={() => router.back()} className="mb-4" hitSlop={12}>
          <Text variant="body-medium" className="text-bordeaux">
            ← Annuler
          </Text>
        </Pressable>

        <Text variant="label" className="mb-2">
          {existing ? "Modifier" : "Planifier"}
        </Text>
        <Text variant="h1" className="mb-2 capitalize">
          {formatted}
        </Text>
        <Text variant="body" className="text-ink-soft mb-6">
          Choisis ton flow et les produits que tu vas utiliser.
        </Text>

        {/* Flow selection */}
        <Text variant="label" className="mb-3">
          ⚡ Ton flow
        </Text>
        <View className="gap-2 mb-6">
          {(flows ?? []).map((flow) => {
            const selected = flowCode === flow.code;
            return (
              <PressableHaptic
                key={flow.code}
                hapticStyle="light"
                onPress={() => setFlowCode(flow.code)}
              >
                <View
                  className={`rounded-2xl border flex-row items-center gap-3 p-2 ${
                    selected
                      ? "bg-bordeaux border-bordeaux"
                      : "bg-cream-light border-cream-warm"
                  }`}
                >
                  <View
                    className="w-16 h-16 rounded-xl overflow-hidden"
                    style={{ backgroundColor: colors.cream.warm }}
                  >
                    {FLOW_PHOTOS[flow.code] ? (
                      <Image
                        source={FLOW_PHOTOS[flow.code] as number}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                  <View className="flex-1">
                    <Text
                      variant="body-medium"
                      style={{
                        color: selected ? colors.white : colors.ink.DEFAULT,
                      }}
                    >
                      {flow.title}
                    </Text>
                    <Text
                      variant="caption"
                      style={{
                        color: selected ? colors.cream.light : colors.ink.muted,
                      }}
                    >
                      {flow.steps.length} étapes · {flow.total_duration_min} min
                    </Text>
                  </View>
                  {selected ? (
                    <View className="mr-3">
                      <Text style={{ color: colors.white, fontSize: 18 }}>
                        ✓
                      </Text>
                    </View>
                  ) : null}
                </View>
              </PressableHaptic>
            );
          })}
        </View>

        {/* Products selection */}
        <Text variant="label" className="mb-3">
          🧴 Produits à utiliser
        </Text>
        <Text variant="caption" className="mb-3">
          {selectedProducts.size === 0
            ? "Sélectionne les produits de ton étagère"
            : `${selectedProducts.size} sélectionné${selectedProducts.size > 1 ? "s" : ""}`}
        </Text>
        {shelfProducts.length === 0 ? (
          <Card variant="outline" className="mb-6">
            <Text variant="body" className="mb-2">
              Ton étagère est vide.
            </Text>
            <Pressable
              onPress={() => router.push("/shelf/browse")}
            >
              <Text variant="body-medium" className="text-bordeaux">
                Ajouter des produits →
              </Text>
            </Pressable>
          </Card>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
            className="mb-6"
          >
            <View className="flex-row gap-3">
              {shelfProducts.map((p) => {
                const selected = selectedProducts.has(p.slug);
                const meta = BADGE_META[p.badge];
                return (
                  <PressableHaptic
                    key={p.slug}
                    hapticStyle="light"
                    onPress={() => toggleProduct(p.slug)}
                    style={{ width: 110 }}
                  >
                    <View
                      className={`rounded-2xl border overflow-hidden ${
                        selected
                          ? "border-bordeaux"
                          : "border-cream-warm"
                      }`}
                      style={{
                        backgroundColor: colors.cream.light,
                        borderWidth: selected ? 2 : 1,
                      }}
                    >
                      <View
                        className="h-20 relative"
                        style={{ backgroundColor: colors.cream.warm }}
                      >
                        {p.image_url ? (
                          <Image
                            source={
                              p.slug.startsWith("sb:")
                                ? { uri: p.image_url }
                                : { uri: p.image_url }
                            }
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        ) : null}
                        <View
                          style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            backgroundColor: meta.color,
                            borderRadius: 999,
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                          }}
                        >
                          <Text
                            variant="caption"
                            style={{
                              color: colors.white,
                              fontSize: 9,
                              fontFamily: "Inter_600SemiBold",
                            }}
                          >
                            {meta.emoji}
                          </Text>
                        </View>
                        {selected ? (
                          <View
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: colors.bordeaux.DEFAULT,
                              width: 22,
                              height: 22,
                              borderRadius: 11,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{ color: colors.white, fontSize: 12 }}
                            >
                              ✓
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <View className="p-2">
                        <Text
                          variant="caption"
                          style={{
                            color: colors.ink.muted,
                            fontSize: 10,
                            fontFamily: "Inter_500Medium",
                          }}
                        >
                          {p.brand}
                        </Text>
                        <Text
                          variant="caption"
                          numberOfLines={2}
                          style={{
                            color: colors.ink.DEFAULT,
                            fontFamily: "Inter_600SemiBold",
                            lineHeight: 14,
                          }}
                        >
                          {p.name}
                        </Text>
                      </View>
                    </View>
                  </PressableHaptic>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Notes */}
        <Text variant="label" className="mb-3">
          📝 Notes (optionnel)
        </Text>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: tester la nouvelle Chantilly, attention aux pointes…"
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {/* Remind me toggle */}
        <PressableHaptic
          hapticStyle="light"
          onPress={() => setRemindMe((v) => !v)}
          className="mt-6"
        >
          <Card variant="outline" className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text variant="body-medium">🔔 Me le rappeler</Text>
              <Text variant="caption">
                Notification à 9h le jour J
              </Text>
            </View>
            <View
              className="w-12 h-7 rounded-full justify-center"
              style={{
                backgroundColor: remindMe
                  ? colors.bordeaux.DEFAULT
                  : colors.cream.warm,
                paddingHorizontal: 2,
              }}
            >
              <View
                className="w-5 h-5 rounded-full bg-white"
                style={{
                  alignSelf: remindMe ? "flex-end" : "flex-start",
                }}
              />
            </View>
          </Card>
        </PressableHaptic>

        <View className="h-8" />

        <Button
          label={existing ? "Mettre à jour" : "✓ Planifier ce wash day"}
          onPress={onConfirm}
          haptic="success"
        />

        {existing ? (
          <Pressable
            onPress={onCancel}
            className="mt-3 items-center py-3"
          >
            <Text variant="caption" style={{ color: "#D32F2F" }}>
              Supprimer ce wash day
            </Text>
          </Pressable>
        ) : null}
      </ScreenContainer>
    </View>
  );
}
