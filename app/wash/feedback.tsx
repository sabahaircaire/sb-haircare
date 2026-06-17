import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Choice } from "@/components/Choice";
import { Button } from "@/components/Button";
import { useWashFlow } from "@/store/washFlow";
import { saveWashDayLog } from "@/lib/washDayLog";

export default function WashFeedback() {
  const router = useRouter();
  const flow = useWashFlow((s) => s.flow);
  const results = useWashFlow((s) => s.results);
  const feedback = useWashFlow((s) => s.feedback);
  const setFeedback = useWashFlow((s) => s.setFeedback);
  const reset = useWashFlow((s) => s.reset);

  const finalize = async () => {
    if (flow && !flow.id.startsWith("local_")) {
      try {
        await saveWashDayLog({
          flowId: flow.id,
          results,
          feedback,
        });
      } catch {
        // ignore — local flow or unauthenticated
      }
    }
    reset();
    router.replace("/wash/complete");
  };

  return (
    <ScreenContainer scroll={false}>
      <Pressable onPress={finalize} hitSlop={12}>
        <Text variant="body-medium" className="text-bordeaux">
          ✕
        </Text>
      </Pressable>

      <View className="flex-1 px-2 justify-center">
        <Text variant="h2" className="text-center mb-8">
          Comment sens-tu{"\n"}tes cheveux ?
        </Text>

        <View>
          <Choice
            label="Au top ! ✨"
            selected={feedback === "amazing"}
            onPress={() => setFeedback("amazing")}
          />
          <Choice
            label="Bien"
            selected={feedback === "good"}
            onPress={() => setFeedback("good")}
          />
          <Choice
            label="Peut mieux faire"
            selected={feedback === "could_be_better"}
            onPress={() => setFeedback("could_be_better")}
          />
        </View>

        <Button
          label="Terminer"
          className="mt-6"
          onPress={finalize}
          disabled={!feedback}
        />
      </View>
    </ScreenContainer>
  );
}
