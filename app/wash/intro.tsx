import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { useWashFlow } from "@/store/washFlow";

export default function WashIntro() {
  const router = useRouter();
  const flow = useWashFlow((s) => s.flow);

  if (!flow) {
    router.replace("/wash/select");
    return null;
  }

  return (
    <ScreenContainer scroll={false}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text variant="body-medium" className="text-bordeaux">
          ✕
        </Text>
      </Pressable>

      <View className="flex-1 items-center justify-center px-2">
        <Text variant="label" className="mb-3">
          {flow.title}
        </Text>
        <Text variant="display" className="text-center mb-3">
          Prêt(e) à{"\n"}commencer ?
        </Text>
        <Text
          variant="body"
          className="text-center text-ink-soft mb-12 max-w-[320px]"
        >
          {flow.description ?? "Suis chaque étape avec son minuteur."}
        </Text>
        <Button
          label="Ready!"
          className="w-full max-w-[320px] mb-3"
          onPress={() => router.push("/wash/step")}
        />
        <Button
          label="Need to gather supplies"
          variant="ghost"
          className="w-full max-w-[320px]"
          onPress={() => router.replace("/(tabs)/washday")}
        />
      </View>
    </ScreenContainer>
  );
}
