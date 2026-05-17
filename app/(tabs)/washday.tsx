import { useEffect, useMemo } from "react";
import {
  View,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { colors } from "@/theme/colors";
import { useWashDayFlows, FLOW_PHOTOS } from "@/lib/washFlows";
import { useWashFlow } from "@/store/washFlow";
import {
  useWashSchedule,
  todayISO,
  isFuture,
  isPast,
  nextNDays,
} from "@/store/washSchedule";
import { PRODUCTS } from "@/lib/products";
import {
  MARKET_PRODUCTS,
  computeMatchBadge,
  BADGE_META,
} from "@/lib/marketCatalog";
import { useUserShelf } from "@/store/userShelf";
import { useProfile } from "@/lib/hooks/useProfile";
import type { WashDayFlow } from "@/lib/db-types";

const WEEKDAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function WashdayScreen() {
  const router = useRouter();
  const { data: flows } = useWashDayFlows();
  const startFlow = useWashFlow((s) => s.start);

  const load = useWashSchedule((s) => s.load);
  const scheduled = useWashSchedule((s) => s.scheduled);
  const schedule = useWashSchedule((s) => s.schedule);
  const unschedule = useWashSchedule((s) => s.unschedule);
  const loaded = useWashSchedule((s) => s.loaded);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const today = todayISO();
  const todaySched = scheduled.find((s) => s.date === today);
  const upcoming = scheduled.find((s) => !isPast(s.date) && s.date !== today);
  const days14 = useMemo(() => nextNDays(14), []);

  // User shelf (market products)
  const loadShelf = useUserShelf((s) => s.load);
  const shelfItems = useUserShelf((s) => s.items);
  const shelfLoaded = useUserShelf((s) => s.loaded);
  const { data: profile } = useProfile();

  useEffect(() => {
    if (!shelfLoaded) loadShelf();
  }, [shelfLoaded, loadShelf]);

  const userShelfProducts = useMemo(
    () =>
      shelfItems
        .map((i) => MARKET_PRODUCTS.find((p) => p.slug === i.product_slug))
        .filter((p): p is (typeof MARKET_PRODUCTS)[number] => !!p),
    [shelfItems],
  );

  const launch = (flow: WashDayFlow) => {
    startFlow(flow);
    router.push("/wash/intro");
  };

  const onTapDay = (iso: string) => {
    if (isPast(iso) && iso !== today) return;
    const existing = scheduled.find((s) => s.date === iso);
    if (existing) {
      unschedule(iso);
    } else {
      schedule(iso, "jour_de_lavage");
    }
  };

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Aujourd'hui
      </Text>
      <Text variant="h1" className="mb-6">
        Wash Day Journal
      </Text>

      {/* Calendrier 14 jours */}
      <Text variant="label" className="mb-3">
        📅 Planifier
      </Text>
      <Text variant="caption" className="mb-3">
        Touche un jour pour planifier ton prochain wash day
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="mb-6"
      >
        <View className="flex-row gap-2">
          {days14.map(({ iso, date }) => {
            const isToday = iso === today;
            const sched = scheduled.find((s) => s.date === iso);
            const active = !!sched;
            return (
              <Pressable
                key={iso}
                onPress={() => onTapDay(iso)}
                className={`rounded-2xl border ${
                  active
                    ? "bg-bordeaux border-bordeaux"
                    : isToday
                      ? "bg-cream-light border-bordeaux"
                      : "bg-cream-light border-cream-warm"
                }`}
                style={{ width: 56, paddingVertical: 10 }}
              >
                <Text
                  variant="caption"
                  className="text-center"
                  style={{
                    color: active
                      ? colors.cream.light
                      : isToday
                        ? colors.bordeaux.DEFAULT
                        : colors.ink.muted,
                    fontFamily: active || isToday
                      ? "Inter_600SemiBold"
                      : "Inter_400Regular",
                  }}
                >
                  {WEEKDAYS_SHORT[date.getDay()]}
                </Text>
                <Text
                  variant="h3"
                  className="text-center mt-1"
                  style={{
                    color: active
                      ? colors.white
                      : isToday
                        ? colors.bordeaux.DEFAULT
                        : colors.ink.DEFAULT,
                    fontSize: 20,
                  }}
                >
                  {date.getDate()}
                </Text>
                <View className="items-center mt-1" style={{ height: 6 }}>
                  {active ? (
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: colors.ocre.soft,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Hero — Aujourd'hui ou prochain */}
      {todaySched && flows ? (
        <Card variant="bordeaux" className="mb-6">
          <Text variant="label" className="mb-2" style={{ color: "#E8C481" }}>
            🌟 AUJOURD'HUI
          </Text>
          <Text variant="h2" className="mb-1" style={{ color: colors.white }}>
            C'est ton wash day
          </Text>
          <Text variant="body" className="mb-4" style={{ color: colors.cream.light }}>
            Lance ton flow pour suivre chaque étape avec minuteur.
          </Text>
          <Pressable
            onPress={() => {
              const flow =
                flows.find((f) => f.code === todaySched.flow_code) ??
                flows.find((f) => f.code === "jour_de_lavage") ??
                flows[0];
              if (flow) launch(flow);
            }}
            className="bg-cream-light rounded-full py-3 items-center"
          >
            <Text variant="body-medium" className="text-bordeaux">
              ▶ Lancer le flow
            </Text>
          </Pressable>
        </Card>
      ) : upcoming ? (
        <Card variant="outline" className="mb-6">
          <Text variant="label" className="mb-2">
            ⏳ Prochain wash day
          </Text>
          <Text variant="h2" className="mb-1">
            {formatDate(upcoming.date)}
          </Text>
          <Text variant="caption">
            Dans {daysUntil(upcoming.date)} jour
            {daysUntil(upcoming.date) > 1 ? "s" : ""} — prépare ton étagère
          </Text>
        </Card>
      ) : null}

      {/* Flows rapides */}
      <Text variant="label" className="mb-3">
        ⚡ Flows rapides
      </Text>
      <Text variant="caption" className="mb-3">
        Un soin ciblé en quelques minutes
      </Text>
      <View className="flex-row flex-wrap gap-3 mb-8">
        {(flows ?? []).map((flow) => (
          <Pressable
            key={flow.id}
            onPress={() => launch(flow)}
            className="bg-cream-light rounded-2xl overflow-hidden border border-cream-warm"
            style={{ width: "48%" }}
          >
            <View className="h-28 bg-bordeaux items-center justify-center">
              {FLOW_PHOTOS[flow.code] ? (
                <Image
                  source={FLOW_PHOTOS[flow.code] as number}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View className="p-3">
              <Text variant="body-medium" numberOfLines={2} className="mb-0.5">
                {flow.title}
              </Text>
              <Text variant="caption">
                {flow.total_duration_min} min
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Étagère produit mixte */}
      <View className="flex-row items-center justify-between mb-3">
        <Text variant="label">🧴 Ton étagère wash day</Text>
        <Pressable onPress={() => router.push("/shelf/browse")}>
          <Text variant="caption" className="text-bordeaux">
            + Ajouter
          </Text>
        </Pressable>
      </View>
      <Text variant="caption" className="mb-3">
        Tes produits SB Haircare et ceux que tu as choisis
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <View className="flex-row gap-3">
          {/* SB Haircare always first */}
          {PRODUCTS.map((p) => (
            <View
              key={`sb-${p.slug}`}
              className="bg-cream-light rounded-2xl border border-cream-warm overflow-hidden"
              style={{ width: 130 }}
            >
              <View className="h-28 bg-cream-warm relative">
                <Image
                  source={{ uri: p.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    backgroundColor: "#1F7A3D",
                    borderRadius: 999,
                    paddingHorizontal: 7,
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
                    ★ SB
                  </Text>
                </View>
              </View>
              <View className="p-2">
                <Text
                  variant="caption"
                  numberOfLines={2}
                  style={{
                    color: colors.ink.DEFAULT,
                    fontFamily: "Inter_600SemiBold",
                    lineHeight: 16,
                  }}
                >
                  {p.name}
                </Text>
                <Text variant="caption" className="text-bordeaux mt-1">
                  {p.price_eur.toFixed(2)} €
                </Text>
              </View>
            </View>
          ))}

          {/* User shelf market products */}
          {userShelfProducts.map((p) => {
            const { badge } = computeMatchBadge(
              p,
              profile?.porosity,
              profile?.hair_type,
            );
            const meta = BADGE_META[badge];
            return (
              <Pressable
                key={`user-${p.slug}`}
                onPress={() => router.push(`/shelf/product/${p.slug}`)}
                className="bg-cream-light rounded-2xl border border-cream-warm overflow-hidden"
                style={{ width: 130 }}
              >
                <View className="h-28 bg-cream-warm relative">
                  <Image
                    source={p.photo}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      backgroundColor: meta.color,
                      borderRadius: 999,
                      paddingHorizontal: 6,
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
                      lineHeight: 16,
                    }}
                  >
                    {p.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* Add CTA */}
          <Pressable
            onPress={() => router.push("/shelf/browse")}
            className="rounded-2xl border-2 border-dashed border-cream-warm items-center justify-center"
            style={{ width: 130, minHeight: 168 }}
          >
            <Text variant="h2" className="text-ink-muted mb-1">
              +
            </Text>
            <Text variant="caption" className="text-ink-muted text-center px-2">
              Ajouter un produit
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function daysUntil(iso: string): number {
  const target = new Date(iso);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
