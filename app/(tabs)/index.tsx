import { View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View className="mb-2">
        <Text variant="label">@4BMediumCrown · Porosité moyenne</Text>
      </View>
      <Text variant="display" className="mb-1">
        Bonjour Ash
      </Text>
      <Text variant="caption" className="mb-6">
        Jour 21 sur 365 de ton année de croissance
      </Text>

      <Card variant="bordeaux" className="mb-4">
        <Text variant="label" className="text-ocre-soft mb-2">
          Conseil du jour
        </Text>
        <Text variant="h2" className="text-white mb-1">
          Hydrate tous les 2-3 jours
        </Text>
        <Text variant="body" className="text-cream">
          Pour garder tes coils souples et éviter la casse en pointes.
        </Text>
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Focus de la semaine
        </Text>
        <Text variant="h3" className="mb-2">
          Méthode LOC + protéines légères
        </Text>
        <Text variant="body" className="text-ink-soft">
          Suis ta méthode LOC/LCO • Soin protéiné léger • Foulard satin la nuit
        </Text>
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Missions du jour
        </Text>
        <View className="gap-3">
          <Text variant="body">○ Hydrater les pointes (+10 XP)</Text>
          <Text variant="body">○ Massage cuir chevelu 3-5 min (+15 XP)</Text>
          <Text variant="body">○ Bonnet satin pour la nuit (+10 XP)</Text>
        </View>
      </Card>

      <Card variant="outline">
        <Text variant="label" className="mb-1">
          Série en cours
        </Text>
        <Text variant="h2">7 jours 🔥</Text>
        <Text variant="caption" className="mt-1">
          Plus que 6 jours avant ton premier palier
        </Text>
      </Card>
    </ScreenContainer>
  );
}
