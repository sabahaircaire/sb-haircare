import { ScrollView, View, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { colors } from "@/theme/colors";
import { getArticle, type ArticleSection } from "@/lib/learn";

export default function ArticleReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const article = getArticle(id as string);

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <Text variant="h2" className="p-6">
          Article introuvable
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Hero */}
        <View style={{ position: "relative", height: 240 }}>
          <Image
            source={article.hero_image}
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
            <Text
              variant="h1"
              style={{
                color: colors.white,
                fontSize: 26,
                lineHeight: 32,
              }}
            >
              {article.title}
            </Text>
            <Text
              variant="caption"
              style={{ color: colors.cream.light, marginTop: 6 }}
            >
              {article.subtitle} · {article.read_time} de lecture
            </Text>
          </View>
        </View>

        {/* Sections */}
        <View className="px-5 pt-6">
          {article.sections.map((s, i) => (
            <Section key={i} section={s} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ section }: { section: ArticleSection }) {
  if (section.type === "intro") {
    return (
      <View
        className="mb-6 pl-4"
        style={{ borderLeftWidth: 3, borderLeftColor: colors.bordeaux.DEFAULT }}
      >
        <Text variant="body-medium" style={{ lineHeight: 24 }}>
          {section.text}
        </Text>
      </View>
    );
  }

  if (section.type === "heading") {
    return (
      <Text variant="h2" className="mt-6 mb-3">
        {section.text}
      </Text>
    );
  }

  if (section.type === "paragraph") {
    return (
      <Text variant="body" className="mb-3" style={{ lineHeight: 24 }}>
        {section.text}
      </Text>
    );
  }

  if (section.type === "step") {
    return (
      <View className="flex-row gap-3 mb-4 items-start">
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.bordeaux.DEFAULT }}
        >
          <Text style={{ color: colors.white, fontWeight: "700" }}>
            {section.number}
          </Text>
        </View>
        <View className="flex-1">
          <Text variant="body-medium" className="mb-1">
            {section.title}
          </Text>
          <Text variant="body" style={{ lineHeight: 22 }}>
            {section.text}
          </Text>
        </View>
      </View>
    );
  }

  if (section.type === "callout") {
    return (
      <Card
        className="mb-4"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: colors.ocre.DEFAULT,
          backgroundColor: colors.cream.light,
        }}
      >
        <Text variant="label" className="mb-1">
          💡 Astuce SB Haircare
        </Text>
        <Text variant="body" style={{ lineHeight: 22 }}>
          {section.text}
        </Text>
      </Card>
    );
  }

  if (section.type === "image") {
    return (
      <View className="my-4">
        <Image
          source={section.src}
          style={{ width: "100%", height: 200, borderRadius: 14 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return null;
}
