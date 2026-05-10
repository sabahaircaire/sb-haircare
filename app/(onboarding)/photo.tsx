import { useState } from "react";
import { View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { OnboardingShell } from "@/components/OnboardingShell";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useOnboarding } from "@/store/onboarding";

export default function PhotoStep() {
  const router = useRouter();
  const { answers, set } = useOnboarding();
  const [uri, setUri] = useState<string | undefined>(answers.diagnostic_photo_uri);

  const pickImage = async () => {
    // Lazy import to avoid bundling on first render
    const ImagePicker = await import("expo-image-picker");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets?.[0]) {
      const u = result.assets[0].uri;
      setUri(u);
      set({ diagnostic_photo_uri: u });
    }
  };

  return (
    <OnboardingShell
      step={6}
      total={7}
      title="Une photo (optionnel)"
      subtitle="Pour un diagnostic plus précis. Cheveux secs, vue de face ou côté."
      onNext={() => router.push("/(onboarding)/diagnostic")}
      nextLabel={uri ? "Continuer" : "Passer cette étape"}
    >
      <Pressable onPress={pickImage} className="flex-1">
        <Card
          variant="outline"
          className="flex-1 items-center justify-center min-h-[280px]"
        >
          {uri ? (
            <Image
              source={{ uri }}
              style={{ width: "100%", height: 280, borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <View className="items-center px-6">
              <Text variant="h3" className="mb-2">
                Ajouter une photo
              </Text>
              <Text variant="caption" className="text-center">
                Touche ici pour choisir une photo de tes cheveux
              </Text>
            </View>
          )}
        </Card>
      </Pressable>
    </OnboardingShell>
  );
}
