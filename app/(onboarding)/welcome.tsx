import { View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1 items-center justify-center px-2">
        <Text variant="label" className="mb-3">
          SB Haircare
        </Text>
        <Text variant="display" className="text-center mb-3">
          Ton rituel{"\n"}commence ici
        </Text>
        <Text
          variant="body"
          className="text-center text-ink-soft mb-12 max-w-[300px]"
        >
          Comprends tes cheveux, suis tes rituels, vois ta croissance.
        </Text>
        <Button
          label="Commencer le diagnostic"
          className="w-full max-w-[320px]"
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </ScreenContainer>
  );
}
