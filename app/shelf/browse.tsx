import { useMemo, useState, useEffect } from "react";
import {
  View,
  Pressable,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { PressableHaptic } from "@/components/PressableHaptic";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Pill } from "@/components/Pill";
import { colors } from "@/theme/colors";
import {
  MARKET_PRODUCTS,
  CATEGORY_LABELS_MARKET,
  computeMatchBadge,
  BADGE_META,
  type ProductCategory,
} from "@/lib/marketCatalog";
import { useUserShelf } from "@/store/userShelf";
import { useProfile } from "@/lib/hooks/useProfile";

const CATEGORY_FILTERS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "leave-in", label: "Leave-in" },
  { value: "creme", label: "Crème" },
  { value: "masque", label: "Masque" },
  { value: "huile", label: "Huile" },
  { value: "shampoing", label: "Shampoing" },
  { value: "co-wash", label: "Co-wash" },
  { value: "gel", label: "Gel" },
];

export default function BrowseShelf() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ProductCategory | "all">("all");
  const [onlyMyMatch, setOnlyMyMatch] = useState(false);

  const { data: profile } = useProfile();
  const loadShelf = useUserShelf((s) => s.load);
  const items = useUserShelf((s) => s.items);

  useEffect(() => {
    loadShelf();
  }, [loadShelf]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return MARKET_PRODUCTS.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (ql) {
        const blob = `${p.name} ${p.brand} ${p.inci}`.toLowerCase();
        if (!blob.includes(ql)) return false;
      }
      if (onlyMyMatch && profile) {
        const { badge } = computeMatchBadge(
          p,
          profile.porosity,
          profile.hair_type,
        );
        if (badge !== "top" && badge !== "good") return false;
      }
      return true;
    });
  }, [q, cat, onlyMyMatch, profile]);

  return (
    <ScreenContainer>
      <Pressable
        onPress={() => router.back()}
        className="mb-4"
        hitSlop={12}
      >
        <Text variant="body-medium" className="text-bordeaux">
          ← Retour
        </Text>
      </Pressable>

      <Text variant="label" className="mb-2">
        Catalogue
      </Text>
      <Text variant="h1" className="mb-4">
        Trouve ton produit
      </Text>

      {/* Search */}
      <View
        className="bg-cream-light rounded-2xl border border-cream-warm px-4 py-3 mb-4 flex-row items-center"
      >
        <Text className="mr-2">🔍</Text>
        <TextInput
          placeholder="Cherche par marque ou nom…"
          placeholderTextColor={colors.ink.muted}
          value={q}
          onChangeText={setQ}
          style={{
            flex: 1,
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: colors.ink.DEFAULT,
            padding: 0,
          }}
        />
      </View>

      {/* Match filter toggle */}
      {profile?.porosity ? (
        <Pressable onPress={() => setOnlyMyMatch((v) => !v)} className="mb-4">
          <View
            className={`rounded-2xl px-4 py-3 border flex-row items-center justify-between ${
              onlyMyMatch
                ? "bg-bordeaux border-bordeaux"
                : "bg-cream-light border-cream-warm"
            }`}
          >
            <Text
              variant="body-medium"
              style={{
                color: onlyMyMatch ? colors.white : colors.ink.DEFAULT,
              }}
            >
              {onlyMyMatch ? "✓ " : ""}Adaptés à mon profil
            </Text>
            <Text
              variant="caption"
              style={{
                color: onlyMyMatch ? colors.cream.light : colors.ink.muted,
              }}
            >
              {profile.hair_type?.toUpperCase()} ·{" "}
              {profile.porosity === "low"
                ? "Faible"
                : profile.porosity === "high"
                  ? "Élevée"
                  : "Moyenne"}
            </Text>
          </View>
        </Pressable>
      ) : null}

      {/* Categories filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {CATEGORY_FILTERS.map((f) => {
            const active = cat === f.value;
            return (
              <Pressable key={f.value} onPress={() => setCat(f.value)}>
                <View
                  className={`rounded-full px-4 py-2 border ${
                    active
                      ? "bg-ink border-ink"
                      : "bg-cream-light border-cream-warm"
                  }`}
                  style={
                    active
                      ? { backgroundColor: colors.ink.DEFAULT, borderColor: colors.ink.DEFAULT }
                      : undefined
                  }
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

      <Text variant="caption" className="mb-3">
        {filtered.length} produit{filtered.length > 1 ? "s" : ""}
      </Text>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View className="bg-cream-light rounded-2xl border border-cream-warm p-6 items-center">
          <Text variant="body" className="text-center text-ink-soft mb-3">
            Aucun produit ne correspond. On peut l'ajouter au catalogue.
          </Text>
          <Pressable
            onPress={() => router.push("/shelf/suggest")}
            className="bg-bordeaux rounded-full px-4 py-2"
          >
            <Text variant="body-medium" style={{ color: colors.white }}>
              Suggérer ce produit
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-3">
          {filtered.map((p) => {
            const { badge } = computeMatchBadge(
              p,
              profile?.porosity,
              profile?.hair_type,
            );
            const meta = BADGE_META[badge];
            const onShelf = items.some((i) => i.product_slug === p.slug);
            return (
              <PressableHaptic
                key={p.slug}
                hapticStyle="light"
                onPress={() => router.push(`/shelf/product/${p.slug}`)}
                className="bg-cream-light rounded-2xl overflow-hidden border border-cream-warm"
                style={{ width: "48%" }}
              >
                <View className="h-32 bg-cream-warm relative">
                  {p.image_url ? (
                    <Image
                      source={{ uri: p.image_url }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: meta.color,
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: colors.white,
                        fontSize: 10,
                        fontFamily: "Inter_600SemiBold",
                      }}
                    >
                      {meta.label}
                    </Text>
                  </View>
                  {onShelf ? (
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: colors.cream.light,
                        borderRadius: 999,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                      }}
                    >
                      <Text variant="caption" className="text-bordeaux" style={{ fontSize: 10 }}>
                        ✓ Étagère
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View className="p-2.5">
                  <Text
                    variant="caption"
                    style={{
                      color: colors.ink.muted,
                      fontFamily: "Inter_500Medium",
                      fontSize: 11,
                    }}
                  >
                    {p.brand}
                  </Text>
                  <Text
                    variant="body-medium"
                    numberOfLines={2}
                    style={{ lineHeight: 18, fontSize: 13 }}
                  >
                    {p.name}
                  </Text>
                  <Text variant="caption" className="mt-1">
                    {CATEGORY_LABELS_MARKET[p.category]}
                  </Text>
                </View>
              </PressableHaptic>
            );
          })}
        </View>
      )}

      {/* Suggest CTA */}
      <Pressable
        onPress={() => router.push("/shelf/suggest")}
        className="mt-6 mb-2 items-center"
      >
        <Text variant="caption" className="text-bordeaux">
          🙋 Tu ne trouves pas ton produit ? Suggère-le
        </Text>
      </Pressable>
    </ScreenContainer>
  );
}
