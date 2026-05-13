import { View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Pill } from "@/components/Pill";
import { RECIPES, ARTICLES } from "@/lib/learn";

export default function LearnScreen() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Apprendre
      </Text>
      <Text variant="h1" className="mb-6">
        Recettes & articles
      </Text>

      {/* Recettes DIY */}
      <View className="flex-row items-baseline justify-between mb-3">
        <Text variant="h3">🌿 Recettes DIY</Text>
        <Text variant="caption">{RECIPES.length} recettes</Text>
      </View>
      <View className="mb-6">
        {RECIPES.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => router.push(`/learn/recipe/${r.id}`)}
            className="bg-cream-light rounded-2xl mb-3 overflow-hidden border border-cream-warm flex-row"
          >
            <Image
              source={{ uri: r.hero_image }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
            <View className="flex-1 p-3 justify-center">
              <Text variant="body-medium" className="mb-0.5" numberOfLines={1}>
                {r.title}
              </Text>
              <Text variant="caption" className="mb-1">
                {r.tag}
              </Text>
              <View className="flex-row gap-2">
                <Text variant="caption" className="text-ocre-deep">
                  ⏱ {r.duration}
                </Text>
                <Text variant="caption">·</Text>
                <Text variant="caption">{r.frequency}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Articles */}
      <View className="flex-row items-baseline justify-between mb-3">
        <Text variant="h3">📖 Articles</Text>
        <Text variant="caption">{ARTICLES.length} articles</Text>
      </View>
      <View>
        {ARTICLES.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => router.push(`/learn/article/${a.id}`)}
            className="bg-cream-light rounded-2xl mb-3 overflow-hidden border border-cream-warm flex-row"
          >
            <Image
              source={{ uri: a.hero_image }}
              style={{ width: 80, height: 80 }}
              resizeMode="cover"
            />
            <View className="flex-1 p-3 justify-center">
              <Text variant="body-medium" className="mb-0.5" numberOfLines={2}>
                {a.title}
              </Text>
              <Text variant="caption" numberOfLines={1} className="mb-1">
                {a.subtitle}
              </Text>
              <Text variant="caption" className="text-ocre-deep">
                {a.read_time} de lecture
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}
