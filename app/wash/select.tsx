import { ScrollView, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { useWashDayFlows } from "@/lib/washFlows";
import { useWashFlow } from "@/store/washFlow";

export default function SelectFlow() {
  const router = useRouter();
  const { data: flows, isLoading } = useWashDayFlows();
  const start = useWashFlow((s) => s.start);

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} hitSlop={12} className="mb-4">
        <Text variant="body-medium" className="text-bordeaux">
          ← Retour
        </Text>
      </Pressable>

      <Text variant="label" className="mb-2">
        Planifier un flow
      </Text>
      <Text variant="h1" className="mb-2">
        Quel rituel ?
      </Text>
      <Text variant="body" className="text-ink-soft mb-6">
        Sélectionne une routine à lancer maintenant.
      </Text>

      {isLoading ? (
        <Text variant="body" className="text-ink-muted">
          Chargement…
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            {(flows ?? []).map((flow) => (
              <Pressable
                key={flow.id}
                onPress={() => {
                  start(flow);
                  router.push("/wash/intro");
                }}
              >
                <Card variant="outline">
                  <Text variant="h3" className="mb-1">
                    {flow.title}
                  </Text>
                  <Text variant="caption">
                    {flow.steps.length} étapes · {flow.total_duration_min} min
                  </Text>
                </Card>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
