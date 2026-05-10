import { View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";

export default function LearnScreen() {
  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Apprendre
      </Text>
      <Text variant="h1" className="mb-6">
        Recettes & rituels
      </Text>

      <Card variant="bordeaux" className="mb-6">
        <Text variant="label" className="text-ocre-soft mb-2">
          Défi en cours
        </Text>
        <Text variant="h2" className="text-white mb-1">
          Défi pousse 2026
        </Text>
        <Text variant="body" className="text-cream">
          Rejoins le défi communauté · 365 jours
        </Text>
      </Card>

      <Text variant="h3" className="mb-3">
        Recettes DIY
      </Text>
      <View className="gap-3 mb-6">
        {[
          ["Herbes naturelles pour la pousse", "Mélange pousse"],
          ["Huile chaude DIY", "Soin à l'huile"],
          ["Masque à l'argile", "Masque clarifiant"],
          ["Graines de lin + aloe", "Glisse + hydratation"],
          ["Rinçage hibiscus", "Brillance"],
        ].map(([name, tag]) => (
          <Card key={name}>
            <Text variant="h3">{name}</Text>
            <Text variant="caption" className="mt-1">
              {tag}
            </Text>
          </Card>
        ))}
      </View>

      <Text variant="h3" className="mb-3">
        Articles
      </Text>
      <View className="gap-3">
        {[
          "Comment faire son bain d'huile",
          "La rétention de longueur",
          "Les poudres ayurvédiques",
          "La pousse : mythes et réalités",
        ].map((title) => (
          <Card key={title} variant="outline">
            <Text variant="body-medium">{title}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
