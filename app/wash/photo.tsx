import { View, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useWashFlow } from "@/store/washFlow";

export default function WashPhoto() {
  const router = useRouter();
  const afterPhotoUri = useWashFlow((s) => s.afterPhotoUri);
  const setAfterPhoto = useWashFlow((s) => s.setAfterPhoto);

  const pickImage = async () => {
    const ImagePicker = await import("expo-image-picker");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]) {
      setAfterPhoto(result.assets[0].uri);
    }
  };

  return (
    <ScreenContainer scroll={false}>
      <Pressable onPress={() => router.replace("/wash/feedback")} hitSlop={12}>
        <Text variant="body-medium" className="text-bordeaux">
          ✕
        </Text>
      </Pressable>

      <View className="flex-1 items-center justify-center px-4">
        <Text variant="label" className="mb-3">
          📸 Photo
        </Text>
        <Text variant="h2" className="text-center mb-8">
          Ta progression
        </Text>

        <Pressable onPress={pickImage} className="w-full max-w-[340px] mb-6">
          <Card variant="outline" className="items-center justify-center min-h-[260px]">
            {afterPhotoUri ? (
              <Image
                source={{ uri: afterPhotoUri }}
                style={{ width: "100%", height: 260, borderRadius: 16 }}
                resizeMode="cover"
              />
            ) : (
              <Text variant="caption">Touche pour choisir une photo</Text>
            )}
          </Card>
        </Pressable>

        {afterPhotoUri ? (
          <>
            <Button
              label="Valider"
              className="w-full max-w-[280px] mb-3"
              onPress={() => router.replace("/wash/feedback")}
            />
            <Pressable onPress={pickImage}>
              <Text variant="caption" className="text-ink-muted">
                Changer de photo
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Button
              label="Ajouter une photo"
              className="w-full max-w-[280px] mb-3"
              onPress={pickImage}
            />
            <Pressable onPress={() => router.replace("/wash/feedback")}>
              <Text variant="caption" className="text-ink-muted">
                Ignorer
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
