import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useWashDayFlows } from "@/lib/washFlows";
import { useWashFlow } from "@/store/washFlow";

export default function WashdayScreen() {
  const router = useRouter();
  const { data: flows } = useWashDayFlows();
  const start = useWashFlow((s) => s.start);

  const featured =
    flows?.find((f) => f.code === "jour_de_lavage") ?? flows?.[0];

  const launch = (code?: string) => {
    if (!flows) return;
    const flow = code ? flows.find((f) => f.code === code) : featured;
    if (!flow) return;
    start(flow);
    router.push("/wash/intro");
  };

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Aujourd'hui
      </Text>
      <Text variant="h1" className="mb-6">
        Wash Day Journal
      </Text>

      <Card variant="bordeaux" className="mb-4">
        <Text variant="label" className="text-ocre-soft mb-2">
          Prochain wash day
        </Text>
        <Text variant="h2" className="text-white mb-3">
          Dimanche 12 mai
        </Text>
        <Button
          variant="secondary"
          label="Lancer le flow"
          onPress={() => launch()}
        />
      </Card>

      <Text variant="h3" className="mb-3">
        Flows rapides
      </Text>
      <View className="gap-3 mb-6">
        {(flows ?? []).map((flow) => (
          <Pressable key={flow.id} onPress={() => launch(flow.code)}>
            <Card variant="outline">
              <Text variant="h3">{flow.title}</Text>
              <Text variant="caption" className="mt-1">
                {flow.steps.length} étapes · {flow.total_duration_min} min
              </Text>
            </Card>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={() => router.push("/wash/select")}>
        <Card>
          <Text variant="body-medium" className="text-bordeaux">
            Voir tous les rituels →
          </Text>
        </Card>
      </Pressable>
    </ScreenContainer>
  );
}
