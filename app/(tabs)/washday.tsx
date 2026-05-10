import { View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function WashdayScreen() {
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
        <Button variant="secondary" label="Lancer le flow" />
      </Card>

      <Text variant="h3" className="mb-3">
        Flows rapides
      </Text>
      <View className="gap-3 mb-6">
        {[
          ["Rituel bain d'huile", "45 min"],
          ["Masque ayurvédique", "60 min"],
          ["Hydrater", "10 min"],
          ["Remise en forme du cuir chevelu", "5 min"],
          ["Dormir en satin", "5 min"],
        ].map(([name, dur]) => (
          <Card key={name} variant="outline">
            <Text variant="h3">{name}</Text>
            <Text variant="caption" className="mt-1">
              {dur}
            </Text>
          </Card>
        ))}
      </View>

      <Text variant="h3" className="mb-3">
        Calendrier
      </Text>
      <Card>
        <Text variant="body" className="text-ink-muted">
          Calendrier wash day à venir
        </Text>
      </Card>
    </ScreenContainer>
  );
}
