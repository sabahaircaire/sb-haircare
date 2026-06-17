import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Pill } from "@/components/Pill";
import { Button } from "@/components/Button";
import { colors } from "@/theme/colors";
import {
  getMarketProduct,
  computeMatchBadge,
  BADGE_META,
  FLAG_LABELS,
  CATEGORY_LABELS_MARKET,
  activeFlags,
} from "@/lib/marketCatalog";
import { useUserShelf } from "@/store/userShelf";
import { useProfile, porosityLabel } from "@/lib/hooks/useProfile";
import { PRODUCTS as SB_PRODUCTS } from "@/lib/products";
import { success as hapticSuccess, impact as hapticImpact } from "@/lib/haptics";
import { useRef } from "react";
import { Animated } from "react-native";

export default function ProductDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const product = getMarketProduct(slug as string);
  const { data: profile } = useProfile();
  const has = useUserShelf((s) => s.has);
  const add = useUserShelf((s) => s.add);
  const remove = useUserShelf((s) => s.remove);

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <Text variant="h2" className="p-6">
          Produit introuvable
        </Text>
      </SafeAreaView>
    );
  }

  const onShelf = has(product.slug);
  const { badge, score } = computeMatchBadge(
    product,
    profile?.porosity,
    profile?.hair_type,
  );
  const meta = BADGE_META[badge];
  const sbAlt = product.sb_alternative_slug
    ? SB_PRODUCTS.find((p) => p.slug === product.sb_alternative_slug)
    : undefined;

  const ingScore = { A: 5, B: 4, C: 3, D: 2, E: 1 }[product.ingredients_grade];
  const porosityScore = product.good_for_porosity;
  const productFlags = activeFlags(product.flags);

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={{ position: "relative", height: 320 }}>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.cream.warm,
            }}
          >
            {product.image_url ? (
              <Image
                source={{ uri: product.image_url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : null}
          </View>
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
        </View>

        {/* Header */}
        <View className="px-5 pt-5">
          <Text variant="label">{product.brand}</Text>
          <Text variant="h1" className="mt-1 mb-2">
            {product.name}
          </Text>
          <View className="flex-row gap-2 mb-3 flex-wrap">
            <Pill variant="soft">
              <Text variant="caption" className="text-bordeaux">
                {CATEGORY_LABELS_MARKET[product.category]}
              </Text>
            </Pill>
            <Pill variant="soft">
              <Text variant="caption" className="text-bordeaux">
                {product.size_ml} ml
              </Text>
            </Pill>
            <Pill variant="soft">
              <Text variant="caption" className="text-bordeaux">
                ~{product.price_eur.toFixed(2)} €
              </Text>
            </Pill>
          </View>
          <Text variant="body" style={{ lineHeight: 22 }}>
            {product.usage_guide}
          </Text>
        </View>

        {/* Badge global */}
        <View className="px-5 pt-5">
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: `${meta.color}1A` }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  variant="label"
                  style={{ color: meta.color, marginBottom: 4 }}
                >
                  Match pour ton profil
                </Text>
                <Text
                  variant="h2"
                  style={{ color: meta.color, fontSize: 22 }}
                >
                  {meta.emoji} {meta.label}
                </Text>
                {profile ? (
                  <Text variant="caption" className="mt-1">
                    {profile.hair_type?.toUpperCase()} ·{" "}
                    {porosityLabel(profile.porosity)}
                  </Text>
                ) : null}
              </View>
              <Text
                variant="display"
                style={{
                  color: meta.color,
                  fontSize: 36,
                  lineHeight: 40,
                }}
              >
                {score}
              </Text>
            </View>
          </View>
        </View>

        {/* Sub-scores */}
        <View className="px-5 pt-4">
          <View className="flex-row gap-3 flex-wrap">
            {porosityScore !== null ? (
              <SubScore
                icon="💧"
                label="Porosité"
                value={porosityScore}
                hint={profile?.porosity ?? "?"}
              />
            ) : null}
            <SubScore
              icon="🌿"
              label="Ingrédients"
              value={ingScore}
              hint={product.ingredients_grade}
            />
            <SubScore
              icon="🎯"
              label="Type cheveux"
              value={product.good_for_type}
              hint={profile?.hair_type?.toUpperCase() ?? "?"}
            />
          </View>
        </View>

        {/* INCI */}
        <View className="px-5 pt-6">
          <Text variant="label" className="mb-2">
            🌱 INCI
          </Text>
          <Card variant="outline">
            <Text
              variant="caption"
              style={{ lineHeight: 18, color: colors.ink.soft }}
            >
              {product.inci}
            </Text>
          </Card>
        </View>

        {/* Flags */}
        {productFlags.length ? (
          <View className="px-5 pt-6">
            <Text variant="label" className="mb-2">
              🏷 À surveiller
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {productFlags.map((f) => {
                const m = FLAG_LABELS[f];
                return (
                  <View
                    key={f}
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: m.positive
                        ? "#1F7A3D1A"
                        : "#D32F2F1A",
                    }}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: m.positive ? "#1F7A3D" : "#B71C1C",
                        fontSize: 11,
                      }}
                    >
                      {m.positive ? "✓ " : "⚠ "}
                      {m.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Cross-sell SB Haircare */}
        {sbAlt && (badge === "ok" || badge === "avoid") ? (
          <View className="px-5 pt-6">
            <Card variant="bordeaux">
              <Text variant="label" style={{ color: "#E8C481" }} className="mb-2">
                ALTERNATIVE SB HAIRCARE
              </Text>
              <Text variant="h3" style={{ color: colors.white }} className="mb-1">
                Essaie {sbAlt.name}
              </Text>
              <Text variant="body" style={{ color: colors.cream.light }} className="mb-3">
                {sbAlt.short ?? sbAlt.name}
              </Text>
              <Pressable
                onPress={() => Linking.openURL(sbAlt.url)}
                className="bg-cream-light rounded-full py-2 self-start px-4"
              >
                <Text variant="body-medium" className="text-bordeaux">
                  Voir le produit · {sbAlt.price_eur.toFixed(2)} €
                </Text>
              </Pressable>
            </Card>
          </View>
        ) : null}

        {/* Source */}
        {product.product_url ? (
          <View className="px-5 pt-6">
            <Pressable onPress={() => Linking.openURL(product.product_url!)}>
              <Text variant="caption" className="text-bordeaux">
                Voir sur le site officiel →
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky CTA */}
      <ShelfCTA
        onShelf={onShelf}
        onToggle={async () => {
          if (onShelf) {
            await hapticImpact("light");
            remove(product.slug);
          } else {
            await hapticSuccess();
            add(product.slug);
            // Une fois ajouté, on revient à la liste des produits
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/shelf/browse");
            }
          }
        }}
      />
    </View>
  );
}

function ShelfCTA({
  onShelf,
  onToggle,
}: {
  onShelf: boolean;
  onToggle: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };
  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 border-t border-cream-warm"
      style={{ backgroundColor: colors.cream.DEFAULT }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onToggle}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={({ pressed }) => ({
            backgroundColor: onShelf
              ? "#EFE3CF"
              : pressed
                ? "#3A0B10"
                : "#4A1015",
            borderRadius: 999,
            paddingVertical: 16,
            alignItems: "center",
          })}
        >
          <Text
            variant="body-medium"
            style={{
              color: onShelf ? colors.bordeaux.DEFAULT : colors.white,
              fontSize: 16,
            }}
          >
            {onShelf
              ? "✓ Sur mon étagère — retirer"
              : "+ Ajouter à mon étagère"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function SubScore({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <View
      className="rounded-2xl p-3 border bg-cream-light border-cream-warm"
      style={{ width: "31%" }}
    >
      <Text variant="caption" className="mb-1">
        {icon} {label}
      </Text>
      <View className="flex-row items-center gap-1 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{
              backgroundColor:
                i < value ? colors.bordeaux.DEFAULT : colors.cream.warm,
            }}
          />
        ))}
      </View>
      <Text variant="caption" style={{ fontSize: 10 }}>
        {value}/5{hint ? ` · ${hint}` : ""}
      </Text>
    </View>
  );
}
