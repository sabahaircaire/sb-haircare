import { View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Profil
      </Text>
      <Text variant="h1" className="mb-6">
        Tes résultats
      </Text>

      <Card className="mb-4 items-center">
        <View className="w-20 h-20 rounded-full bg-cream-warm items-center justify-center mb-3">
          <Text variant="h1">A</Text>
        </View>
        <Text variant="h2">Ash</Text>
        <Text variant="caption" className="mt-1">
          Jour 21 sur 365
        </Text>
      </Card>

      <View className="flex-row gap-3 mb-4">
        <Card className="flex-1">
          <Text variant="label" className="mb-1">
            Type
          </Text>
          <Text variant="h3">4B</Text>
        </Card>
        <Card className="flex-1">
          <Text variant="label" className="mb-1">
            Porosité
          </Text>
          <Text variant="h3">Faible</Text>
        </Card>
      </View>

      <View className="flex-row gap-3 mb-6">
        <Card className="flex-1">
          <Text variant="label" className="mb-1">
            Longueur actuelle
          </Text>
          <Text variant="h3">Épaules</Text>
        </Card>
        <Card variant="bordeaux" className="flex-1">
          <Text variant="label" className="text-ocre-soft mb-1">
            Objectif
          </Text>
          <Text variant="h3" className="text-white">
            Coccyx
          </Text>
        </Card>
      </View>

      <Text variant="h3" className="mb-3">
        Ta routine
      </Text>
      <Card>
        <Text variant="label" className="mb-2">
          Quotidien
        </Text>
        <Text variant="body" className="mb-1">
          · Rituel d'huile
        </Text>
        <Text variant="body" className="mb-3">
          · Dormir en satin
        </Text>
        <Text variant="label" className="mb-2">
          Hebdomadaire
        </Text>
        <Text variant="body" className="mb-1">
          · Jour de lavage
        </Text>
        <Text variant="body">· Remise en forme du cuir chevelu (5 min)</Text>
      </Card>
    </ScreenContainer>
  );
}
